import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { FigureManifest } from "../manifest/schema.js";
import { MANIFEST_FILENAME, figurePath } from "../manifest/schema.js";
import { validateManifest } from "../manifest/validator.js";
import type { EditableSource } from "../contracts/types.js";

/**
 * Persists and loads figure assets following the canonical layout
 * (Etapa 0.4):
 *
 *   texisstudio-assets/figures/<id>/
 *     manifest.json
 *     source.json     ← editable source (re-openable)
 *     output.tex      ← LaTeX-native output
 *     output.pdf / output.svg / preview.png (as available)
 *
 * The store is filesystem-backed and rooted at a project directory, so a
 * plugin can never write outside the project (plan §5.10 security).
 */
export interface FigureWriteInput {
  manifest: FigureManifest;
  source: EditableSource;
  tex?: string;
  svg?: string;
  pdfBytes?: Uint8Array;
  previewBytes?: Uint8Array;
}

export interface LoadedFigure {
  manifest: FigureManifest;
  source: EditableSource;
  tex: string | null;
}

export class FigureStore {
  constructor(private readonly projectRoot: string) {}

  /** Absolute path to a figure's asset directory. */
  figureDir(figureId: string): string {
    return join(this.projectRoot, figurePath(figureId));
  }

  /** Writes all provided artifacts atomically-ish; validates manifest first. */
  write(input: FigureWriteInput): { dir: string } {
    const manifestCheck = validateManifest(input.manifest);
    if (!manifestCheck.valid) {
      const msgs = manifestCheck.issues.filter(i => i.severity === "error").map(i => i.message).join("; ");
      throw new Error(`Refusing to write invalid manifest for ${input.manifest.id}: ${msgs}`);
    }

    const dir = this.figureDir(input.manifest.id);
    mkdirSync(dir, { recursive: true });

    writeFileSync(join(dir, MANIFEST_FILENAME), JSON.stringify(input.manifest, null, 2), "utf8");
    writeFileSync(join(dir, input.manifest.sourceFile), JSON.stringify(input.source, null, 2), "utf8");

    if (input.tex !== undefined && input.manifest.latexFile) {
      writeFileSync(join(dir, input.manifest.latexFile), input.tex, "utf8");
    }
    if (input.svg !== undefined && input.manifest.svgFile) {
      writeFileSync(join(dir, input.manifest.svgFile), input.svg, "utf8");
    }
    if (input.pdfBytes && input.manifest.pdfFile) {
      writeFileSync(join(dir, input.manifest.pdfFile), input.pdfBytes);
    }
    if (input.previewBytes && input.manifest.previewFile) {
      writeFileSync(join(dir, input.manifest.previewFile), input.previewBytes);
    }

    return { dir };
  }

  /** Loads a figure by id for re-editing. Returns null if not found. */
  load(figureId: string): LoadedFigure | null {
    const dir = this.figureDir(figureId);
    const manifestPath = join(dir, MANIFEST_FILENAME);
    if (!existsSync(manifestPath)) return null;

    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as FigureManifest;
    const sourcePath = join(dir, manifest.sourceFile);
    if (!existsSync(sourcePath)) return null;

    const source = JSON.parse(readFileSync(sourcePath, "utf8")) as EditableSource;
    const tex = manifest.latexFile && existsSync(join(dir, manifest.latexFile))
      ? readFileSync(join(dir, manifest.latexFile), "utf8")
      : null;

    return { manifest, source, tex };
  }

  exists(figureId: string): boolean {
    return existsSync(join(this.figureDir(figureId), MANIFEST_FILENAME));
  }
}
