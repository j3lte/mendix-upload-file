export const dispatchCustomEvent = (eventName: string, detail: unknown): void => {
    const event = new CustomEvent(eventName, { detail });
    window.document.dispatchEvent(event);
};
