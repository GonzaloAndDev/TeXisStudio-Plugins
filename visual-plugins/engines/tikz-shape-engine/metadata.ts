import { registerEditorMetadata } from "../../common/contracts/types.js";
import type { TikzShapeDocument } from "./types.js";

registerEditorMetadata({
  engineId: "tikz-shape-engine",
  helpTopic: "figures",
  capabilities: {
    historySupported: true,
    restoreSupported: true,
    advancedCodeSupported: false,
    previewSupported: false,
  },
  technicalFields: [
    {
      key: "tikzLibraries",
      label: "TikZ libraries",
      description: "Comma-separated list of extra TikZ libraries (e.g. arrows.meta, patterns).",
      type: "string",
    },
  ],
  defaultDoc(): TikzShapeDocument {
    return {
      engineId: "tikz-shape-engine",
      version: "1.0",
      tikzLibraries: ["arrows.meta"],
      viewBox: { width: 6, height: 4, unit: "cm" },
      shapes: [
        {
          id: "s1",
          type: "rectangle",
          coords: [{ x: 1, y: 1 }, { x: 3, y: 3 }],
          color: "black",
          fill: "blue!10",
          label: "Box",
        },
        {
          id: "s2",
          type: "arrow",
          coords: [{ x: 3, y: 2 }, { x: 5, y: 2 }],
          arrowTip: "-Stealth",
          color: "black",
        },
        {
          id: "s3",
          type: "label",
          coords: [{ x: 5.2, y: 2 }],
          label: "Output",
        },
      ],
    };
  },
});
