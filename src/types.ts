import DefaultTouchProcessor from "./DefaultTouchProcessor";
import { LayoutRectangle, NativeTouchEvent, ScaledSize } from "react-native";
import React from "react";

type RendererElement = React.ElementType | { type: React.ElementType };
type Entity = {
  renderer: RendererElement;
  [key: string]: unknown;
};
type Entities = { [key: string]: Entity };
type ScreenType = ScaledSize; // can't name just Screen because there's inbuilt type for that
type OnUpdateCallback = (time: number) => void;

type TouchEventType = "start" | "end" | "move" | "press" | "long-press";
type TouchProcessorFinalReturn = ReturnType<
  ReturnType<typeof DefaultTouchProcessor>
>;
type DispatchType = "started" | "stopped" | "swapped";
type DispatchFunction = { type: DispatchType | string };

type Optional<T> = T | null;

interface TimeUpdate {
  current: number;
  delta: number;
  previous: Optional<number>;
  previousDelta: Optional<number>;
}

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

type Renderer = (
  entities: Entities,
  screen: ScreenType,
  layout: LayoutRectangle
) => React.ReactNode;

interface TouchProcessorOptions {
  triggerPressEventBefore: number;
  triggerLongPressEventAfter: number;
  moveThreshold: number;
}

export {
  Renderer,
  Entity,
  Entities,
  ScreenType,
  OnUpdateCallback,
  DetailedTouchEvent,
  TouchProcessorFinalReturn,
  DispatchFunction,
  TimeUpdate,
  TouchEventType,
  TouchProcessorOptions,
  Optional,
};
