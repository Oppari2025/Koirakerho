import { StyleProp, ViewStyle } from "react-native";

type ButtonProps = {
    onPress: () => void;
    title: string;
    style?: StyleProp<ViewStyle> | undefined;
    textColor: string;
    key: string;
}

export { ButtonProps };

