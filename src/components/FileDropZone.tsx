import { createElement, CSSProperties, FC, ReactNode, useCallback } from "react";
import { useDropzone, Accept, DropEvent, FileRejection } from "react-dropzone";
import clsx from "clsx";
import { createFileObjects, FileObject } from "src/util/fileobjects";

export type Zones = {
    dropZone: ReactNode;
    dropZoneDisabled?: ReactNode;
};
export interface FileDropZoneProps {
    onDrop: (acceptedFiles: FileObject[], fileRejections: FileRejection[], event: DropEvent) => void;
    zones: Zones;
    accept?: Accept;
    maxFiles?: number;
    maxSize?: number;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
    intenseMimeLookup?: boolean;
    debug?: boolean;
}

export const FileDropZone: FC<FileDropZoneProps> = ({
    onDrop,
    zones,
    accept,
    maxFiles,
    maxSize,
    disabled,
    className,
    style,
    intenseMimeLookup,
    debug
}) => {
    const multiple = typeof maxFiles === "number" ? maxFiles > 1 : true;
    const fileDropZone = disabled && zones.dropZoneDisabled ? zones.dropZoneDisabled : zones.dropZone;

    const onDropInternal = useCallback(
        async (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
            const acceptedFileObjects = await createFileObjects(acceptedFiles, { debug, intenseMimeLookup });
            onDrop(acceptedFileObjects, fileRejections, event);
        },
        [debug, intenseMimeLookup, onDrop]
    );

    const { getRootProps, getInputProps, isFocused, isDragActive, isDragAccept, isDragReject, isFileDialogActive } =
        useDropzone({ onDrop: onDropInternal, accept, maxSize, multiple, disabled });

    return (
        <div
            {...getRootProps({
                className: clsx("file-drop-zone", className, {
                    "is-focussed": isFocused,
                    "drag-active": isDragActive,
                    "drag-accept": isDragAccept,
                    "drag-reject": isDragReject,
                    "is-disabled": disabled,
                    "dialog-active": isFileDialogActive
                })
            })}
            style={style}
        >
            <input {...getInputProps()} />
            <div className={clsx("file-drop-zone-content")}>{fileDropZone}</div>
        </div>
    );
};
