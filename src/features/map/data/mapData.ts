import { getDailyLocations } from "@/src/shared/services/MonitoringService/MonitoringService";
import { Route } from "@/src/shared/types/mapTypes";

export async function fetchDailyRoutes(date: string): Promise<Route[]> {
    const response = await getDailyLocations(date);
    return response.routes[0].route;
}
