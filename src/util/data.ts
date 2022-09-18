import Big from "big.js";
import { EditableValue, DynamicValue, ValueStatus } from "mendix";

export const getDynamicValueString = (value?: EditableValue<string> | DynamicValue<string>): string | null => {
    if (value && value.status === ValueStatus.Available && typeof value.value === "string") {
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

type UseDisabledValue = [boolean, string | null];

export const useIsDisabled = (
    uploadAttribute?: EditableValue<string>,
    customEventAttribute?: DynamicValue<string>,
    maxFiles?: number
): UseDisabledValue => {
    if (maxFiles === 0) {
        return [true, null];
    }
    if (!uploadAttribute && !customEventAttribute) {
        return [true, "No upload attribute or custom event attribute set"];
    }
    const uploadValue = getDynamicValueString(uploadAttribute);
    const customEventValue = getDynamicValueString(customEventAttribute);

    const uploadValueEnabled = !uploadAttribute || (uploadAttribute && !uploadAttribute.readOnly && uploadValue === "");
    const customEventEnabled =
        !customEventAttribute || (customEventAttribute && customEventValue !== null && customEventValue !== "");

    return [!(uploadValueEnabled && customEventEnabled), null];
};
