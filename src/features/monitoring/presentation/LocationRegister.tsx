import CustomToggleButton from "@/src/shared/components/ToggleButtom/CustomToggleButton";
import { useLocationRegister } from "@/src/features/monitoring/domain/useLocationRegister";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { View, StyleSheet, Pressable } from "react-native";
import { ButtonText } from "@/src/shared/components/ButtonText/ButtonText";
import { Text } from "@/src/shared/components/Text/Text";
import { TouchableOpacity } from "@/src/shared/components/TouchableOpacity/TouchableOpacity";

export default function LocationScreen() {
    const { logout } = useAuth();

    const {
        currentLocation,
        isLoading,
        errorMsg,
        isTracking,
        startTracking,
        stopTracking,
        syncLocations,
    } = useLocationRegister();

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

            {currentLocation && (
                <View>
                    <Text>Latitude: {currentLocation.coords.latitude}</Text>
                    <Text>Longitude: {currentLocation.coords.longitude}</Text>
                </View>
            )}

            <Pressable
                onPress={logout}
                style={{
                    backgroundColor: "#9c1313ff",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    position: "absolute",
                    right: 40,
                    top: 60,
                }}
            >
                <Text>Sair</Text>
            </Pressable>

            <CustomToggleButton
                onPress={isTracking ? stopTracking : startTracking}
                isActive={isTracking}
            />

            <TouchableOpacity
                onPress={syncLocations}
                style={{
                    marginHorizontal: 20,
                    borderRadius: 99,
                    backgroundColor: "#77a6dbff",
                }}
            >
                <ButtonText>Sincronizar</ButtonText>
            </TouchableOpacity>

            {/* <TouchableOpacity
                onPress={resetLocationDatabase}
                style={{
                    marginHorizontal: 20,
                    backgroundColor: "#9c1313ff",
                    borderRadius: 8,
                }}
            >
                <ButtonText>Resetar Banco de Dados</ButtonText>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
                onPress={countUnsentLocations}
                style={{
                    marginHorizontal: 20,
                    backgroundColor: "#9c1313ff",
                    borderRadius: 8,
                }}
            >
                <ButtonText>Count</ButtonText>
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#f5f5f5ff",
        gap: 10,
    },
    error: {
        color: "red",
        marginBottom: 20,
    },
});
