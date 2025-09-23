// app/_layout.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/shared/providers/AuthProvider";
import "react-native-reanimated";
import { useColorScheme } from "@/src/design/useColorScheme";
import { View, ActivityIndicator, StatusBar } from "react-native";
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
    initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        InterThin: require("../assets/fonts/Inter-Thin.ttf"),
        InterExtraLight: require("../assets/fonts/Inter-ExtraLight.ttf"),
        InterLight: require("../assets/fonts/Inter-Light.ttf"),
        InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
        InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
        InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
        InterBold: require("../assets/fonts/Inter-Bold.ttf"),
        InterExtraBold: require("../assets/fonts/Inter-ExtraBold.ttf"),
        InterBlack: require("../assets/fonts/Inter-Black.ttf"),
        ...FontAwesome.font,
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            
            <StatusBar backgroundColor={"#000"} />
            <RootLayoutNav />
        </AuthProvider>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" redirect={!isLoggedIn} />
                <Stack.Screen name="(loggedOut)" redirect={isLoggedIn} />
            </Stack>
        </ThemeProvider>
    );
}
