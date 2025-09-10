import { Redirect } from "expo-router";
import { useAuth } from "../Providers/AuthProvider";

export default function Index() {
    const { isLoggedIn } = useAuth();

    // Redireciona para a tela apropriada baseado no status de login
    return <Redirect href={isLoggedIn ? "/(tabs)" : "/(loggedOut)"} />;
}
