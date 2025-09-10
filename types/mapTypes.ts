export interface LocationPoint {
    latitude: number;
    longitude: number;
    timestamp: string;
}

export interface Route {
    id: string;
    startedAt: string;
    endedAt?: string;
    locationPoints: LocationPoint[];
}

export interface UserRoutes {
    id_user: string;
    user_name: string;
    route: Route[];
}

export interface RoutesResponse {
    routes: UserRoutes[];
}
