import { FileError, FileRejection } from "react-dropzone";

export type ErrorReturnType = {
    fileName: string;
    fileType: string;
    fileSize: number;
    errors: FileError[];
};

export const createErrorArrayJSON = (rejections: FileRejection[]): string =>
    JSON.stringify(
        rejections.map<ErrorReturnType>(r => ({
            fileName: r.file.name,
            fileType: r.file.type,
            fileSize: r.file.size,
            errors: r.errors
        }))
    );
