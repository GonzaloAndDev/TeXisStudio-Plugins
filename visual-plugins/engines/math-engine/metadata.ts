import { registerEditorMetadata } from "../../common/contracts/types.js";
import type { MathEngineDocument } from "./types.js";

registerEditorMetadata({
  engineId: "math-engine",
  helpTopic: "latex",
  capabilities: {
    historySupported: true,
    restoreSupported: true,
    advancedCodeSupported: false,
    previewSupported: false,
  },
  technicalFields: [
    {
      key: "label",
      labelKey: "visual_editor.fields.math_label.label",
      descriptionKey: "visual_editor.fields.math_label.description",
      type: "string",
    },
  ],
  defaultDoc(): MathEngineDocument {
    return {
      engineId: "math-engine",
      version: "1.0",
      mode: "equation",
      numbered: true,
      label: "",
      tree: [
        { type: "symbol", content: "x = " },
        {
          type: "fraction",
          content: "",
          children: [
            { type: "symbol", content: "-b \\pm \\sqrt{b^2 - 4ac}" },
            { type: "symbol", content: "2a" },
          ],
        },
      ],
    };
  },
});
