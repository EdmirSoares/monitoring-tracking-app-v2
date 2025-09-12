import { Text, TouchableOpacity, View } from "@/components/Themed";
import { useMap } from "@/src/features/map/presentation/useMap";
import { Pressable, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import CustomSelect from "@/src/shared/components/Select/CustomSelect";

export default function MapScreen() {
    const {
        mapRef,
        mapStyle,
        mapLoaded,
        selectedRoute,
        routeCoordinates,
        handleGetDailyLocations,
        handleChangeRoute,
    } = useMap();
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    position: "absolute",
                    bottom: 160,
                    right: 20,
                    alignSelf: "center",
                    zIndex: 5,
                    flexDirection: "row",
                    backgroundColor: "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                }}
            >
                <CustomSelect
                    options={routeCoordinates.map((route) => route.id)}
                    changeSelected={(option) => handleChangeRoute(option)}
                />
                <TouchableOpacity
                    onPress={handleGetDailyLocations}
                    style={{
                        aspectRatio: 1,
                        borderRadius: 99,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    <Feather name="refresh-ccw" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                ref={mapRef}
                customMapStyle={mapStyle}
                showsBuildings={false}
                showsPointsOfInterest={false}
                region={{
                    latitude: selectedRoute
                        ? selectedRoute.locationPoints[0].latitude
                        : -10.935652,
                    longitude: selectedRoute
                        ? selectedRoute.locationPoints[0].longitude
                        : -37.075956,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
                onMapLoaded={mapLoaded}
            >
                <Marker
                    coordinate={{
                        latitude: selectedRoute
                            ? selectedRoute.locationPoints[0].latitude
                            : -10.935652,
                        longitude: selectedRoute
                            ? selectedRoute.locationPoints[0].longitude
                            : -37.075956,
                    }}
                    identifier="initialPosition"
                    title="Initial Position"
                />

                {selectedRoute && selectedRoute.locationPoints.length > 1 && (
                    <>
                        <Marker
                            coordinate={{
                                latitude:
                                    selectedRoute.locationPoints[
                                        selectedRoute.locationPoints.length - 1
                                    ].latitude,
                                longitude:
                                    selectedRoute.locationPoints[
                                        selectedRoute.locationPoints.length - 1
                                    ].longitude,
                            }}
                            identifier="finalPosition"
                            title="final Position"
                            pinColor="green"
                        />
                        <Polyline
                            coordinates={selectedRoute.locationPoints.map(
                                (coord) => ({
                                    latitude: coord.latitude,
                                    longitude: coord.longitude,
                                })
                            )}
                            strokeWidth={5}
                            strokeColor="#000"
                            lineCap="round"
                            lineJoin="round"
                            zIndex={5}
                            strokeColors={["#000", "#000"]}
                        />
                    </>
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    map: { flex: 1 },
});
