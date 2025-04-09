import { create } from './main';
import { ActionFunction } from './type';
declare class Hooks<T> {
    constructor();
    isAsync(fn: ActionFunction<T>): boolean;
}
declare class History<T, K extends Record<string, ActionFunction<T>>> {
    private store;
    history: T[];
    future: T[];
    constructor(store: create<T, K>);
    saveState(): void;
    undo(): Promise<void>;
    redo(): Promise<void>;
}
export { History, Hooks };
