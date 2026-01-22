
type CheckBoxGroupProps = {
    label: string,
    options: CheckBoxOption[];
    fontSize?: number;
    checkedValues: string[];
    onChange: (updatedCheckedValues: string[]) => void;
    style: any;
    isEditable: boolean;
}

type CheckBoxOption = {
    label: string;
    value: string;
}

export { CheckBoxGroupProps, CheckBoxOption };

