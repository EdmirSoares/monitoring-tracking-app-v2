import { ThemeProps } from "../../../shared/types/components";
import { TouchableOpacity as DefaultTouchableOpacity } from "react-native";

type TouchableOpacityProps = ThemeProps &
    React.ComponentProps<typeof DefaultTouchableOpacity>;

export function TouchableOpacity(props: TouchableOpacityProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;

    return (
        <DefaultTouchableOpacity
            style={[
                {
                    backgroundColor: "#1f2937",
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                },
                style,
            ]}
            {...otherProps}
        />
    );
}
