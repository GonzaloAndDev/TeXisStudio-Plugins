import type { VisualDiagramPlugin, PluginCategory, QualityLevel, UserLevel, EditorType } from "./common/contracts/index.js";

// Core (35)
import {
  VisualEquationsPlugin, MatricesPlugin, SystemOfEquationsPlugin, PiecewiseFunctionsPlugin,
  VennDiagramPlugin, PlaneGeometryPlugin, AnalyticGeometryPlugin,
  FunctionPlots2DPlugin, ParametricPolarPlugin, BasicStatisticsPlugin, StatisticalDistributionsPlugin,
  ProbabilityTreesPlugin,
  VectorsPlugin, FreeBodyDiagramPlugin, InclinedPlanePlugin, WaveOscillationPlugin, GeometricOpticsPlugin,
  BasicCircuitsPlugin, BlockDiagramPlugin, FlowchartPlugin, SoftwareArchitecturePlugin,
  GanttPlugin,
  ChemicalFormulasPlugin, ChemicalReactionsPlugin, ReactionEquilibriaPlugin, ChemicalStructuresPlugin,
  LabSetupPlugin,
  PhylogeneticTreesPlugin, SequencesPlugin, BiomedicalFlowPlugin, CONSORTFlowPlugin, BiologicalPathwaysPlugin,
  TimelinePlugin,
  SyntaxTreesPlugin, ConceptMapsPlugin,
} from "./catalog-core/index.js";

// Extended (25 implemented — Etapa 3 COMPLETA)
import {
  Plots3DPlugin, PhaseDiagramsPlugin, HeatMapsPlugin,
  BarChartsPlugin, BoxViolinPlotsPlugin, ScatterRegressionPlugin,
  SupplyDemandPlugin, UMLClassDiagramPlugin,
  DecisionTreePlugin, ROCCurvePlugin, PopulationPyramidPlugin, ErrorBarsPlugin, CausalDAGPlugin,
  TimeSeriesPlugin, GenealogyPlugin, ParallelCoordinatesPlugin, EnergyBandPlugin,
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
  /** User-facing difficulty. Drives labels in the figure picker (Fácil / Intermedio / Avanzado). */
  userLevel: UserLevel;
  /** How the user interacts with this plugin. Determines which visual editor panel is shown. */
  editorType: EditorType;
}

