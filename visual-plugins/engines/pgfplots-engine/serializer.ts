import type { PGFPlotsDocument, DataSeries, AxisScale } from "./types.js";

/** Escape LaTeX text-mode specials while preserving inline math ($...$). */
function escapeLabel(text: string): string {
  return text
    .split(/(\$[^$]*\$)/g)
    .map(part =>
      part.startsWith("$") && part.endsWith("$")
        ? part
        : part
            .replace(/(?<!\\)&/g, "\\&")
            .replace(/(?<!\\)%/g, "\\%")
            .replace(/(?<!\\)#/g, "\\#")
            .replace(/(?<!\\)_/g, "\\_")
    )
    .join("");
}

function axisEnv(xScale: AxisScale, yScale: AxisScale): string {
  if (xScale === "log" && yScale === "log") return "loglogaxis";
  if (xScale === "log") return "semilogxaxis";
  if (yScale === "log") return "semilogyaxis";
  return "axis";
}

function seriesMark(s: DataSeries): string {
  if (s.mark) return s.mark;
  if (s.plotType === "scatter" || s.plotType === "errorbar") return "*";
  return "none";
}

function seriesOptions(s: DataSeries): string {
  const parts: string[] = [];
  if (s.color) parts.push(`color=${s.color}`);
  const mark = seriesMark(s);
  if (mark !== "none") parts.push(`mark=${mark}`);
  return parts.join(", ");
}

function compactOptions(parts: Array<string | undefined>): string {
  return parts
    .map(part => part?.trim())
    .filter((part): part is string => !!part)
    .join(", ");
}

/** Returns a safe color name for fill/draw — rejects empty strings, preserves compound
 *  xcolor expressions like "blue!60" without appending another mix percentage. */
function safeColor(raw: string | undefined): string {
  return raw?.trim() || "blue";
}

/** Serializes one data point as a PGFPlots coordinate pair.
 *  xbar expects (value, position) — i.e. (y, x) — so horizontal bars transpose. */
function serializePoint(d: { x: number; y: number }, direction: "xbar" | "ybar"): string {
  return direction === "xbar" ? `(${d.y}, ${d.x})` : `(${d.x}, ${d.y})`;
}

interface SeriesContext {
  /** Whether the document uses horizontal bars (xbar) or vertical (ybar). */
  barDirection: "ybar" | "xbar";
}

function seriesCoords(s: DataSeries, ctx: SeriesContext = { barDirection: "ybar" }): string {
  const lines: string[] = [];

  // ── Heatmap ──────────────────────────────────────────────────────────────
  // `matrix plot*` tesela una grilla regular: cada (x,y) se vuelve una celda
  // coloreada por su `meta`, alineada correctamente sea cual sea la escala de
  // ejes (a diferencia de marcadores cuadrados de tamaño fijo en pt, que dejan
  // huecos/solapes). Requiere `mesh/cols` = nº de columnas de la grilla.
  if (s.plotType === "heatmap") {
    if (!s.data || s.data.length === 0) {
      lines.push("  % heatmap: no data provided");
    } else {
      const cols = new Set(s.data.map(d => d.x)).size || 1;
      const coords = s.data.map(d => {
        const meta = d.meta ?? d.y;
        return `(${d.x}, ${d.y}) [${meta.toFixed(3)}]`;
      }).join(" ");
      lines.push(
        `  \\addplot[`,
        `    matrix plot*, point meta=explicit, mesh/cols=${cols},`,
        `    mesh/ordering=rowwise`,
        `  ] coordinates { ${coords} };`,
      );
      if (s.label) lines.push(`  \\addlegendentry{${escapeLabel(s.label)}}`);
    }
    return lines.join("\n");
  }

  // ── Boxplot ─────────────────────────────────────────────────────────────
  // Usa el resumen de cinco números explícito (q1/median/q3/whiskers) cuando
  // está disponible; si no, lo deriva de y (mediana) ± error como aproximación
  // compatible. Los bigotes por defecto se calculan con el IQR REAL (q3−q1),
  // no con `error` (antes producía bigotes incorrectos al dar q1/q3 explícitos).
  if (s.plotType === "boxplot") {
    if (!s.data || s.data.length === 0) {
      lines.push("  % boxplot: no data provided");
    } else {
      const color = safeColor(s.color);
      s.data.forEach(d => {
        const med = d.y;
        const spread = d.error ?? 5;
        const q1 = d.q1 ?? (med - spread);
        const q3 = d.q3 ?? (med + spread);
        const iqr = q3 - q1;
        const whiskerLow  = d.whiskerMin ?? (q1 - 1.5 * iqr);
        const whiskerHigh = d.whiskerMax ?? (q3 + 1.5 * iqr);
        lines.push(
          `  \\addplot+[`,
          `    boxplot prepared={`,
          `      lower whisker=${whiskerLow.toFixed(2)},`,
          `      lower quartile=${q1.toFixed(2)},`,
          `      median=${med.toFixed(2)},`,
          `      upper quartile=${q3.toFixed(2)},`,
          `      upper whisker=${whiskerHigh.toFixed(2)}`,
          `    }, fill=${color}, fill opacity=0.2, draw=${color}`,
          `  ] coordinates {};`,
        );
      });
      if (s.label) lines.push(`  \\addlegendentry{${escapeLabel(s.label)}}`);
    }
    return lines.join("\n");
  }

  // ── Error bars ───────────────────────────────────────────────────────────
  if (s.plotType === "errorbar") {
    if (!s.data || s.data.length === 0) {
      lines.push("  % errorbar: no data provided");
    } else {
      const opts = seriesOptions(s);
      const coords = s.data.map(d =>
        `(${d.x}, ${d.y}) +- (0, ${d.error ?? 0})`
      ).join(" ");
      lines.push(`  \\addplot[${opts}] plot [error bars/.cd, y dir=both, y explicit] coordinates { ${coords} };`);
      if (s.label) lines.push(`  \\addlegendentry{${escapeLabel(s.label)}}`);
    }
    return lines.join("\n");
  }

  // ── Bar chart ────────────────────────────────────────────────────────────
  if (s.plotType === "bar") {
    if (!s.data || s.data.length === 0) {
      lines.push("  % bar: no data provided");
    } else {
      const color = safeColor(s.color);
      const direction = ctx.barDirection;
      const coords = s.data.map(d => serializePoint(d, direction)).join(" ");
      lines.push(`  \\addplot[${direction}, fill=${color}, fill opacity=0.4, draw=${color}] coordinates { ${coords} };`);
      if (s.label) lines.push(`  \\addlegendentry{${escapeLabel(s.label)}}`);
    }
    return lines.join("\n");
  }

  // ── Histogram ────────────────────────────────────────────────────────────
  if (s.plotType === "histogram") {
    if (!s.data || s.data.length === 0) {
      lines.push("  % histogram: no data provided");
    } else {
      const color = safeColor(s.color);
      const direction = ctx.barDirection === "xbar" ? "xbar interval" : "ybar interval";
      const baseDir = ctx.barDirection;
      const coords = s.data.map(d => serializePoint(d, baseDir)).join(" ");
      lines.push(`  \\addplot[${direction}, fill=${color}, fill opacity=0.4, draw=${color}] coordinates { ${coords} };`);
      if (s.label) lines.push(`  \\addlegendentry{${escapeLabel(s.label)}}`);
    }
    return lines.join("\n");
  }

  // ── Function / scatter / other ───────────────────────────────────────────
  if (s.expression) {
    const domain = s.domain ? `domain=${s.domain[0]}:${s.domain[1]}` : undefined;
    const opts = seriesOptions(s);

    if (s.plotType === "parametric") {
      const optStr = compactOptions(["variable=x", "samples=80", domain, opts]);
      lines.push(`  \\addplot${optStr ? `[${optStr}]` : ""} ${s.expression};`);
    } else if (s.plotType === "surface" || s.plotType === "contour") {
      // 3D surface/contour: requires \addplot3 and domain y= for the second axis
      const domainY = s.domain ? `domain y=${s.domain[0]}:${s.domain[1]}` : undefined;
      const optStr = compactOptions(["samples=20", domain, domainY, opts]);
      const plotType3d = s.plotType === "surface" ? "surf" : "contour gnuplot";
      const plotOpts = compactOptions([plotType3d, optStr]);
      lines.push(`  \\addplot3[${plotOpts}] {${s.expression}};`);
    } else {
      const optStr = compactOptions([domain, opts]);
      lines.push(`  \\addplot${optStr ? `[${optStr}]` : ""} {${s.expression}};`);
    }
  } else if (s.data && s.data.length > 0) {
    const opts = seriesOptions(s);
    const coords = s.data.map(d => `(${d.x}, ${d.y})`).join(" ");
    lines.push(`  \\addplot${opts ? `[${opts}]` : ""} coordinates { ${coords} };`);
  } else {
    lines.push("  % no data or expression provided");
  }

  if (s.label) {
    lines.push(`  \\addlegendentry{${s.label}}`);
  }

  return lines.join("\n");
}

export function serializePGFPlots(doc: PGFPlotsDocument): string {
  const hasHeatmap   = doc.series.some(s => s.plotType === "heatmap");
  const hasBoxplot   = doc.series.some(s => s.plotType === "boxplot");
  const hasBar       = doc.series.some(s => s.plotType === "bar");
  const hasHistogram = doc.series.some(s => s.plotType === "histogram");

  // Detect legacy horizontal-bar documents via pgfplotsOptions so bar/histogram
  // series emit xbar/xbar interval instead of ybar/ybar interval.
  const horizontalBars = /(?:^|,)\s*xbar(?:\s|,|$)/.test(doc.pgfplotsOptions ?? "");
  const barCtx: SeriesContext = { barDirection: horizontalBars ? "xbar" : "ybar" };

  let env = axisEnv(doc.xScale, doc.yScale);
  const axisOpts: string[] = [];

  if (doc.xLabel) axisOpts.push(`xlabel={${escapeLabel(doc.xLabel)}}`);
  if (doc.yLabel) axisOpts.push(`ylabel={${escapeLabel(doc.yLabel)}}`);
  if (doc.grid && !hasHeatmap) {
    const g = doc.grid === true ? "major" : doc.grid;
    axisOpts.push(`grid=${g}`);
  }
  if (doc.showLegend) axisOpts.push("legend pos=north west");

  if (hasHeatmap) {
    axisOpts.push("colorbar");
    axisOpts.push("colormap={bwr}{rgb255=(0,0,180); rgb255=(255,255,255); rgb255=(180,0,0)}");
    axisOpts.push("point meta min=-1, point meta max=1");
    axisOpts.push("axis equal image");
    axisOpts.push("xtick=data, ytick=data");
    axisOpts.push("tick label style={font=\\small}");
    axisOpts.push("colorbar style={ylabel={Correlation}}");
  }

  if (hasBoxplot) {
    axisOpts.push("boxplot/draw direction=y");
    axisOpts.push("xtick=\\empty");
  }

  if (hasBar || hasHistogram) {
    axisOpts.push("bar width=0.4cm");
  }

  if (doc.pgfplotsOptions) axisOpts.push(doc.pgfplotsOptions);

  const axisOptsStr = axisOpts.length > 0 ? `[\n    ${axisOpts.join(",\n    ")}\n  ]` : "";
  const plots = doc.series.map(s => seriesCoords(s, barCtx)).join("\n");

  const extraSetup: string[] = [];
  if (hasBoxplot) extraSetup.push("\\usepgfplotslibrary{statistics}");

  return [
    ...extraSetup,
    `\\begin{tikzpicture}`,
    `  \\begin{${env}}${axisOptsStr}`,
    plots,
    `  \\end{${env}}`,
    `\\end{tikzpicture}`,
  ].join("\n");
}
