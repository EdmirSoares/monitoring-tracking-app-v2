import { useThemeColor } from "@/src/design/useThemeColor";
import { ThemeProps } from "../../../shared/types/components";
import { Text as DefaultText } from "react-native";
import { Text } from "../Text/Text";

type TextProps = ThemeProps & DefaultText["props"];

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}