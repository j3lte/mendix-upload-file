import { ReactElement, createElement } from "react";
import { ClientSideFileLoaderPreviewProps } from "../typings/ClientSideFileLoaderProps";

// eslint-disable-next-line no-empty-pattern
export function preview({}: ClientSideFileLoaderPreviewProps): ReactElement {
    return <div />;
}

export function getPreviewCss(): string {
    return "";
}
