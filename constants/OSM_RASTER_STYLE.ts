// License: https://operations.osmfoundation.org/policies/tiles/
export const OSM_RASTER_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: '<a href="http://www.openstreetmap.org/about/" target="_blank">&copy; OpenStreetMap</a>',
      maxzoom: 19,
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};