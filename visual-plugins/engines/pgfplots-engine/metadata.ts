import { registerEditorMetadata } from "../../common/contracts/types.js";
import type { PGFPlotsDocument } from "./types.js";

const DEFAULT_DOC: PGFPlotsDocument = {
  engineId: "pgfplots-engine",
  version: "1.0.0",
  series: [{
    id: "s1",
    label: "f(x) = sin(x)",
    plotType: "function2d",
    expression: "sin(x)",
    domain: [-6.28, 6.28],
    color: "blue",
  }],
  xLabel: "x",
  yLabel: "y",
  xScale: "linear",
  yScale: "linear",
  showLegend: true,
  grid: "major",
};

registerEditorMetadata({
  engineId: "pgfplots-engine",
  helpTopic: "figures",
  capabilities: {
    historySupported: true,
    restoreSupported: true,
    advancedCodeSupported: false,
    previewSupported: false,
  },
  technicalFields: [
    {
      key: "pgfplotsOptions",
      label: "pgfplotsOptions",
      description: "Extra options injected into \\begin{axis}[…]. For example: xbar, compat=1.18",
      type: "textarea",
    },
  ],
  defaultDoc: () => DEFAULT_DOC,
  description: "Plots, histograms, bar charts, scatter plots, and heat maps via PGFPlots",
});
