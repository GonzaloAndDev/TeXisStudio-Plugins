import type { VisualDiagramPlugin, PluginCategory, QualityLevel } from "./common/contracts/index.js";

// Core (35)
import {
  VisualEquationsPlugin, MatricesPlugin, SystemOfEquationsPlugin, PiecewiseFunctionsPlugin,
  VennDiagramPlugin, PlaneGeometryPlugin, AnalyticGeometryPlugin,
  FunctionPlots2DPlugin, ParametricPolarPlugin, BasicStatisticsPlugin, StatisticalDistributionsPlugin,
  ProbabilityTreesPlugin,
  VectorsPlugin, FreeBodyDiagramPlugin, InclinedPlanePlugin, GeometricOpticsPlugin,
  BasicCircuitsPlugin, BlockDiagramPlugin, FlowchartPlugin, SoftwareArchitecturePlugin,
  GanttPlugin,
  ChemicalFormulasPlugin, ChemicalReactionsPlugin, ReactionEquilibriaPlugin, ChemicalStructuresPlugin,
  LabSetupPlugin,
  PhylogeneticTreesPlugin, SequencesPlugin, BiomedicalFlowPlugin, CONSORTFlowPlugin, BiologicalPathwaysPlugin,
  TimelinePlugin,
  SyntaxTreesPlugin, ConceptMapsPlugin,
} from "./catalog-core/index.js";

// Extended (21 implemented)
import {
  Plots3DPlugin, PhaseDiagramsPlugin, HeatMapsPlugin,
  BarChartsPlugin, BoxViolinPlotsPlugin, ScatterRegressionPlugin,
  SupplyDemandPlugin, UMLClassDiagramPlugin,
  DecisionTreePlugin, ROCCurvePlugin, PopulationPyramidPlugin, ErrorBarsPlugin, CausalDAGPlugin,
  ERDiagramPlugin, StateMachinePlugin, MarkovChainsPlugin, BodeNyquistPlugin,
  OrganicChemistryPlugin, ReactionMechanismsPlugin,
  KaplanMeierPlugin, NetworkGraphPlugin,
} from "./catalog-extended/index.js";

// Experimental
import {
  AnatomicalDiagramsPlugin, BiomedicalIllustrationPlugin, CellDiagramsPlugin,
  GeographicMapsPlugin, LilyPondScoresPlugin, LegalProceduralPlugin,
  EconomicCausalPlugin, SEMPathPlugin, BayesianNetworksPlugin, PedagogicalDiagramsPlugin,
} from "./catalog-experimental/index.js";

export interface PluginRegistryEntry {
  plugin: new () => VisualDiagramPlugin;
  category: PluginCategory;
  qualityLevel: QualityLevel;
}

