export declare class EventManager {
    private static createEvent;
    private static remove;
    private static removeFrom;
    private static removeFromAll;
    private static runEvent;
    private readonly oneTimeDelegates;
    private readonly fullTimeDelegates;
    constructor();
    addEventListener(namespace: string, action: string, delegateFunction: any, oneTime?: boolean): void;
    removeEventListener(namespace: string, action: string, delegateFunction: any): void;
    removeListener(delegateFunction: any): void;
    event(namespace: string, action: string, ...args: any): void;
}
