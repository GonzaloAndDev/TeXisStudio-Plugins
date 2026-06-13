import { registerEditorMetadata } from "../../common/contracts/types.js";
import type { ChemEngineDocument } from "./types.js";

registerEditorMetadata({
  engineId: "chemistry-engine",
  helpTopic: "latex",
  capabilities: {
    historySupported: true,
    restoreSupported: true,
    advancedCodeSupported: false,
    previewSupported: false,
  },
  technicalFields: [
    {
      key: "preferredOutput",
      labelKey: "visual_editor.fields.chemistry_output.label",
      descriptionKey: "visual_editor.fields.chemistry_output.description",
      type: "string",
    },
  ],
  defaultDoc(): ChemEngineDocument {
    return {
      engineId: "chemistry-engine",
      version: "1.0",
      preferredOutput: "mhchem",
      elements: [
        {
          type: "reaction",
          reactants: [
            { type: "formula", text: "H2" },
            { type: "formula", text: "O2" },
          ],
          products: [{ type: "formula", text: "H2O" }],
          arrow: "->",
        },
      ],
    };
  },
});
