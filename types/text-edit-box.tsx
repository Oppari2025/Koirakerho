
type TextEditBoxProps = {
    label?: string;
    isEditable?: boolean;
    value?: string;
    numberOfLines?: number;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export { TextEditBoxProps };

