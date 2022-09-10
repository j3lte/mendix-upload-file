import { Accept } from "react-dropzone";
import { AcceptListType } from "typings/ClientSideFileLoaderProps";

export const acceptListToAccept = (acceptList: AcceptListType[]): Accept | undefined => {
    if (acceptList.length === 0) {
        return undefined;
    }
    const accept: Accept = {};
    acceptList.forEach(acc => {
        accept[acc.acceptGroupName] = (acc.acceptExtensions || "").split("|");
    });

    return accept;
};
