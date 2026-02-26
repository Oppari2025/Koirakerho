
export type RouteType = "car" | "bike" | "foot";

export type Route = {
    type: RouteType;
    route: GeoJSON.LineString;
}

export async function getRoute(waypoints: number[][], routeType: RouteType): Promise<Route> {
    if (!waypoints || waypoints.length < 2) {
        throw new Error("Not enough waypoints defined.");
    }

    let url = `https://routing.openstreetmap.de/routed-${routeType}/route/v1/driving/`

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
    //console.log(url)

    const response = await fetch(url, {
        headers: {
            "User-Agent": "DogClubApp"
        }
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const responseData = await response.json();
    //console.log(JSON.stringify(responseData));
    

    return {
        type: routeType,
        route: responseData["routes"][0]["geometry"] as GeoJSON.LineString
    }
}

export async function getRoutes(waypoints: number[][], useCar: boolean, useBike: boolean, walk: boolean): Promise<Route[]> {
    if (!waypoints || waypoints.length < 2) {
        throw new Error("Not enough waypoints defined.");
    }

    if (!useCar && !useBike && !walk) {
        throw new Error("No ways of movement defined.");
    }

    let routes: Route[] = [];

    for (let i = waypoints.length; i < waypoints.length - 1; i++) {
        const start = waypoints[i];
        const end = waypoints[i + 1];

        if (useCar) {
            const route = await getRoute([start, end], "car");
            routes.push(route);
        }
        else if (useBike) {
            const route = await getRoute([start, end], "bike");
            routes.push(route);
        }
        else {
            const route = await getRoute([start, end], "foot");
            routes.push(route);
        }
    }

    return routes;
}