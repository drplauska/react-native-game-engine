import DefaultTouchProcessor from "./DefaultTouchProcessor";
import { NativeTouchEvent, ScaledSize } from "react-native";

type Renderer = React.ElementType | { type: React.ElementType };
type Entity = {
  renderer: Renderer;
  [key: string]: unknown;
};
type Entities = { [key: string]: Entity };
type ScreenType = ScaledSize; // can't name just Screen because there's inbuilt type for that
type Time = number;
type Callback = (time?: Time) => void;

type TouchEventType = "start" | "end" | "move" | "press" | "long-press";
type TouchProcessorFinalReturn = ReturnType<
  ReturnType<typeof DefaultTouchProcessor>
>;
type DispatchType = "started" | "stopped" | "swapped";
type DispatchFunction = { type: DispatchType };

interface DetailedTouchEvent {
  event: NativeTouchEvent;
  id: number;
  type: TouchEventType;
  delta?: {
    locationX: number;
    locationY: number;
    pageX: number;
    pageY: number;
    timestamp: number;
  };
}

export {
  Renderer,
  Entity,
  Entities,
  ScreenType,
  Time,
  Callback,
  DetailedTouchEvent,
  TouchProcessorFinalReturn,
  DispatchFunction,
};
