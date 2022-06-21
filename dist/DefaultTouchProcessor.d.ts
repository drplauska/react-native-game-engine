import { GestureResponderEvent } from "react-native";
import { DetailedTouchEvent, TouchEventType } from "./types";
interface DefaultTouchProcessorProps {
    triggerPressEventBefore?: number;
    triggerLongPressEventAfter?: number;
    moveThreshold?: number;
}
declare const DefaultTouchProcessor: ({ triggerPressEventBefore, triggerLongPressEventAfter, moveThreshold, }: DefaultTouchProcessorProps) => (touches: DetailedTouchEvent[]) => {
    process(type: TouchEventType, event: GestureResponderEvent["nativeEvent"]): void;
    end(): void;
};
export default DefaultTouchProcessor;
//# sourceMappingURL=DefaultTouchProcessor.d.ts.map