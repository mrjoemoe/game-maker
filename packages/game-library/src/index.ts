export type {
  Catalog,
  CompatibilityRange,
  ComponentContribution,
  ComponentDefinition,
  ComponentId,
  ComponentKind,
  ComponentManifest,
  ComponentRef,
  DependencyEdge,
  FieldProvenance,
  LifecycleState,
  ResolveResult,
  ResolveWarning,
  ResolvedVersion,
  SemVer,
  VariantExtensions,
  VariantManifest,
  VariantOverride,
} from "./types.js";

export {
  assertValidComponentId,
  defineComponent,
  defineVariant,
  override,
  use,
  validateManifest,
} from "./authoring.js";

export { createCatalog, searchCatalog } from "./catalog.js";
export { createDefaultCatalog, ALL_COMPONENTS } from "./components/index.js";
export {
  findConsumers,
  resolveVariant,
  selectVersion,
} from "./resolve.js";
export {
  legacyDefinitionAdapter,
  resolveRegistered,
  type RegisteredSource,
} from "./legacy.js";
export { validateCatalog, validateVariants } from "./validate.js";
export {
  compareSemVer,
  isExactPin,
  majorOf,
  parseRange,
  parseSemVer,
  satisfiesRange,
} from "./versions.js";
export {
  goblinWoodsVariant,
  meadowV1Variant,
  quietGladeVariant,
} from "./variants/builtins.js";
