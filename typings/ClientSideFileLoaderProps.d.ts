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
    dataObjectURLS: EditableValue<string>;
    maxSize?: DynamicValue<Big>;
    maxFiles?: DynamicValue<Big>;
    acceptList: AcceptListType[];
    areaDropZone: ReactNode;
    areaDropZoneDisabled?: ReactNode;
    onDropAction?: ActionValue;
    filterInternal: boolean;
    intenseMimeLookup: boolean;
}

export interface ClientSideFileLoaderPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    dataObjectURLS: string;
    maxSize: string;
    maxFiles: string;
    acceptList: AcceptListPreviewType[];
    areaDropZone: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    areaDropZoneDisabled: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    onDropAction: {} | null;
    filterInternal: boolean;
    intenseMimeLookup: boolean;
}
