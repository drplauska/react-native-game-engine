import { OnUpdateCallback } from "./types";
import type { Optional } from "./typeUtils";
declare class DefaultTimer {
    subscribers: OnUpdateCallback[];
    loopId: Optional<number>;
    constructor();
    loop: (time?: number) => void;
    start(): void;
    stop(): void;
    subscribe(callback: OnUpdateCallback): void;
    unsubscribe(callback: OnUpdateCallback): void;
}
export default DefaultTimer;
//# sourceMappingURL=DefaultTimer.d.ts.map