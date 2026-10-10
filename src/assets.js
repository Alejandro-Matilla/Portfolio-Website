// Exported offline previews supply Blob URLs; the hosted site uses public paths.
export function publicAsset(path) {
  return globalThis.__PORTFOLIO_ASSETS__?.[path] ?? path;
}
