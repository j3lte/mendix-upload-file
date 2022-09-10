import { ActionValue } from "mendix";

export type ExecuteActionOptions = {
    force?: boolean;
    debug?: boolean;
};

export const executeAction = (
    action?: ActionValue,
    { force, debug }: ExecuteActionOptions = { force: true, debug: false }
): boolean => {
    if (debug) {
        console.log("executeAction", action);
    }
    if (action && (force || action.canExecute) && !action.isExecuting) {
        action.execute();
        return true;
    }
    return false;
};
