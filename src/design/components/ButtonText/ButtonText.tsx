import { useThemeColor } from "@/src/design/useThemeColor";
import { Text as DefaultText } from "react-native";
import { ThemeProps } from "../../../shared/types/components";

type TextProps = ThemeProps & DefaultText["props"];

export function ButtonText(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor(
        { light: lightColor, dark: darkColor },
        "buttonText"
    );

    return (
        <DefaultText
            style={[{ color, fontWeight: "bold", fontSize: 16 }, style]}
            {...otherProps}
        />
    );
}
