import React from "react";
import { LayoutRectangle, NativeTouchEvent, ScaledSize } from "react-native";

import DefaultTouchProcessor from "./DefaultTouchProcessor";

type RendererElement = React.ElementType | { type: React.ElementType }; // would RendererElement accept functional components?
type Entity = {
  renderer?: RendererElement;
  [key: string]: unknown;
};
type Entities = { [key: string]: Entity };
type EntitiesMaybePromise = Entities | Promise<Entities>;
type ScreenType = ScaledSize; // can't name just Screen because there's inbuilt type for that
type OnUpdateCallback = (time: number) => void;

type TouchEventType = "start" | "end" | "move" | "press" | "long-press";
type TouchProcessorFinalReturn = ReturnType<
  ReturnType<typeof DefaultTouchProcessor>
>;
type DispatchType = "started" | "stopped" | "swapped";
type Event = { type: DispatchType | string };

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
  Event,
  TimeUpdate,
  TouchEventType,
  TouchProcessorOptions,
  Optional,
  EntitiesMaybePromise,
};
