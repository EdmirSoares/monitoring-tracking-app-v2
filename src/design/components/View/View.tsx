import { useThemeColor } from "@/src/design/useThemeColor";
import { ThemeProps } from "../../../shared/types/components";
import { View as DefaultView } from "react-native";
type ViewProps = ThemeProps & DefaultView["props"];

export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background"
    );

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
