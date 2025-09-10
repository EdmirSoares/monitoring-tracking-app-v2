import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    ToastAndroid,
} from "react-native";
import { useAuth } from "../../Providers/AuthProvider";
import { TouchableOpacity } from "@/components/Themed";
import Logo from "@/assets/images/brand/logo.png";
import React, { useState } from "react";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (!email || !password) {
            ToastAndroid.showWithGravity(
                "Por favor, preencha todos os campos.",
                ToastAndroid.SHORT,
                ToastAndroid.TOP
            );
            return;
        }
        login(email, password);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        source={Logo}
                        style={{
                            width: 200,
                            alignSelf: "center",
                            resizeMode: "contain",
                        }}
                    />
                </View>

                <View style={{ flex: 2 }}>
                    <Text style={styles.title}>Bem-vindo(a)</Text>
                    <View>
                        <Text style={{ marginBottom: 8, fontWeight: "600" }}>
                            Email
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            aria-label="Email"
                            placeholderTextColor={"#aaa"}
                        />
                    </View>
                    <View>
                        <Text style={{ marginBottom: 8, fontWeight: "600" }}>
                            Senha
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                            aria-label="Senha"
                            placeholderTextColor={"#aaa"}
                        />
                    </View>
                    <TouchableOpacity onPress={handleLogin}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 32,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "900",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
