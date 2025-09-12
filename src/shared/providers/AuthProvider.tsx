import * as SecureStore from "expo-secure-store";
import * as AuthService from "@/src/shared/services/AuthService/AuthService";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { STORE_KEYS } from "@/src/shared/constants/StoreKeys";
import { ToastAndroid } from "react-native";
import { AxiosError } from "axios";
import { deleteAllSentLocations } from "@/src/features/monitoring/data/locationDb";
import { AuthUser } from "@/src/features/auth/domain/AuthUser";
import { handleDeleteStorageKeys } from "../utils/deleteStorageKeys";

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<AuthUser | null>(null);

    const checkAuthStatus = async () => {
        setIsLoading(true);

        try {
            const token = await SecureStore.getItemAsync(STORE_KEYS.TOKEN);
            const timeStampToken = await SecureStore.getItemAsync(
                STORE_KEYS.TIMESTAMP
            );
            const idUser = await SecureStore.getItemAsync(STORE_KEYS.USERID);
            const email = await SecureStore.getItemAsync(STORE_KEYS.USER_EMAIL);

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

            setUser(
                AuthUser.create({ id: idUser, email: email, token: token })
            );
            setIsLoggedIn(true);
        } catch (error) {
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setIsLoggedIn(false);
        try {
            const authUser = await AuthService.login(email, password);
            setUser(authUser);

            if (authUser) {
                if (!authUser.token) {
                    ToastAndroid.show(
                        "Erro ao decodificar token!",
                        ToastAndroid.LONG
                    );
                    logout();
                    return;
                }

                await Promise.all([
                    await SecureStore.setItemAsync(
                        STORE_KEYS.TOKEN,
                        authUser.id
                    ),

                    SecureStore.setItemAsync(STORE_KEYS.USERID, authUser.id),
                    SecureStore.setItemAsync(
                        STORE_KEYS.USER_NAME,
                        authUser.name
                    ),
                    SecureStore.setItemAsync(
                        STORE_KEYS.USER_EMAIL,
                        authUser.email
                    ),
                    SecureStore.setItemAsync(
                        STORE_KEYS.TIMESTAMP,
                        new Date().toString()
                    ),
                ]);

                setIsLoggedIn(true);

                ToastAndroid.show(
                    "Login realizado com sucesso!",
                    ToastAndroid.LONG
                );
            }
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
        } finally {
            setIsLoading(false);
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
