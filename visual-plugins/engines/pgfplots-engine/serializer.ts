import type { PGFPlotsDocument, DataSeries, AxisScale } from "./types.js";

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

function seriesCoords(s: DataSeries): string {
  const lines: string[] = [];

  // ── Heatmap ──────────────────────────────────────────────────────────────
  // Uses scatter+only marks+square mark with explicit point meta for color.
  // Each data point: (x,y) [meta_value] — meta drives the colormap.
  if (s.plotType === "heatmap") {
    if (!s.data || s.data.length === 0) {
      lines.push("  % heatmap: no data provided");
    } else {
      const coords = s.data.map(d => {
        const meta = d.meta ?? d.y;
        return `(${d.x}, ${d.y}) [${meta.toFixed(3)}]`;
      }).join(" ");
      lines.push(
        `  \\addplot[`,
        `    scatter, only marks, mark=square*, mark size=20pt,`,
        `    point meta=explicit`,
        `  ] coordinates { ${coords} };`,
      );
      if (s.label) lines.push(`  \\addlegendentry{${s.label}}`);
    }
    return lines.join("\n");
  }

  // ── Boxplot ─────────────────────────────────────────────────────────────
  if (s.plotType === "boxplot") {
    if (!s.data || s.data.length === 0) {
      lines.push("  % boxplot: no data provided");
    } else {
      const color = s.color ?? "blue";
      s.data.forEach(d => {
        const med = d.y;
        const iqr = d.error ?? 5;
        const q1 = med - iqr;
        const q3 = med + iqr;
        const whiskerLow  = q1 - 1.5 * iqr;
        const whiskerHigh = q3 + 1.5 * iqr;
        lines.push(
          `  \\addplot+[`,
          `    boxplot prepared={`,
          `      lower whisker=${whiskerLow.toFixed(2)},`,
          `      lower quartile=${q1.toFixed(2)},`,
          `      median=${med.toFixed(2)},`,
          `      upper quartile=${q3.toFixed(2)},`,
          `      upper whisker=${whiskerHigh.toFixed(2)}`,
          `    }, fill=${color}!20, draw=${color}`,
          `  ] coordinates {};`,
        );
      });
      if (s.label) lines.push(`  \\addlegendentry{${s.label}}`);
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
      if (s.label) lines.push(`  \\addlegendentry{${s.label}}`);
    }
    return lines.join("\n");
  }

  // ── Function / scatter / bar / other ────────────────────────────────────
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
  const hasHeatmap = doc.series.some(s => s.plotType === "heatmap");
  const hasBoxplot = doc.series.some(s => s.plotType === "boxplot");

  // For heatmap: use a special axis type; for boxplot: use boxplot axis
  let env = axisEnv(doc.xScale, doc.yScale);
  const axisOpts: string[] = [];

  if (doc.xLabel) axisOpts.push(`xlabel={${doc.xLabel}}`);
  if (doc.yLabel) axisOpts.push(`ylabel={${doc.yLabel}}`);
  if (doc.grid && !hasHeatmap) {
    const g = doc.grid === true ? "major" : doc.grid;
    axisOpts.push(`grid=${g}`);
  }
  if (doc.showLegend) axisOpts.push("legend pos=north west");

  if (hasHeatmap) {
    // Heatmap: colorbar, inline red-white-blue colormap (no library needed)
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

  if (doc.pgfplotsOptions) axisOpts.push(doc.pgfplotsOptions);

  const axisOptsStr = axisOpts.length > 0 ? `[\n    ${axisOpts.join(",\n    ")}\n  ]` : "";
  const plots = doc.series.map(seriesCoords).join("\n");

  // Heatmap and boxplot need the boxplot library
  const extraSetup: string[] = [];
  if (hasBoxplot) extraSetup.push("\\usetikzlibrary{pgfplots.statistics}");

  return [
    ...extraSetup,
    `\\begin{tikzpicture}`,
    `  \\begin{${env}}${axisOptsStr}`,
    plots,
    `  \\end{${env}}`,
    `\\end{tikzpicture}`,
  ].join("\n");
}
