// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useAuth } from "../../src/shared/providers/AuthProvider";
import { Redirect } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Redirect href="/(loggedOut)" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                headerShadowVisible: false,
                tabBarActiveTintColor: "#1f2937",
                tabBarInactiveTintColor: "#a5a5a5ff",
                tabBarStyle: {
                    position: "absolute",
                    left: 20,
                    right: 20,
                    bottom: 0,
                    height: 120,
                    borderRadius: 32,
                    backgroundColor: "#ebebeb",
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowColor: "#000",
                    shadowOpacity: 0,
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 0,
                },
                tabBarIconStyle: {
                    marginTop: 10,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Roteamento",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="route" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Map/index"
                options={{
                    title: "Mapa",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
