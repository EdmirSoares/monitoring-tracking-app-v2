import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    Animated,
    Easing,
} from "react-native";

const CustomToggleButton = ({ onPress, isActive }: { onPress: () => void, isActive: boolean }) => {
    const [scaleValue] = useState(new Animated.Value(1));
    const [opacityValue] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 0.95,
                duration: 100,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 0.8,
                duration: 100,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 150,
                easing: Easing.elastic(1.5),
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 150,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
        ]).start();

    };

    return (
        <View style={styles.container}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
            >
                <Animated.View
                    style={[
                        styles.toggle,
                        {
                            transform: [{ scale: scaleValue }],
                            opacity: opacityValue,
                        },
                    ]}
                >
                    <View style={styles.toggleBefore} />

                    <Animated.View
                        style={[styles.button, isActive && styles.buttonActive]}
                    >
                        <Text
                            style={[
                                styles.label,
                                isActive && styles.labelActive,
                            ]}
                        >
                            {isActive ? "Parar Registro" : "Iniciar Registro"}
                        </Text>
                    </Animated.View>
                </Animated.View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    toggle: {
        position: "relative",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    toggleBefore: {
        position: "absolute",
        backgroundColor: "#fff",
        opacity: 0.2,
        height: 72,
        width: 72,
    },
    button: {
        borderRadius: 32,
        backgroundColor: "#1f2937",
        aspectRatio: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7.5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12.5,
        elevation: 15,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 1)",
        overflow: "hidden",
    },
    buttonActive: {
        backgroundColor: "#ad1229ff",
        shadowOpacity: 0.2,
        elevation: 10,
    },
    label: {
        fontWeight: "700",
        fontSize: 28,
        color: "rgba(231, 231, 231, 0.9)",
        textAlign: "center",
    },
    labelActive: {
        color: "rgba(255, 255, 255, 1)",
    }
});

export default CustomToggleButton;
