import { describe, it, expect } from "vitest";
import { PLUGIN_REGISTRY, getPluginsByCategory, getPluginsByQuality, instantiatePlugin } from "../../../visual-plugins/plugin-registry.js";

describe("Plugin Registry", () => {
  it("has at least 44 registered plugins", () => {
    expect(PLUGIN_REGISTRY.length).toBeGreaterThanOrEqual(44);
  });

  it("all entries have valid quality levels", () => {
    const valid = ["official-core", "official-extended", "experimental"];
    for (const entry of PLUGIN_REGISTRY) {
      expect(valid).toContain(entry.qualityLevel);
    }
  });

  it("has at least 34 official-core plugins", () => {
    const core = getPluginsByQuality("official-core");
    expect(core.length).toBeGreaterThanOrEqual(34);
  });

  it("has plugins in every required category", () => {
    const categories = ["mathematics", "physics", "chemistry", "biology-medicine", "engineering-cs", "humanities-social"];
    for (const cat of categories) {
      const plugins = getPluginsByCategory(cat as never);
      expect(plugins.length).toBeGreaterThan(0);
    }
  });

  it("all plugin IDs are unique", () => {
    const ids = PLUGIN_REGISTRY.map(e => new e.plugin().pluginId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("instantiatePlugin returns correct plugin by ID", () => {
    const plugin = instantiatePlugin("visual-equations");
    expect(plugin).not.toBeNull();
    expect(plugin?.pluginId).toBe("visual-equations");
  });

  it("instantiatePlugin returns null for unknown ID", () => {
    expect(instantiatePlugin("does-not-exist")).toBeNull();
  });

  it("all plugins have non-empty displayName and description", () => {
    for (const entry of PLUGIN_REGISTRY) {
      const p = new entry.plugin();
      expect(p.displayName.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(0);
    }
  });

  it("all plugins have at least one required package declared", () => {
    for (const entry of PLUGIN_REGISTRY) {
      const p = new entry.plugin();
      expect(p.requiredPackages.length).toBeGreaterThan(0);
    }
  });

  it("extended and experimental plugins have scopeWarning", () => {
    for (const entry of PLUGIN_REGISTRY) {
      if (entry.qualityLevel !== "official-core") {
        const p = new entry.plugin();
        expect(p.scopeWarning).toBeTruthy();
      }
    }
  });
});
