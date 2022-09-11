import { ReactNode, createElement, useMemo, useCallback } from "react";
import { FileRejection, DropEvent } from "react-dropzone";

import { ClientSideFileLoaderContainerProps } from "../typings/ClientSideFileLoaderProps";

import { FileDropZone, Zones } from "./components/FileDropZone";

import { getDynamicValueBig, getDynamicValueString } from "./util/data";
import { acceptListToAccept } from "./util/accept";
import { createFileArrayJSON, FileObject } from "./util/fileobjects";
import { executeAction } from "./util/action";
import { createErrorArrayJSON } from "./util/error";
import { ValueStatus } from "mendix";

export function ClientSideFileLoader({
    uploadFilesStringAttribute,
    maxSize: maxSizeValue,
    minSize: minSizeValue,
    maxFiles: maxFilesValue,
    onDropAction,
    acceptList,
    onErrorStringAttribute,
    onDropError,
    class: className,
    areaDropZone,
    areaDropZoneDisabled,
    intenseMimeLookup,
    style
}: ClientSideFileLoaderContainerProps): ReactNode {
    const uploadFileStringValue = getDynamicValueString(uploadFilesStringAttribute);
    const maxSize = getDynamicValueBig(maxSizeValue);
    const minSize = getDynamicValueBig(minSizeValue);
    const maxFiles = getDynamicValueBig(maxFilesValue);
    const accept = acceptListToAccept(acceptList);
    const zones: Zones = useMemo(
        () => ({ dropZone: areaDropZone, dropZoneDisabled: areaDropZoneDisabled }),
        [areaDropZone, areaDropZoneDisabled]
    );
    const disabled =
        uploadFileStringValue === null ||
        uploadFileStringValue !== "" ||
        uploadFilesStringAttribute.readOnly ||
        maxFiles === 0;

    const onDrop = useCallback(
        (acceptedFiles: FileObject[], fileRejections: FileRejection[], _event: DropEvent): void => {
            if (disabled) {
                return;
            }

            if (fileRejections.length > 0) {
                if (
                    onErrorStringAttribute &&
                    !onErrorStringAttribute.readOnly &&
                    onErrorStringAttribute.status === ValueStatus.Available
                ) {
                    onErrorStringAttribute.setValue(createErrorArrayJSON(fileRejections));
                }
                executeAction(onDropError);
            }

            let fileArray: FileObject[] = acceptedFiles;
            if (typeof maxFiles === "number" && maxFiles > -1) {
                fileArray = fileArray.slice(0, maxFiles);
            }
            if (fileArray.length > 0) {
                fileArray.forEach(fileObject => {
                    fileObject.objectURL = URL.createObjectURL(fileObject.file);
                });
                const json = createFileArrayJSON(fileArray);
                uploadFilesStringAttribute.setValue(json);
                executeAction(onDropAction, {});
            }
        },
        [disabled, maxFiles, onDropAction, onDropError, onErrorStringAttribute, uploadFilesStringAttribute]
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
