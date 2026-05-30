# Visual Plugin SDK

## Quickstart

A plugin exposes three things: identity, a `create()` method, and an `edit()` method.
Everything else is handled by the shared infrastructure.

```typescript
import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "@texisstudio/plugin-contracts";
import { buildLatexInputBlock } from "@texisstudio/plugin-export";

export class MyPlugin implements VisualDiagramPlugin {
  readonly pluginId = "my-plugin";
  readonly displayName = "My Diagram";
  readonly description = "Short description for the plugin selector.";
  readonly category = "mathematics";
  readonly engineId = "tikz-shape-engine";
  readonly qualityLevel = "official-core";
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    // Open your visual editor, collect user input, return result
  }

  async edit(existingFigurePath: string): Promise<VisualFigureResult> {
    // Load source.json, open editor pre-filled, return updated result
  }

  async validate(result: VisualFigureResult): Promise<ValidationResult> {
    // Run standard + domain-specific validation
  }

  exportLatexBlock(result: VisualFigureResult): string {
    return buildLatexInputBlock({
      figureId: result.figureId,
      inputPath: result.outputPaths.tex!,
      caption: "Your caption here.",
      label: "fig:your-label",
    });
  }
}
```

## Manifest

Every plugin must write a `manifest.json` into the figure folder:

```json
{
  "id": "fig_0001",
  "pluginId": "my-plugin",
  "pluginVersion": "1.0.0",
  "engineId": "tikz-shape-engine",
  "title": "Human-readable figure title",
  "preferredOutput": "latex",
  "sourceFile": "source.json",
  "latexFile": "output.tex",
  "pdfFile": null,
  "svgFile": null,
  "previewFile": "preview.png",
  "requiredPackages": ["tikz"],
  "createdAt": "2026-05-30T00:00:00Z",
  "updatedAt": "2026-05-30T00:00:00Z",
  "qualityLevel": "official-core",
  "editable": true,
  "warnings": []
}
```

## Figure folder layout

```
texisstudio-assets/figures/fig_0001/
  manifest.json   required
  source.json     required (your plugin's internal format)
  output.tex      preferred for LaTeX-native engines
  output.pdf      preferred for external tools
  output.svg      optional
  preview.png     for editor preview only
```

## Output priority

1. LaTeX native → use `buildLatexInputBlock`
2. PDF vector  → use `buildLatexGraphicsBlock` with `.pdf`
3. SVG         → use `buildLatexGraphicsBlock` with `.svg` (verify LaTeX compatibility)
4. PNG         → never as final output; preview only

## Adding a scope warning (extended / experimental plugins)

```typescript
readonly scopeWarning = "Suitable for simplified diagrams in theses. Not a substitute for [professional tool].";
```

The UI will display this warning in the plugin selector.

## Tests required for official-core

See `docs/plugin-quality-standard.md` for all 10 acceptance criteria.
Test fixtures must live in `tests/visual-plugins/fixtures/<pluginId>/`.
