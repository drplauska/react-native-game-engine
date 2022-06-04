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
type Callback = (time?: number) => void;

type TouchEventType = "start" | "end" | "move" | "press" | "long-press";
type TouchProcessorFinalReturn = ReturnType<
  ReturnType<typeof DefaultTouchProcessor>
>;
type DispatchType = "started" | "stopped" | "swapped";
type DispatchFunction = { type: DispatchType | string };

interface TimeUpdate {
  current: number;
  delta: number;
  previous: number;
  previousDelta: number;
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

export {
  Renderer,
  Entity,
  Entities,
  ScreenType,
  Callback,
  DetailedTouchEvent,
  TouchProcessorFinalReturn,
  DispatchFunction,
  TimeUpdate,
  TouchEventType,
};