export const PLUGIN_REGISTRY: PluginRegistryEntry[] = [
  // ── official-core ────────────────────────────────────────────
  { plugin: VisualEquationsPlugin,      category: "mathematics",       qualityLevel: "official-core" },
  { plugin: MatricesPlugin,             category: "mathematics",       qualityLevel: "official-core" },
  { plugin: SystemOfEquationsPlugin,    category: "mathematics",       qualityLevel: "official-core" },
  { plugin: PiecewiseFunctionsPlugin,   category: "mathematics",       qualityLevel: "official-core" },
  { plugin: VennDiagramPlugin,          category: "mathematics",       qualityLevel: "official-core" },
  { plugin: PlaneGeometryPlugin,        category: "mathematics",       qualityLevel: "official-core" },
  { plugin: AnalyticGeometryPlugin,     category: "mathematics",       qualityLevel: "official-core" },
  { plugin: FunctionPlots2DPlugin,      category: "mathematics",       qualityLevel: "official-core" },
  { plugin: ParametricPolarPlugin,      category: "mathematics",       qualityLevel: "official-core" },
  { plugin: BasicStatisticsPlugin,      category: "mathematics",       qualityLevel: "official-core" },
  { plugin: StatisticalDistributionsPlugin, category: "mathematics",   qualityLevel: "official-core" },
  { plugin: ProbabilityTreesPlugin,     category: "mathematics",       qualityLevel: "official-core" },
  { plugin: VectorsPlugin,              category: "physics",           qualityLevel: "official-core" },
  { plugin: FreeBodyDiagramPlugin,      category: "physics",           qualityLevel: "official-core" },
  { plugin: InclinedPlanePlugin,        category: "physics",           qualityLevel: "official-core" },
  { plugin: GeometricOpticsPlugin,      category: "physics",           qualityLevel: "official-core" },
  { plugin: BasicCircuitsPlugin,        category: "engineering-cs",    qualityLevel: "official-core" },
  { plugin: BlockDiagramPlugin,         category: "engineering-cs",    qualityLevel: "official-core" },
  { plugin: FlowchartPlugin,            category: "engineering-cs",    qualityLevel: "official-core" },
  { plugin: SoftwareArchitecturePlugin, category: "engineering-cs",    qualityLevel: "official-core" },
  { plugin: GanttPlugin,                category: "engineering-cs",    qualityLevel: "official-core" },
  { plugin: ChemicalFormulasPlugin,     category: "chemistry",         qualityLevel: "official-core" },
  { plugin: ChemicalReactionsPlugin,    category: "chemistry",         qualityLevel: "official-core" },
  { plugin: ReactionEquilibriaPlugin,   category: "chemistry",         qualityLevel: "official-core" },
  { plugin: ChemicalStructuresPlugin,   category: "chemistry",         qualityLevel: "official-core" },
  { plugin: LabSetupPlugin,             category: "chemistry",         qualityLevel: "official-core" },
  { plugin: PhylogeneticTreesPlugin,    category: "biology-medicine",  qualityLevel: "official-core" },
  { plugin: SequencesPlugin,            category: "biology-medicine",  qualityLevel: "official-core" },
  { plugin: BiomedicalFlowPlugin,       category: "biology-medicine",  qualityLevel: "official-core" },
  { plugin: CONSORTFlowPlugin,          category: "biology-medicine",  qualityLevel: "official-core" },
  { plugin: BiologicalPathwaysPlugin,   category: "biology-medicine",  qualityLevel: "official-core" },
  { plugin: TimelinePlugin,             category: "humanities-social", qualityLevel: "official-core" },
  { plugin: SyntaxTreesPlugin,          category: "humanities-social", qualityLevel: "official-core" },
  { plugin: ConceptMapsPlugin,          category: "humanities-social", qualityLevel: "official-core" },
  // ── official-extended ───────────────────────────────────────
  { plugin: Plots3DPlugin,              category: "mathematics",       qualityLevel: "official-extended" },
  { plugin: PhaseDiagramsPlugin,        category: "mathematics",       qualityLevel: "official-extended" },
  { plugin: HeatMapsPlugin,             category: "mathematics",       qualityLevel: "official-extended" },
  { plugin: BarChartsPlugin,            category: "mathematics",       qualityLevel: "official-extended" },
  { plugin: BoxViolinPlotsPlugin,       category: "mathematics",       qualityLevel: "official-extended" },
  { plugin: ScatterRegressionPlugin,    category: "mathematics",       qualityLevel: "official-extended" },
  { plugin: ERDiagramPlugin,            category: "engineering-cs",    qualityLevel: "official-extended" },
  { plugin: StateMachinePlugin,         category: "engineering-cs",    qualityLevel: "official-extended" },
  { plugin: MarkovChainsPlugin,         category: "mathematics",       qualityLevel: "official-extended" },
  { plugin: BodeNyquistPlugin,          category: "engineering-cs",    qualityLevel: "official-extended" },
  { plugin: SupplyDemandPlugin,          category: "humanities-social", qualityLevel: "official-extended" },
  { plugin: UMLClassDiagramPlugin,      category: "engineering-cs",    qualityLevel: "official-extended" },
  { plugin: DecisionTreePlugin,         category: "mathematics",       qualityLevel: "official-extended" },
  { plugin: ROCCurvePlugin,             category: "mathematics",       qualityLevel: "official-extended" },
  { plugin: PopulationPyramidPlugin,    category: "humanities-social", qualityLevel: "official-extended" },
  { plugin: ErrorBarsPlugin,            category: "mathematics",       qualityLevel: "official-extended" },
  { plugin: CausalDAGPlugin,            category: "humanities-social", qualityLevel: "official-extended" },
  { plugin: OrganicChemistryPlugin,     category: "chemistry",         qualityLevel: "official-extended" },
  { plugin: ReactionMechanismsPlugin,   category: "chemistry",         qualityLevel: "official-extended" },
  { plugin: KaplanMeierPlugin,          category: "biology-medicine",  qualityLevel: "official-extended" },
  { plugin: NetworkGraphPlugin,         category: "engineering-cs",    qualityLevel: "official-extended" },
  // ── experimental ────────────────────────────────────────────
  { plugin: AnatomicalDiagramsPlugin,   category: "biology-medicine",  qualityLevel: "experimental" },
  { plugin: BiomedicalIllustrationPlugin, category: "biology-medicine", qualityLevel: "experimental" },
  { plugin: CellDiagramsPlugin,         category: "biology-medicine",  qualityLevel: "experimental" },
  { plugin: GeographicMapsPlugin,       category: "humanities-social", qualityLevel: "experimental" },
  { plugin: LilyPondScoresPlugin,       category: "arts-visual",       qualityLevel: "experimental" },
  { plugin: LegalProceduralPlugin,      category: "humanities-social", qualityLevel: "experimental" },
  { plugin: EconomicCausalPlugin,       category: "humanities-social", qualityLevel: "experimental" },
  { plugin: SEMPathPlugin,              category: "humanities-social", qualityLevel: "experimental" },
  { plugin: BayesianNetworksPlugin,     category: "mathematics",       qualityLevel: "experimental" },
  { plugin: PedagogicalDiagramsPlugin,  category: "humanities-social", qualityLevel: "experimental" },
];

export function getPluginsByCategory(category: PluginCategory): PluginRegistryEntry[] {
  return PLUGIN_REGISTRY.filter(e => e.category === category);
}

export function getPluginsByQuality(level: QualityLevel): PluginRegistryEntry[] {
  return PLUGIN_REGISTRY.filter(e => e.qualityLevel === level);
}

export function instantiatePlugin(pluginId: string): VisualDiagramPlugin | null {
  for (const entry of PLUGIN_REGISTRY) {
    const instance = new entry.plugin();
    if (instance.pluginId === pluginId) return instance;
  }
  return null;
}
