import { useThemeColor } from "@/src/shared/hooks/useThemeColor";
import { ThemeProps } from "../../types/components";
import { Text as DefaultText } from "react-native";

type TextProps = ThemeProps & DefaultText["props"];

export function Text(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return <DefaultText style={[{ color }, style]} {...otherProps} />;
}