import Big from "big.js";
import { EditableValue, DynamicValue, ValueStatus } from "mendix";

export const getDynamicValueString = (value: EditableValue<string>): string | null => {
    if (value.status === ValueStatus.Available && typeof value.value === "string") {
        return value.value;
    }
    return null;
};

export const getDynamicValueBig = (value?: DynamicValue<Big>): number | undefined => {
    if (value && value.status === ValueStatus.Available && value.value) {
        return parseInt(value.value.toFixed(0), 10);
    }
    return undefined;
};
