import * as SecureStore from "expo-secure-store";
import { STORE_KEYS } from "@/src/shared/constants/StoreKeys";

export const handleDeleteStorageKeys = async () => {
    await SecureStore.deleteItemAsync(STORE_KEYS.TOKEN);
    await SecureStore.deleteItemAsync(STORE_KEYS.TIMESTAMP);
    await SecureStore.deleteItemAsync(STORE_KEYS.USERID);
    await SecureStore.deleteItemAsync(STORE_KEYS.USER_NAME);
};
