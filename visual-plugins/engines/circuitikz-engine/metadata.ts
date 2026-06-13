import { registerEditorMetadata } from "../../common/contracts/types.js";
import type { CircuiTikZDocument } from "./types.js";

registerEditorMetadata({
  engineId: "circuitikz-engine",
  helpTopic: "figures",
  capabilities: {
    historySupported: true,
    restoreSupported: true,
    advancedCodeSupported: false,
    previewSupported: false,
  },
  technicalFields: [
    {
      key: "americanStyle",
      labelKey: "visual_editor.fields.circuit_style.label",
      descriptionKey: "visual_editor.fields.circuit_style.description",
      type: "boolean",
    },
  ],
  defaultDoc(): CircuiTikZDocument {
    return {
      engineId: "circuitikz-engine",
      version: "1.0",
      americanStyle: true,
      nodes: [
        { id: "n1", x: 0, y: 2 },
        { id: "n2", x: 2, y: 2 },
        { id: "n3", x: 2, y: 0 },
        { id: "n4", x: 0, y: 0 },
      ],
      components: [
        { id: "v1", type: "voltage-source", from: "n4", to: "n1", direction: "up", label: "V", value: "5V" },
        { id: "r1", type: "resistor",       from: "n1", to: "n2", direction: "right", label: "R", value: "1k\\Omega" },
        { id: "r2", type: "resistor",       from: "n2", to: "n3", direction: "down",  label: "R", value: "2k\\Omega" },
      ],
      connections: [
        { from: "n3", to: "n4" },
      ],
    };
  },
});
