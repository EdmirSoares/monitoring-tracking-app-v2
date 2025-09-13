import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import { Alert, Linking, ToastAndroid } from "react-native";

import {
    countUnsentLocations,
    getUnsentLocations,
    initLocationDatabase,
    insertLocation,
    markLocationsAsPending,
    markLocationsAsSent,
    revertPendingToUnsent,
} from "@/src/features/monitoring/data/locationDb";
import { postRoutes } from "@/src/shared/services/MonitoringService/MonitoringService";
import { useAuth } from "@/src/shared/providers/AuthProvider";

const LOCATION_TASK = "background-location-task";
const SYNC_TASK = "background-sync-task";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
    if (error) {
        console.error("Erro no TaskManager:", error);
        return;
    }

    if (data) {
        const { locations } = data as any;
        const [location] = locations;

        const locationsCount = await countUnsentLocations();
        const unsentCount = locationsCount[0]?.count || 0;

        if (unsentCount >= 20) {
            await syncLocationsTask();
        }

        if (location) {
            await insertLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
                speed: location.coords.speed,
                altitude: location.coords.altitude,
                timestamp: Date.now(),
            });
        }
    }
});

const syncLocationsTask = async () => {
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

export function useLocationRegister() {
    const [currentLocation, setCurrentLocation] =
        useState<Location.LocationObject | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const startTracking = async () => {
        try {
            setIsLoading(true);

            const { status: fgStatus } =
                await Location.requestForegroundPermissionsAsync();
            if (fgStatus !== "granted") {
                setErrorMsg("Permissão de localização negada");

                Alert.alert(
                    "Permissão necessária",
                    "Por favor, habilite as permissões de localização",
                    [
                        {
                            text: "Abrir configurações",
                            onPress: () => Linking.openSettings(),
                        },
                        { text: "Cancelar", style: "cancel" },
                    ]
                );
                return null;
            }

            const { status: bgStatus } =
                await Location.requestBackgroundPermissionsAsync();

            if (bgStatus !== "granted") {
                setErrorMsg("Permissão de localização em segundo plano negada");
                return;
            }

            if (!user) {
                setErrorMsg("Usuário não autenticado");
                return;
            }

            const isRegistered = await TaskManager.isTaskRegisteredAsync(
                LOCATION_TASK
            );

            if (!isRegistered) {
                await Location.startLocationUpdatesAsync(LOCATION_TASK, {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 5,
                    deferredUpdatesInterval: 15000,
                    showsBackgroundLocationIndicator: true,
                    foregroundService: {
                        notificationTitle: "Rastreamento ativo",
                        notificationBody:
                            "Sua localização está sendo registrada.",
                    },
                });
            }

            const location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location);
            const { coords } = location;

            await insertLocation({
                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy: coords.accuracy || undefined,
                speed: coords.speed || undefined,
                altitude: coords.altitude || undefined,
                timestamp: Date.now(),
            });

            setIsTracking(true);
            ToastAndroid.showWithGravity(
                "Rastreamento iniciado",
                ToastAndroid.LONG,
                ToastAndroid.TOP
            );
        } catch (err) {
            console.error("Erro while starting tracking:", err);
            ToastAndroid.showWithGravity(
                "Erro ao iniciar rastreamento",
                ToastAndroid.LONG,
                ToastAndroid.TOP
            );
            setErrorMsg("Erro ao iniciar rastreamento");
        } finally {
            setIsLoading(false);
        }
    };

    const syncLocations = useCallback(async () => {
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

    const stopTracking = async () => {
        try {
            const isRegistered = await TaskManager.isTaskRegisteredAsync(
                LOCATION_TASK
            );

            if (isRegistered) {
                await Location.stopLocationUpdatesAsync(LOCATION_TASK);
            }

            const syncRegistered = await TaskManager.isTaskRegisteredAsync(
                SYNC_TASK
            );
            if (syncRegistered) {
                await BackgroundTask.unregisterTaskAsync(SYNC_TASK);
            }

            await syncLocations();

            setIsTracking(false);
            setCurrentLocation(null);

            ToastAndroid.showWithGravity(
                "Rastreamento parado e dados enviados",
                ToastAndroid.LONG,
                ToastAndroid.TOP
            );
        } catch (err) {
            console.error("Erro while stopping tracking:", err);
            setErrorMsg("Erro ao parar rastreamento");
        }
    };

    useEffect(() => {
        let foregroundInterval: number | undefined;

        if (isTracking) {
            foregroundInterval = setInterval(async () => {
                await syncLocations();
            }, 60000);
        }

        return () => {
            if (foregroundInterval !== undefined) {
                clearInterval(foregroundInterval);
            }
        };
    }, [isTracking]);

    useEffect(() => {
        const initializeDb = async () => {
            try {
                await initLocationDatabase();
            } catch (error) {
                setErrorMsg("Erro ao inicializar banco de dados");
            }
        };
        initializeDb();
    }, []);

    const getCurrentLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location);
            return location;
        } catch (err) {
            setErrorMsg("Erro ao obter localização atual");
            return null;
        }
    };

    return {
        currentLocation,
        isTracking,
        errorMsg,
        isLoading,
        startTracking,
        stopTracking,
        syncLocations,
        getCurrentLocation,
    };
}
