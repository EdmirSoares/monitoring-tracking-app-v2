import { useThemeColor } from "@/src/shared/hooks/useThemeColor";
import { Text as DefaultText } from "react-native";
import { ThemeProps } from "../../types/components";

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
