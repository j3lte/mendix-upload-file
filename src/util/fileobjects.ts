import { lookup } from "mrmime";
import { filetypemime } from "magic-bytes.js";

export type FileObject = {
    file: File;
    objectURL: string | null;
};

export type FileObjectReturnType = {
    objectURL: string;
    fileName: string;
    fileType: string;
    fileSize: number;
};

interface CreateFileOptions {
    calculateHash?: boolean;
    debug?: boolean;
    intenseMimeLookup?: boolean;
}

const suspectBinary = (uintArray: Uint8Array): boolean => {
    const totalBytes = uintArray.length;
    let suspiciousBytes = 0;

    for (let i = 0; i < totalBytes; i++) {
        if (uintArray[i] === 0) {
            // NULL byte--it's binary!
            return true;
        } else if ((uintArray[i] < 7 || uintArray[i] > 14) && (uintArray[i] < 32 || uintArray[i] > 127)) {
            // UTF-8 detection
            if (uintArray[i] > 193 && uintArray[i] < 224 && i + 1 < totalBytes) {
                i++;
                if (uintArray[i] > 127 && uintArray[i] < 192) {
                    continue;
                }
            } else if (uintArray[i] > 223 && uintArray[i] < 240 && i + 2 < totalBytes) {
                i++;
                if (uintArray[i] > 127 && uintArray[i] < 192 && uintArray[i + 1] > 127 && uintArray[i + 1] < 192) {
                    i++;
                    continue;
                }
            }

            suspiciousBytes++;
            // Read at least 32 uintArray before making a decision
            if (i >= 32 && (suspiciousBytes * 100) / totalBytes > 10) {
                return true;
            }
        }
    }

    if ((suspiciousBytes * 100) / totalBytes > 10) {
        return true;
    }

    return false;
};

const readFileAsBuffer = async (file: File, debug = false): Promise<ArrayBuffer> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onabort = () => {
            if (debug) {
                console.log("file reading was aborted");
            }
            reject(new Error("file reading was aborted"));
        };
        reader.onerror = ev => {
            if (debug) {
                console.log("file reading has failed", ev);
            }
            reject(new Error("file reading has failed"));
        };
        reader.onload = () => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result;
            if (binaryStr === null || (typeof binaryStr === "string" && binaryStr.length === 0)) {
                reject(new Error("file appears to be empty"));
                return;
            }
            if (typeof binaryStr === "string") {
                return new TextEncoder().encode(binaryStr);
            }
            resolve(binaryStr);
        };
        reader.readAsArrayBuffer(file);
    });

export const createFileObjects = (
    files: File[],
    { debug, intenseMimeLookup }: CreateFileOptions
): Promise<FileObject[]> =>
    Promise.all(
        files.map(async file => {
            const fileObject: FileObject = { file, objectURL: null };

            if (!file.type && intenseMimeLookup) {
                const buf = await readFileAsBuffer(file, debug);
                const bytes = new Uint8Array(buf);
                const mime = filetypemime(bytes as unknown as any[]);
                let type: string | null = null;

                if (mime && mime.length > 0) {
                    type = mime[0];
                } else {
                    const lookedUp = lookup(file.name);
                    if (lookedUp) {
                        type = lookedUp;
                    } else {
                        const isBinary = suspectBinary(bytes);
                        type = isBinary ? "unknown/binary" : "unknown/text";
                    }
                }

                const newFile = new File([bytes], file.name, {
                    type,
                    lastModified: file.lastModified
                });

                fileObject.file = newFile;
            }

            return fileObject;
        })
    );

export const compareFileObjects = (obj1: FileObject, obj2: FileObject): boolean =>
    obj1.file.name === obj2.file.name && obj1.file.size === obj2.file.size && obj1.file.type === obj2.file.type;

export const createFileArrayJSON = (objs: FileObject[]): string =>
    JSON.stringify(
        objs.map<FileObjectReturnType>(obj => ({
            objectURL: obj.objectURL || "",
            fileName: obj.file.name,
            fileType: obj.file.type,
            fileSize: obj.file.size
        }))
    );
