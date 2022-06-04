import { Callback } from "types";
declare class DefaultTimer {
    subscribers: Callback[];
    loopId: number | null;
    constructor();
    loop: (time?: number | undefined) => void;
    start(): void;
    stop(): void;
    subscribe(callback: Callback): void;
    unsubscribe(callback: Callback): void;
}
export default DefaultTimer;
//# sourceMappingURL=DefaultTimer.d.ts.map