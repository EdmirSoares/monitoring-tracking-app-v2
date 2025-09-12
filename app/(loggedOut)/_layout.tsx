// app/(loggedOut)/_layout.tsx
import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../src/shared/providers/AuthProvider";

export default function LoggedOutLayout() {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Login",
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
