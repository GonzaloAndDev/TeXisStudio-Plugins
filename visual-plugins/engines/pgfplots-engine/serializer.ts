import type { PGFPlotsDocument, DataSeries, AxisScale } from "./types.js";

function axisEnv(xScale: AxisScale, yScale: AxisScale): string {
  if (xScale === "log" && yScale === "log") return "loglogaxis";
  if (xScale === "log") return "semilogxaxis";
  if (yScale === "log") return "semilogyaxis";
  return "axis";
}

function seriesMark(s: DataSeries): string {
  if (s.mark) return s.mark;
  return s.plotType === "scatter" ? "*" : "none";
}

function seriesOptions(s: DataSeries): string {
  const parts: string[] = [];
  if (s.color) parts.push(`color=${s.color}`);
  const mark = seriesMark(s);
  if (mark !== "none") parts.push(`mark=${mark}`);
  // NOTE: legend entry is NOT a valid \addplot option — labels are added via
  // \addlegendentry{} after the plot command (see seriesCoords).
  return parts.join(", ");
}

function seriesCoords(s: DataSeries): string {
  const lines: string[] = [];

  if (s.expression) {
    const domain = s.domain ? `domain=${s.domain[0]}:${s.domain[1]}, ` : "";
    const opts = seriesOptions(s);

    if (s.plotType === "parametric") {
      // Parametric: \addplot[variable=x, samples=80, domain=...] (<x-expr>,<y-expr>);
      // Expression must be a bare coordinate pair (x-expr,y-expr), NOT wrapped in {}.
      // variable=x so expressions like ({cos(deg(x))},{sin(deg(x))}) work directly.
      const optStr = (`variable=x, samples=80, ${domain}${opts}`).replace(/,\s*$/, "").trim();
      lines.push(`  \\addplot${optStr ? `[${optStr}]` : ""} ${s.expression};`);
    } else {
      const optStr = (domain + opts).replace(/,\s*$/, "").trim();
      lines.push(`  \\addplot${optStr ? `[${optStr}]` : ""} {${s.expression}};`);
    }
  } else if (s.data && s.data.length > 0) {
    const opts = seriesOptions(s);
    const coords = s.data.map(d => `(${d.x}, ${d.y})`).join(" ");
    lines.push(`  \\addplot${opts ? `[${opts}]` : ""} coordinates { ${coords} };`);
  } else {
    lines.push("  % no data or expression provided");
  }

  // Correct way to add a legend entry in pgfplots:
  if (s.label) {
    lines.push(`  \\addlegendentry{${s.label}}`);
  }

  return lines.join("\n");
}

export function serializePGFPlots(doc: PGFPlotsDocument): string {
  const env = axisEnv(doc.xScale, doc.yScale);
  const axisOpts: string[] = [];

  if (doc.xLabel) axisOpts.push(`xlabel={${doc.xLabel}}`);
  if (doc.yLabel) axisOpts.push(`ylabel={${doc.yLabel}}`);
  if (doc.grid) {
    const g = doc.grid === true ? "major" : doc.grid;
    axisOpts.push(`grid=${g}`);
  }
  if (doc.showLegend) axisOpts.push("legend pos=north west");
  if (doc.pgfplotsOptions) axisOpts.push(doc.pgfplotsOptions);

  const axisOptsStr = axisOpts.length > 0 ? `[\n    ${axisOpts.join(",\n    ")}\n  ]` : "";
  const plots = doc.series.map(seriesCoords).join("\n");

  return [
    `\\begin{tikzpicture}`,
    `  \\begin{${env}}${axisOptsStr}`,
    plots,
    `  \\end{${env}}`,
    `\\end{tikzpicture}`,
  ].join("\n");
}
