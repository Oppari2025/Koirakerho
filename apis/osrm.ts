
export type RoutingMode = "car" | "bike" | "foot"

export interface Location {
    coords: {
        latitude: number,
        longitude: number
    }
}

export async function getRoute(waypoints: number[][], routingMode: RoutingMode): Promise<GeoJSON.LineString> {
    if (!waypoints || waypoints.length < 2) {
        throw new Error("Not enough waypoints defined!");
    }

    let url = `https://routing.openstreetmap.de/routed-${routingMode}/route/v1/driving/`

    for (let i = 0; i < waypoints.length; i++) {
        const location = waypoints[i];

        url += location[0]; // longitude
        url += ",";
        url += location[1]; // latitude

        if (i < waypoints.length - 1) {
            url += ";";
        }
    }

    url += `?overview=full&geometries=geojson`;
    console.log(url)

    const response = await fetch(url, {
        headers: {
            "User-Agent": "DogClubApp"
        }
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const responseData = await response.json();
    //console.log(responseData["routes"][0]["geometry"])
    return responseData["routes"][0]["geometry"] as GeoJSON.LineString;
}



// Valid shapes: GeoJSON.GeometryCollection | GeoJSON.Feature | GeoJSON.FeatureCollection | GeoJSON.Geometry
export const TEST_LINE_STRING: GeoJSON.LineString = {
    "coordinates": [
        [
            22.2532,
            68.2357
        ],
        [
            22.4102,
            23.0080
        ]
    ],
    "type": "LineString"
}