import React from "react";
import { LayoutRectangle, NativeTouchEvent, ScaledSize } from "react-native";
import type { Optional } from "./typeUtils";
import DefaultTouchProcessor from "./DefaultTouchProcessor";
declare type RendererElement = React.ElementType | {
    type: React.ElementType;
};
declare type Entity<T = void> = T extends void ? {
    renderer?: RendererElement;
    [key: string]: unknown;
} : {
    renderer?: RendererElement;
    [key: string]: unknown;
} & {
    [key: string]: T;
};
declare type Entities<OneTruth> = {
    [key: string]: Entity<OneTruth>;
};
declare type EntitiesMaybePromise<OneTruth> = Entities<OneTruth> | Promise<Entities<OneTruth>>;
declare type ScreenType = ScaledSize;
declare type OnUpdateCallback = (time: number) => void;
declare type TouchEventType = "start" | "end" | "move" | "press" | "long-press";
declare type TouchProcessorFinalReturn = ReturnType<ReturnType<typeof DefaultTouchProcessor>>;
declare type DispatchType = "started" | "stopped" | "swapped";
declare type Event = {
    type: DispatchType | string;
};
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
declare type Renderer<OneTruth> = (entities: Entities<OneTruth>, screen: ScreenType, layout: LayoutRectangle) => React.ReactNode;
interface TouchProcessorOptions {
    triggerPressEventBefore: number;
    triggerLongPressEventAfter: number;
    moveThreshold: number;
}
declare type Time = {
    current: number;
    previous: Optional<number>;
    delta: number;
    previousDelta: Optional<number>;
};
declare type GameLoopOnUpdate = {
    touches: DetailedTouchEvent[];
    screen: ScreenType;
    layout: Optional<LayoutRectangle>;
    time: Time;
};
declare type System<OneTruth> = (entities: Entities<OneTruth>, { touches, screen, time, layout, events, dispatch }: SystemParams) => Entities<OneTruth>;
declare type SystemParams = {
    touches: DetailedTouchEvent[];
    time: TimeUpdate;
    screen: ScreenType;
    layout: Optional<LayoutRectangle>;
    dispatch: (event: Event) => void;
    events: Event[];
};
export { Renderer, Entity, Entities, ScreenType, OnUpdateCallback, DetailedTouchEvent, TouchProcessorFinalReturn, Event, TimeUpdate, TouchEventType, TouchProcessorOptions, EntitiesMaybePromise, Time, GameLoopOnUpdate, System, SystemParams, };
//# sourceMappingURL=types.d.ts.map