import { ReactNode, createElement, useCallback, useMemo, useEffect } from "react";
import { FileRejection, DropEvent } from "react-dropzone";
import { useUnmount, useList } from "react-use";
import { getDynamicValueString, getDynamicValueBig } from "./util/data";

import "./ui/ClientSideFileLoader.scss";

import { ClientSideFileLoaderContainerProps } from "../typings/ClientSideFileLoaderProps";

import { FileDropZone, Zones } from "./components/FileDropZone";
import { compareFileObjects, FileObject } from "./util/fileobjects";
import { acceptListToAccept } from "./util/accept";
import { executeAction } from "./util/action";

// eslint-disable-next-line no-empty-pattern
export function ClientSideFileLoader({
    dataObjectURLS,
    maxSize: maxSizeValue,
    maxFiles: maxFilesValue,
    acceptList,
    onDropAction,
    class: className,
    areaDropZone,
    areaDropZoneDisabled,
    intenseMimeLookup,
    style
}: ClientSideFileLoaderContainerProps): ReactNode {
    const dataObjectURLSString = getDynamicValueString(dataObjectURLS);
    const maxSize = getDynamicValueBig(maxSizeValue);
    const maxFiles = getDynamicValueBig(maxFilesValue);
    const accept = acceptListToAccept(acceptList);
    const disabled = dataObjectURLS.readOnly;

    const [objectList, { push }] = useList<FileObject>([]);

    const objectURLList = useMemo(
        () =>
            objectList
                .filter(o => o.objectURL)
                .map(o => {
                    return btoa(
                        JSON.stringify({
                            name: o.file.name,
                            type: o.file.type,
                            size: o.file.size,
                            url: o.objectURL
                        })
                    );
                })
                .sort()
                .join("|"),
        [objectList]
    );

    const executeOnDrop = useCallback(() => {
        setTimeout(() => {
            executeAction(onDropAction);
        }, 500);
    }, [onDropAction]);

    useUnmount(() => {
        // We need to release object URLs when unmounting, so we don't keep files in browser memory
        objectList.forEach(o => {
            try {
                if (o.objectURL) {
                    URL.revokeObjectURL(o.objectURL);
                }
            } catch (_error) {
                // Ignore
            }
        });
    });

    // useEffect(() => {
    //     console.log("change from dataObjectURLSString: ", dataObjectURLSString);
    // }, [dataObjectURLSString]);

    // useEffect(() => {
    //     console.log("change from objectURLList: ", objectURLList);
    // }, [objectURLList]);

    useEffect(() => {
        if (dataObjectURLSString === null || dataObjectURLSString === objectURLList || !objectURLList) {
            return;
        }
        dataObjectURLS.setTextValue(objectURLList);
    }, [objectURLList, dataObjectURLSString, dataObjectURLS]);

    const zones: Zones = { dropZone: areaDropZone, dropZoneDisabled: areaDropZoneDisabled };
    const onDrop = useCallback(
        (acceptedFiles: FileObject[], _fileRejections: FileRejection[], _event: DropEvent): void => {
            if (acceptedFiles.length === 0) {
                return;
            }
            const newFiles = acceptedFiles
                .filter(af => !objectList.find(oL => compareFileObjects(oL, af)))
                .map(nf => {
                    nf.objectURL = URL.createObjectURL(nf.file);
                    return nf;
                });
            if (newFiles.length === 0) {
                return;
            }
            push(...newFiles);
            executeOnDrop();
        },
        [executeOnDrop, objectList, push]
    );

    if (dataObjectURLSString === null) {
        return null;
    }

    const dropzoneOpts = {
        disabled,
        className,
        style,
        maxFiles,
        maxSize,
        onDrop,
        zones,
        accept,
        intenseMimeLookup
    };

    return <FileDropZone {...dropzoneOpts} />;
}
