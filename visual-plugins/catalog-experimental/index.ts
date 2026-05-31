// Import-bridge stubs (require external tools — compilable placeholder figures)
export {
  AnatomicalDiagramsPlugin,
  BiomedicalIllustrationPlugin,
  CellDiagramsPlugin,
  GeographicMapsPlugin,
  LilyPondScoresPlugin,
} from "./experimental-plugins.js";

// Full BasePlugin implementations promoted from stub to real
export {
  BayesianNetworksPlugin,
  SEMPathPlugin,
  EconomicCausalPlugin,
  LegalProceduralPlugin,
  PedagogicalDiagramsPlugin,
} from "./real-experimental-plugins.js";
