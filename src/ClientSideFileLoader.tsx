import { ReactNode, createElement, useMemo, useCallback } from "react";
import { FileRejection, DropEvent } from "react-dropzone";

import { ClientSideFileLoaderContainerProps } from "../typings/ClientSideFileLoaderProps";

import { FileDropZone, Zones } from "./components/FileDropZone";

import { getDynamicValueBig, getDynamicValueString, useIsDisabled } from "./util/data";
import { acceptListToAccept } from "./util/accept";
import { FileObject, createFileArrayJSONString } from "./util/fileobjects";
import { executeAction } from "./util/action";
import { createErrorArrayJSON } from "./util/error";
import { ValueStatus } from "mendix";
import { dispatchCustomEvent } from "./util/events";

export function ClientSideFileLoader({
    uploadFilesStringAttribute,
    dataCustomEventKey,
    maxSize: maxSizeValue,
    minSize: minSizeValue,
    maxFiles: maxFilesValue,
    onDropAction,
    acceptList,
    errorCustomEventKey,
    onErrorStringAttribute,
    onDropError,
    class: className,
    areaDropZone,
    areaDropZoneDisabled,
    intenseMimeLookup,
    style
}: ClientSideFileLoaderContainerProps): ReactNode {
    const maxSize = getDynamicValueBig(maxSizeValue);
    const minSize = getDynamicValueBig(minSizeValue);
    const maxFiles = getDynamicValueBig(maxFilesValue);

    const onDataCustomEventKey = getDynamicValueString(dataCustomEventKey);
    const onErrorCustomEventKey = getDynamicValueString(errorCustomEventKey);
    const [disabled, _error] = useIsDisabled(uploadFilesStringAttribute, dataCustomEventKey, maxFiles);

    console.log(disabled, _error);

    const accept = acceptListToAccept(acceptList);
    const zones: Zones = useMemo(
        () => ({ dropZone: areaDropZone, dropZoneDisabled: areaDropZoneDisabled }),
        [areaDropZone, areaDropZoneDisabled]
    );

    const onDrop = useCallback(
        (acceptedFiles: FileObject[], fileRejections: FileRejection[], _event: DropEvent): void => {
            if (disabled) {
                return;
            }

            if (fileRejections.length > 0) {
                const fileRejectionError = createErrorArrayJSON(fileRejections);
                if (
                    onErrorStringAttribute &&
                    !onErrorStringAttribute.readOnly &&
                    onErrorStringAttribute.status === ValueStatus.Available
                ) {
                    onErrorStringAttribute.setValue(fileRejectionError);
                }
                executeAction(onDropError);
                if (onErrorCustomEventKey) {
                    dispatchCustomEvent(onErrorCustomEventKey, fileRejectionError);
                }
            }

            let fileArray: FileObject[] = acceptedFiles;
            if (typeof maxFiles === "number" && maxFiles > -1) {
                fileArray = fileArray.slice(0, maxFiles);
            }

            if (fileArray.length > 0) {
                fileArray.forEach(fileObject => {
                    fileObject.objectURL = URL.createObjectURL(fileObject.file);
                });
                const json = createFileArrayJSONString(fileArray);
                if (uploadFilesStringAttribute && !uploadFilesStringAttribute.readOnly) {
                    uploadFilesStringAttribute.setValue(json);
                }
                executeAction(onDropAction, {});
                if (onDataCustomEventKey) {
                    dispatchCustomEvent(onDataCustomEventKey, json);
                }
            }
        },
        [
            disabled,
            maxFiles,
            onDataCustomEventKey,
            onDropAction,
            onDropError,
            onErrorCustomEventKey,
            onErrorStringAttribute,
            uploadFilesStringAttribute
        ]
    );

    const dropzoneOpts = {
        disabled,
        className,
        style,
        maxFiles,
        maxSize,
        minSize,
        onDrop,
        zones,
        accept,
        intenseMimeLookup
    };

    return <FileDropZone {...dropzoneOpts} />;
}
