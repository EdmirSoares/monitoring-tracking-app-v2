import { getUserIdFromToken } from "@/utils/jwt/jwt_decode";
import * as SecureStore from "expo-secure-store";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { STORE_KEYS } from "@/constants/StoreKeys";
import { defaultInstance } from "@/axios-config";
import { ToastAndroid } from "react-native";
import { AxiosError } from "axios";
import { deleteAllSentLocations } from "@/database/locationDb";

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
    user: {
        id: string;
    } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{ id: string } | null>(null);

    const checkAuthStatus = async () => {
        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync(STORE_KEYS.TOKEN);
            const timeStampToken = await SecureStore.getItemAsync(
                STORE_KEYS.TIMESTAMP
            );
            const idUser = await SecureStore.getItemAsync(STORE_KEYS.USERID);

            if (timeStampToken) {
                const timeStamp = new Date(timeStampToken).getTime();
                const currentTime = new Date().getTime();
                const diff = currentTime - timeStamp;
                const diffInMinutes = Math.floor(diff / 1000 / 60);

                if (diffInMinutes > 720) {
                    await logout();
                    setIsLoggedIn(false);
                    return;
                }
            }

            if (!timeStampToken || !token || !idUser) {
                await logout();
                setIsLoggedIn(false);
                return;
            }

            setUser({
                id: idUser,
            });
            setIsLoggedIn(true);
        } catch (error) {
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteStorageKeys = async () => {
        await SecureStore.deleteItemAsync(STORE_KEYS.TOKEN);
        await SecureStore.deleteItemAsync(STORE_KEYS.TIMESTAMP);
        await SecureStore.deleteItemAsync(STORE_KEYS.USERID);
        await SecureStore.deleteItemAsync(STORE_KEYS.USER_NAME);
    };

    const login = async (email: string, password: string) => {
        const data = {
            email: email,
            password: password,
        };

        try {
            const response = await defaultInstance.post("/sessions", data);

            if (response) {
                const userInfo = getUserIdFromToken(response.data.access_token);

                if (!userInfo) {
                    ToastAndroid.show(
                        "Erro ao decodificar token!",
                        ToastAndroid.LONG
                    );
                    logout();
                    return;
                }

                const userId = userInfo.idUser;
                const userName = userInfo.name;

                await Promise.all([
                    await SecureStore.setItemAsync(
                        STORE_KEYS.TOKEN,
                        response.data.access_token
                    ),

                    SecureStore.setItemAsync(STORE_KEYS.USERID, userId),
                    SecureStore.setItemAsync(STORE_KEYS.USER_NAME, userName),
                    SecureStore.setItemAsync(
                        STORE_KEYS.TIMESTAMP,
                        new Date().toString()
                    ),
                ]);

                setUser({ id: userId });

                setIsLoggedIn(true);
            }
            return response;
        } catch (error: AxiosError | any) {
            setIsLoggedIn(false);
            if (error && error instanceof AxiosError) {
                if (error.status === 400) {
                    ToastAndroid.showWithGravityAndOffset(
                        "Email ou senha inválidos",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        25,
                        50
                    );
                    return;
                }

                if (error.status === 500) {
                    ToastAndroid.show(
                        "Erro interno do servidor",
                        ToastAndroid.LONG
                    );
                    return;
                }
            }
            throw error;
        }
    };

    const logout = async () => {
        setIsLoggedIn(false);
        try {
            await handleDeleteStorageKeys();

            await deleteAllSentLocations();
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset(
                "Erro ao fazer logout",
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                50
            );
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, isLoading, login, logout, user }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