export const PLUGIN_REGISTRY: PluginRegistryEntry[] = [
  // ── official-core ────────────────────────────────────────────
  //   Mathematics
  { plugin: VisualEquationsPlugin,         category: "mathematics",       qualityLevel: "official-core",     userLevel: "intermediate", editorType: "visual-assisted" },
  { plugin: MatricesPlugin,                category: "mathematics",       qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: SystemOfEquationsPlugin,       category: "mathematics",       qualityLevel: "official-core",     userLevel: "intermediate", editorType: "visual-assisted" },
  { plugin: PiecewiseFunctionsPlugin,      category: "mathematics",       qualityLevel: "official-core",     userLevel: "intermediate", editorType: "visual-assisted" },
  { plugin: VennDiagramPlugin,             category: "mathematics",       qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: PlaneGeometryPlugin,           category: "mathematics",       qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: AnalyticGeometryPlugin,        category: "mathematics",       qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: FunctionPlots2DPlugin,         category: "mathematics",       qualityLevel: "official-core",     userLevel: "easy",         editorType: "visual-assisted" },
  { plugin: ParametricPolarPlugin,         category: "mathematics",       qualityLevel: "official-core",     userLevel: "advanced",     editorType: "advanced"        },
  { plugin: BasicStatisticsPlugin,         category: "mathematics",       qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: StatisticalDistributionsPlugin,category: "mathematics",       qualityLevel: "official-core",     userLevel: "intermediate", editorType: "visual-assisted" },
  { plugin: ProbabilityTreesPlugin,        category: "mathematics",       qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  //   Physics
  { plugin: VectorsPlugin,                 category: "physics",           qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: FreeBodyDiagramPlugin,         category: "physics",           qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: InclinedPlanePlugin,           category: "physics",           qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: WaveOscillationPlugin,         category: "physics",           qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: GeometricOpticsPlugin,         category: "physics",           qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  //   Engineering / CS
  { plugin: BasicCircuitsPlugin,           category: "engineering-cs",    qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: BlockDiagramPlugin,            category: "engineering-cs",    qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: FlowchartPlugin,               category: "engineering-cs",    qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: SoftwareArchitecturePlugin,    category: "engineering-cs",    qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: GanttPlugin,                   category: "engineering-cs",    qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  //   Chemistry
  { plugin: ChemicalFormulasPlugin,        category: "chemistry",         qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: ChemicalReactionsPlugin,       category: "chemistry",         qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: ReactionEquilibriaPlugin,      category: "chemistry",         qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: ChemicalStructuresPlugin,      category: "chemistry",         qualityLevel: "official-core",     userLevel: "advanced",     editorType: "advanced"        },
  { plugin: LabSetupPlugin,                category: "chemistry",         qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  //   Biology / Medicine
  { plugin: PhylogeneticTreesPlugin,       category: "biology-medicine",  qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: SequencesPlugin,               category: "biology-medicine",  qualityLevel: "official-core",     userLevel: "intermediate", editorType: "advanced"        },
  { plugin: BiomedicalFlowPlugin,          category: "biology-medicine",  qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: CONSORTFlowPlugin,             category: "biology-medicine",  qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: BiologicalPathwaysPlugin,      category: "biology-medicine",  qualityLevel: "official-core",     userLevel: "intermediate", editorType: "visual-assisted" },
  //   Humanities / Social
  { plugin: TimelinePlugin,                category: "humanities-social", qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: SyntaxTreesPlugin,             category: "humanities-social", qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: ConceptMapsPlugin,             category: "humanities-social", qualityLevel: "official-core",     userLevel: "easy",         editorType: "fully-visual"    },
  // ── official-extended ───────────────────────────────────────
  { plugin: Plots3DPlugin,                 category: "mathematics",       qualityLevel: "official-extended", userLevel: "advanced",     editorType: "advanced"        },
  { plugin: PhaseDiagramsPlugin,           category: "mathematics",       qualityLevel: "official-extended", userLevel: "advanced",     editorType: "advanced"        },
  { plugin: HeatMapsPlugin,                category: "mathematics",       qualityLevel: "official-extended", userLevel: "intermediate", editorType: "visual-assisted" },
  { plugin: BarChartsPlugin,               category: "mathematics",       qualityLevel: "official-extended", userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: BoxViolinPlotsPlugin,          category: "mathematics",       qualityLevel: "official-extended", userLevel: "intermediate", editorType: "visual-assisted" },
  { plugin: ScatterRegressionPlugin,       category: "mathematics",       qualityLevel: "official-extended", userLevel: "intermediate", editorType: "visual-assisted" },
  { plugin: ERDiagramPlugin,               category: "engineering-cs",    qualityLevel: "official-extended", userLevel: "intermediate", editorType: "fully-visual"    },
  { plugin: StateMachinePlugin,            category: "engineering-cs",    qualityLevel: "official-extended", userLevel: "intermediate", editorType: "fully-visual"    },
  { plugin: MarkovChainsPlugin,            category: "mathematics",       qualityLevel: "official-extended", userLevel: "intermediate", editorType: "fully-visual"    },
  { plugin: BodeNyquistPlugin,             category: "engineering-cs",    qualityLevel: "official-extended", userLevel: "advanced",     editorType: "advanced"        },
  { plugin: SupplyDemandPlugin,            category: "humanities-social", qualityLevel: "official-extended", userLevel: "easy",         editorType: "visual-assisted" },
  { plugin: UMLClassDiagramPlugin,         category: "engineering-cs",    qualityLevel: "official-extended", userLevel: "intermediate", editorType: "fully-visual"    },
  { plugin: DecisionTreePlugin,            category: "mathematics",       qualityLevel: "official-extended", userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: ROCCurvePlugin,                category: "mathematics",       qualityLevel: "official-extended", userLevel: "advanced",     editorType: "visual-assisted" },
  { plugin: PopulationPyramidPlugin,       category: "humanities-social", qualityLevel: "official-extended", userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: ErrorBarsPlugin,               category: "mathematics",       qualityLevel: "official-extended", userLevel: "intermediate", editorType: "visual-assisted" },
  { plugin: CausalDAGPlugin,               category: "humanities-social", qualityLevel: "official-extended", userLevel: "intermediate", editorType: "fully-visual"    },
  { plugin: TimeSeriesPlugin,              category: "mathematics",       qualityLevel: "official-extended", userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: GenealogyPlugin,               category: "humanities-social", qualityLevel: "official-extended", userLevel: "easy",         editorType: "fully-visual"    },
  { plugin: ParallelCoordinatesPlugin,     category: "mathematics",       qualityLevel: "official-extended", userLevel: "advanced",     editorType: "visual-assisted" },
  { plugin: EnergyBandPlugin,              category: "physics",           qualityLevel: "official-extended", userLevel: "advanced",     editorType: "advanced"        },
  { plugin: OrganicChemistryPlugin,        category: "chemistry",         qualityLevel: "official-extended", userLevel: "advanced",     editorType: "advanced"        },
  { plugin: ReactionMechanismsPlugin,      category: "chemistry",         qualityLevel: "official-extended", userLevel: "advanced",     editorType: "advanced"        },
  { plugin: KaplanMeierPlugin,             category: "biology-medicine",  qualityLevel: "official-extended", userLevel: "intermediate", editorType: "visual-assisted" },
  { plugin: NetworkGraphPlugin,            category: "engineering-cs",    qualityLevel: "official-extended", userLevel: "intermediate", editorType: "fully-visual"    },
  // ── experimental ────────────────────────────────────────────
  { plugin: AnatomicalDiagramsPlugin,      category: "biology-medicine",  qualityLevel: "experimental",      userLevel: "advanced",     editorType: "advanced"        },
  { plugin: BiomedicalIllustrationPlugin,  category: "biology-medicine",  qualityLevel: "experimental",      userLevel: "advanced",     editorType: "advanced"        },
  { plugin: CellDiagramsPlugin,            category: "biology-medicine",  qualityLevel: "experimental",      userLevel: "advanced",     editorType: "advanced"        },
  { plugin: GeographicMapsPlugin,          category: "humanities-social", qualityLevel: "experimental",      userLevel: "advanced",     editorType: "external-bridge" },
  { plugin: LilyPondScoresPlugin,          category: "arts-visual",       qualityLevel: "experimental",      userLevel: "advanced",     editorType: "external-bridge" },
  { plugin: LegalProceduralPlugin,         category: "humanities-social", qualityLevel: "experimental",      userLevel: "advanced",     editorType: "advanced"        },
  { plugin: EconomicCausalPlugin,          category: "humanities-social", qualityLevel: "experimental",      userLevel: "advanced",     editorType: "visual-assisted" },
  { plugin: SEMPathPlugin,                 category: "humanities-social", qualityLevel: "experimental",      userLevel: "advanced",     editorType: "advanced"        },
  { plugin: BayesianNetworksPlugin,        category: "mathematics",       qualityLevel: "experimental",      userLevel: "advanced",     editorType: "visual-assisted" },
  { plugin: PedagogicalDiagramsPlugin,     category: "humanities-social", qualityLevel: "experimental",      userLevel: "intermediate", editorType: "visual-assisted" },
];

export function getPluginsByCategory(category: PluginCategory): PluginRegistryEntry[] {
  return PLUGIN_REGISTRY.filter(e => e.category === category);
}

export function getPluginsByQuality(level: QualityLevel): PluginRegistryEntry[] {
  return PLUGIN_REGISTRY.filter(e => e.qualityLevel === level);
}

export function getPluginsByUserLevel(level: UserLevel): PluginRegistryEntry[] {
  return PLUGIN_REGISTRY.filter(e => e.userLevel === level);
}

export function instantiatePlugin(pluginId: string): VisualDiagramPlugin | null {
  for (const entry of PLUGIN_REGISTRY) {
    const instance = new entry.plugin();
    if (instance.pluginId === pluginId) return instance;
  }
  return null;
}

/** Returns registry metadata (without instantiating) for a given pluginId. */
export function getRegistryEntry(pluginId: string): PluginRegistryEntry | undefined {
  for (const entry of PLUGIN_REGISTRY) {
    const instance = new entry.plugin();
    if (instance.pluginId === pluginId) return entry;
  }
  return undefined;
}
