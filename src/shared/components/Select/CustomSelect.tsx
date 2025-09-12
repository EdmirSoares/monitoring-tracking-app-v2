import React, { useState } from "react";
import {
    Modal,
    Pressable,
    Text,
    View,
    FlatList,
    StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CustomSelect({
    options,
    changeSelected,
}: {
    options: string[] | null;
    changeSelected: (option: string) => void;
}) {
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const handleSelect = (option: string) => {
        setSelected(option);
        changeSelected(option);
        setVisible(false);
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={() => setVisible(true)}>
                {selected && options ? (
                    <Text>
                        {"Rota selecionada: " +
                            (options?.indexOf(selected) + 1)}
                    </Text>
                ) : (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                        }}
                    >
                        <MaterialCommunityIcons
                            name="cursor-default-click"
                            size={24}
                            color="black"
                        />
                        <Text>Selecione uma rota </Text>
                    </View>
                )}
            </Pressable>

            <Modal
                transparent
                animationType="fade"
                visible={visible}
                onRequestClose={() => setVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.dropdown}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[styles.item, { backgroundColor: selected === item ? "#eee" : "white" }]}
                                    onPress={() => handleSelect(item)}
                                >
                                    {selected && options ? (
                                        <Text>
                                            {"Rota: " +
                                                (options?.indexOf(item) + 1)}
                                        </Text>
                                    ) : null}
                                </Pressable>
                            )}
                            ListEmptyComponent={<Text>Nenhuma rota disponível</Text>}
                            contentContainerStyle={{ gap: 12}}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        height: "100%",
    },
    button: {
        padding: 12,
        borderRadius: 18,
        width: 200,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffffff",
        elevation: 6,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    dropdown: {
        backgroundColor: "white",
        borderRadius: 8,
        width: 300,
        paddingHorizontal: 12,
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    item: {
        padding: 12,
        borderRadius: 6
    },
});
