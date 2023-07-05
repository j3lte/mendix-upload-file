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
    uploadFilesStringAttribute?: EditableValue<string>;
    onDropAction?: ActionValue;
    dataCustomEventKey?: DynamicValue<string>;
    areaDropZone: ReactNode;
    areaDropZoneDisabled?: ReactNode;
    onErrorStringAttribute?: EditableValue<string>;
    onDropError?: ActionValue;
    errorCustomEventKey?: DynamicValue<string>;
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
    uploadFilesStringAttribute: string;
    onDropAction: {} | null;
    dataCustomEventKey: string;
    areaDropZone: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    areaDropZoneDisabled: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    onErrorStringAttribute: string;
    onDropError: {} | null;
    errorCustomEventKey: string;
    maxSize: string;
    minSize: string;
    maxFiles: string;
    acceptList: AcceptListPreviewType[];
    intenseMimeLookup: boolean;
}
