import React from "react";
import { LayoutRectangle, NativeTouchEvent, ScaledSize } from "react-native";
import type { Optional } from "./typeUtils";

import DefaultTouchProcessor from "./DefaultTouchProcessor";

type RendererElement = React.ElementType | { type: React.ElementType }; // would RendererElement accept functional components?

type Entity = {
  renderer?: RendererElement;
  [key: string]: unknown;
};
type Entities = { [key: string]: Entity };
type EntitiesMaybePromise = Entities | Promise<Entities>;

type ScreenType = ScaledSize;

type OnUpdateCallback = (time: number) => void;

type TouchEventType = "start" | "end" | "move" | "press" | "long-press";

type TouchProcessorFinalReturn = ReturnType<
  ReturnType<typeof DefaultTouchProcessor>
>;
type DispatchType = "started" | "stopped" | "swapped";
type Event = { type: DispatchType | string };

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

type Time = {
  current: number;
  previous: Optional<number>;
  delta: number;
  previousDelta: Optional<number>;
};

type GameLoopOnUpdate = {
  touches: DetailedTouchEvent[];
  screen: ScreenType;
  layout: Optional<LayoutRectangle>;
  time: Time;
};

type System = (
  entities: Entities,
  { touches, screen, time, layout, events, dispatch }: SystemParams
) => Entities;

type SystemParams = {
  touches: DetailedTouchEvent[];
  time: TimeUpdate;
  screen: ScreenType;
  layout: Optional<LayoutRectangle>;
  dispatch: (event: Event) => void;
  events: Event[];
};

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
  EntitiesMaybePromise,
  Time,
  GameLoopOnUpdate,
  System,
  SystemParams,
};
