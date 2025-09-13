import { fetchDailyRoutes } from "../data/mapData";
import { Route } from "@/src/shared/types/mapTypes";
import { useEffect, useRef, useState } from "react";
import MapView from "react-native-maps";

export function useMap() {
    const mapRef = useRef<MapView>(null);

    const [routeCoordinates, setRouteCoordinates] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

    const mapStyle = [
        {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
        },
    ];

    const mapLoaded = async () => {
        mapRef.current?.fitToSuppliedMarkers(
            ["finalPosition", "initialPosition"],
            {
                edgePadding: {
                    top: 50,
                    right: 50,
                    bottom: 50,
                    left: 50,
                },
                animated: true,
            }
        );
    };

    const handleGetDailyLocations = async () => {
        const date = new Date().toISOString().split("T")[0];
        const routes = await fetchDailyRoutes(date);
        setRouteCoordinates(routes);
        setSelectedRoute(routes[0]);
    };

    const handleChangeRoute = (route: string) => {
        setSelectedRoute((prev) =>
            prev?.id === route
                ? prev
                : routeCoordinates.find((s) => s.id === route) || null
        );
    };

    useEffect(() => {
        if (!mapRef.current) {
            console.warn("Map reference is null!");
            return;
        }
    }, []);

    return {
        mapRef,
        mapStyle,
        mapLoaded,
        selectedRoute,
        routeCoordinates,
        handleGetDailyLocations,
        handleChangeRoute,
    };
}
