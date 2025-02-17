import { defaultTo, filter, find, has } from "lodash";

export function getOrAdd<T>(array: Array<T>, index: any, factory: () => T): T {
    const key = index.toString();
    if (has(array, key)) {
        return array[key];
    } else {
        array[key] = factory();
        return array[key];
    }
}

export function addOrUpdate<T>(array: Array<T>, index: any, updateValue: (current: T) => T, createValue: () => T) {
    const key = index.toString();
    if (has(array, key)) {
        array[key] = updateValue(array[key]);
    } else {
        array[key] = createValue();
    }
}

export function tryUpdate<T>(array: Array<T>, index: any, updateValue: (current: T) => T): boolean {
    const key = index.toString();
    if (has(array, key)) {
        array[key] = updateValue(array[key]);
        return true;
    } else {
        return false;
    }
}

export function setStyleVariable(varName: string, value: string, selector?: string) {
    let elements = filter(
        document.querySelectorAll(defaultTo(selector, '#root')),
        e => e instanceof HTMLElement
    ) as Array<HTMLElement>;

    for (let element of elements) {
        element.style.setProperty(varName, value);
    }
}

export function getStyleVariable(varName: string, selector?: string) {
    let element = find(
        document.querySelectorAll(defaultTo(selector, '#root')),
        e => e instanceof HTMLElement
    ) as HTMLElement | undefined;

    return element?.style.getPropertyValue(varName);
}