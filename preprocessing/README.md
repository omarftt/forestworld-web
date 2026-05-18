# preprocessing — reference copy of the data pipeline

This folder is a **read-only mirror** of the data and risk-prioritization pipeline that lives in the sibling repo `climate_risk_track`. It is shipped here so a reader can understand exactly how the rasters, damage masks and ranked cases shown in the application were produced — without leaving this repo.

Nothing in this folder is executed by the frontend. The files are scripts and reference assets; the live data surface for the app is `aois.json` at the repo root.

## Folder layout

```
preprocessing/
├── data_prep/        ← raw-data ingestion (Sentinel-2, MapBiomas, damage masks)
├── action_layer/     ← turn a model prediction into ranked, prioritized cases
├── tools/            ← build the aois.json the frontend consumes
└── data/             ← downloaded reference layers + a sample of ranked outputs
    ├── layers/       ← contextual GIS layers (ANP, indigenous, mining, etc.)
    └── output/       ← one folder per <aoi>_<pair> with cases.json + oficios
```

## `data_prep/` — raw data ingestion

| File | What it does |
|---|---|
| `aois.py` | AOI catalog: bbox, UTM CRS, driver, region, stakeholders for the four areas (Boca Manu, La Pampa, Masisea, Chipiar). |
| `extract1.py` | Pulls Sentinel-2 L2A dry-season composites from Microsoft Planetary Computer. One COG per AOI per year (10 m, RGB + optional NIR/SWIR). |
| `extract2.py` | Pulls MapBiomas Amazonía Collection 6 land-cover rasters from Google Earth Engine (30 m). |
| `masks.py` | Derives binary damage masks from year-over-year MapBiomas transitions (forest → non-forest = damage). |
| `arc.py` | Downloads INGEMMET mining-rights geometries (Peru) and writes per-AOI GeoJSON. |
| `check_tiff.py` | QA helper to inspect any TIFF (bands, CRS, value distribution, nodata stats). |
| `web_asset.py` | Renders the raw GeoTIFFs into clean PNGs (Sentinel composites, MapBiomas color-mapped, damage masks). Writes per-AOI `metadata.json` describing what was rendered. |

## `action_layer/` — turn predictions into prioritized cases

Given a model prediction raster (`<aoi>_<from>_<to>_pred.tif`, float32 in 0–1), this layer produces a ranked list of cases plus a draft official memo (`oficio`) per case.

| File | What it does |
|---|---|
| `__init__.py` | Public entry point: `run_action_layer(pred_tif, aoi_key)` orchestrates the steps below. |
| `download_layers.py` | Idempotent fetcher for seven reference vector layers: SERNANP (ANP), RAISG (indigenous territories), INGEMMET (mining concessions), SERFOR (forestry concessions), HydroSHEDS (rivers), OSM (roads), WDPA (protected areas). Cached under `data/layers/`. |
| `polygonize.py` | Binarizes the prediction raster at threshold 0.30, vectorizes connected components, filters polygons under 2 ha, reprojects to WGS84. |
| `enrich.py` | Spatial-joins polygons against every reference layer; computes nearest distances to rivers and roads; assigns priority (Alta / Media / Baja) by rule; assigns the responsible stakeholder by driver and jurisdiction. |
| `report.py` | Serializes the top 5 ranked cases to `cases.json` and emits one `oficio_N.docx` per case (Spanish-language memo template). |

Priority logic (from `enrich.py`):

- **Alta**: inside an ANP, inside indigenous territory, area > 20 ha, or river within 500 m.
- **Media**: river within 2 km, road within 1 km, or area 5–20 ha.
- **Baja**: otherwise.

## `tools/build_aois.py`

Assembles the `aois.json` that the frontend fetches. For each AOI it:

1. Reads metadata from `data_prep/aois.py`.
2. Pulls per-layer year availability from each `web_assets/<aoi>/metadata.json`.
3. Loads every `data/output/<aoi>_<pair>/cases.json` to populate the `ranking` field.
4. Leaves `report` as `""` (the future LLM narrative slot).

## `data/layers/`

Pre-downloaded GIS reference layers used by `action_layer/enrich.py`, all in EPSG:4326 GeoPackage format:

- `sernanp_anp.gpkg` — Peruvian protected natural areas + buffer zones.
- `raisg_territorios.gpkg` — pan-Amazonian indigenous territories.
- `ingemmet_concesiones.gpkg` — Peruvian mining concessions.
- `serfor_concesiones.gpkg` — Peruvian forestry concessions.
- `hydrosheds_rivers.gpkg` — South American river network.
- `osm_roads.gpkg` — OpenStreetMap road network for the AOI envelopes.
- `wdpa_peru.gpkg` — global protected-areas database, filtered to Peru.

## `data/output/`

Sample outputs of the action layer — one folder per `<aoi>_<pair>`. Each contains:

- `cases.json` — the top 5 ranked cases (this is what the application's case panel renders verbatim).
- `oficio_{1..5}.docx` — one drafted memo per case, addressed to the assigned stakeholder.

## Reproducing the pipeline

You normally do not need to run anything in this folder — the rendered PNGs and `aois.json` are already committed. To re-run end-to-end, do it from the canonical [`climate_risk_track`](../../climate_risk_track) repo, where the same files live under `data_prep/`, `action_layer/`, `tools/` and `data/`.
