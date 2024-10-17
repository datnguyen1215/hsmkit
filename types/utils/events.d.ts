declare namespace _default {
    export { emitter };
    export { Emitter };
}
export default _default;
export type EventListener = (...args: any[]) => any[];
export type UnsubscribeListener = () => void;
export function emitter(): Emitter<any>;
export class Emitter<TEventEnum> {
    private listeners;
    on(event: TEventEnum, callback: EventListener): UnsubscribeListener;
    once(event: TEventEnum, callback: EventListener): UnsubscribeListener;
    off(event: TEventEnum, callback: EventListener): void;
    emit(event: TEventEnum, ...data: any[]): void;
}
