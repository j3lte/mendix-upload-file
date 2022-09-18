/**
 * This file was generated from ClientSideFileLoader.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, EditableValue } from "mendix";
import { Big } from "big.js";

export interface AcceptListType {
    acceptGroupName: string;
    acceptExtensions: string;
}

export interface AcceptListPreviewType {
    acceptGroupName: string;
    acceptExtensions: string;
}

export interface ClientSideFileLoaderContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    dataCustomEventKey?: DynamicValue<string>;
    uploadFilesStringAttribute?: EditableValue<string>;
    onDropAction?: ActionValue;
    areaDropZone: ReactNode;
    areaDropZoneDisabled?: ReactNode;
    errorCustomEventKey?: DynamicValue<string>;
    onErrorStringAttribute?: EditableValue<string>;
    onDropError?: ActionValue;
    maxSize?: DynamicValue<Big>;
    minSize?: DynamicValue<Big>;
    maxFiles?: DynamicValue<Big>;
    acceptList: AcceptListType[];
    intenseMimeLookup: boolean;
}

export interface ClientSideFileLoaderPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    dataCustomEventKey: string;
    uploadFilesStringAttribute: string;
    onDropAction: {} | null;
    areaDropZone: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    areaDropZoneDisabled: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    errorCustomEventKey: string;
    onErrorStringAttribute: string;
    onDropError: {} | null;
    maxSize: string;
    minSize: string;
    maxFiles: string;
    acceptList: AcceptListPreviewType[];
    intenseMimeLookup: boolean;
}
