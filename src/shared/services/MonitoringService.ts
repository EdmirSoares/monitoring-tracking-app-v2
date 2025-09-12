import { authenticatedInstance } from "@/axios-config";
import { RoutesResponse } from "@/src/shared/types/mapTypes";
import { ToastAndroid } from "react-native";

export const postRoutes = async (data: any) => {
    try {
        const response = await authenticatedInstance.post(
            `/locations`,
            data
        );
        return response;
    } catch (error: any) {
        if (error.response && error.response.data) {
            ToastAndroid.showWithGravity(
                error.response.data.error || "Error while posting locations",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM
            );
        }
        throw error;
    }
};


export const getDailyLocations = async (
    date: any
): Promise<RoutesResponse> => {
    try {
        const response = await authenticatedInstance.get(
            `/routes/?date=${date}`
        );
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            ToastAndroid.showWithGravity(
                error.response.data.error || "Error while fetching daily locations:",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM
            );
        }
        throw error;
    }
};
