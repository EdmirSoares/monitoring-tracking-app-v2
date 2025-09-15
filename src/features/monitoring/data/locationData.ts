import { useCallback, useEffect } from "react";
import {
    getUnsentLocations,
    initLocationDatabase,
    markLocationsAsPending,
    markLocationsAsSent,
    revertPendingToUnsent,
} from "./locationDb";
import * as Location from "expo-location";
import { ToastAndroid } from "react-native";
import { postRoutes } from "@/src/shared/services/MonitoringService/MonitoringService";

export const getCurrentLocation = async () => {
    try {
        const location = await Location.getCurrentPositionAsync({});
        //setCurrentLocation(location);
        return location;
    } catch (err) {
        ToastAndroid.showWithGravity(
            "Erro ao obter localização atual",
            ToastAndroid.LONG,
            ToastAndroid.TOP
        );
        return null;
    }
};

export const syncLocationsTask = async () => {
    const unsent = await getUnsentLocations(100);
    if (unsent.length === 0) return;

    const ids = unsent.map((l: any) => l.id);

    await markLocationsAsPending(ids);

    try {
        const formattedData = unsent.map((l: any) => ({
            latitude: l.latitude,
            longitude: l.longitude,
            timestamp: new Date(l.timestamp).toISOString(),
        }));

        const response = await postRoutes(formattedData);

        if (response) {
            await markLocationsAsSent(ids);
        } else {
            await revertPendingToUnsent(ids);
        }
    } catch (error) {
        console.error("Sync failed:", error);

        await revertPendingToUnsent(ids);
    }
};

export const syncLocations = useCallback(async () => {
    const unsent = await getUnsentLocations(100);
    if (unsent.length === 0) return;

    const ids = unsent.map((l: any) => l.id);

    await markLocationsAsPending(ids);

    try {
        const formattedData = unsent.map((l: any) => ({
            latitude: l.latitude,
            longitude: l.longitude,
            timestamp: new Date(l.timestamp).toISOString(),
        }));

        const response = await postRoutes(formattedData);

        if (response) {
            await markLocationsAsSent(ids);
        } else {
            await revertPendingToUnsent(ids);
        }
    } catch (error) {
        console.error("Sync failed:", error);

        await revertPendingToUnsent(ids);
    }
}, []);

useEffect(() => {
    const initializeDb = async () => {
        try {
            await initLocationDatabase();
        } catch (error) {
            ToastAndroid.showWithGravity(
                "Erro ao inicializar banco de dados",
                ToastAndroid.LONG,
                ToastAndroid.TOP
            );
        }
    };
    initializeDb();
}, []);
