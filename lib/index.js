"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventManager {
    static createEvent(namespace, action, delegateHolder) {
        const defineIn = delegateHolder;
        if (!defineIn.hasOwnProperty(namespace)) {
            defineIn[namespace] = {};
            defineIn[namespace][action] = [];
        }
        else if (!defineIn[namespace].hasOwnProperty(action)) {
            defineIn[namespace][action] = [];
        }
    }
    static remove(array, delegateFunction) {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i] === delegateFunction) {
                array.splice(i, 1);
                return;
            }
        }
    }
    static removeFrom(delegateHolder, namespace, action, delegateFunction) {
        if (delegateHolder.hasOwnProperty(namespace)) {
            if (delegateHolder[namespace].hasOwnProperty(action)) {
                const array = delegateHolder[namespace][action];
                EventManager.remove(array, delegateFunction);
            }
        }
    }
    static removeFromAll(delegateHolder, delegateFunction) {
        const keys = Object.keys(delegateHolder);
        for (const key of keys) {
            const subObjectKeys = Object.keys(delegateHolder[key]);
            for (const subKey of subObjectKeys) {
                const array = delegateHolder[key][subKey];
                EventManager.remove(array, delegateFunction);
            }
        }
    }
    static runEvent(delegateHolder, namespace, action, ...args) {
        if (delegateHolder.hasOwnProperty(namespace)) {
            if (delegateHolder[namespace].hasOwnProperty(action)) {
                const methods = delegateHolder[namespace][action];
                for (const method of methods) {
                    method(...args);
                }
            }
        }
    }
    constructor() {
        this.oneTimeDelegates = {};
        this.fullTimeDelegates = {};
    }
    addEventListener(namespace, action, delegateFunction, oneTime = false) {
        const holder = oneTime ? this.oneTimeDelegates : this.fullTimeDelegates;
        EventManager.createEvent(namespace, action, holder);
        const appendTo = oneTime ? this.oneTimeDelegates : this.fullTimeDelegates;
        appendTo[namespace][action].push(delegateFunction);
    }
    removeEventListener(namespace, action, delegateFunction) {
        EventManager.removeFrom(this.oneTimeDelegates, namespace, action, delegateFunction);
        EventManager.removeFrom(this.fullTimeDelegates, namespace, action, delegateFunction);
    }
    removeListener(delegateFunction) {
        EventManager.removeFromAll(this.oneTimeDelegates, delegateFunction);
        EventManager.removeFromAll(this.fullTimeDelegates, delegateFunction);
    }
    event(namespace, action, ...args) {
        EventManager.runEvent(this.oneTimeDelegates, namespace, action, ...args);
        EventManager.runEvent(this.fullTimeDelegates, namespace, action, ...args);
        if (this.oneTimeDelegates.hasOwnProperty(namespace)) {
            if (this.oneTimeDelegates[namespace].hasOwnProperty(action)) {
                this.oneTimeDelegates[namespace][action] = [];
            }
        }
    }
}
exports.EventManager = EventManager;
