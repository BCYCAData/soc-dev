// leaflet-geometryutil ships no types; it augments the runtime `L` with `L.GeometryUtil`.
// We access it via `(L as any).GeometryUtil`, so a side-effect module declaration is enough.
declare module 'leaflet-geometryutil';
