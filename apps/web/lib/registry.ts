// shadcn registry naming, shared by the site UI. scripts/gen-registry.mjs writes the items.
export const REGISTRY_URL = 'https://sorbetui.tahmid.space/r';

/** HeroCentered -> hero-centered. Keep in sync with scripts/gen-registry.mjs. */
export const registryName = (id: string) =>
  id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();

export const addCommand = (name: string) => `npx shadcn@latest add ${REGISTRY_URL}/${name}.json`;
