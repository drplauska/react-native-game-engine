import DefaultTouchProcessor from "./DefaultTouchProcessor";
import { LayoutRectangle, NativeTouchEvent, ScaledSize } from "react-native";
import React from "react";
declare type RendererElement = React.ElementType | {
    type: React.ElementType;
};
declare type Entity = {
    renderer: RendererElement;
    [key: string]: unknown;
};
declare type Entities = {
    [key: string]: Entity;
};
declare type ScreenType = ScaledSize;
declare type Callback = (time?: number) => void;
declare type TouchEventType = "start" | "end" | "move" | "press" | "long-press";
declare type TouchProcessorFinalReturn = ReturnType<ReturnType<typeof DefaultTouchProcessor>>;
declare type DispatchType = "started" | "stopped" | "swapped";
declare type DispatchFunction = {
    type: DispatchType | string;
};
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
declare type Renderer = (entities: Entities, screen: ScreenType, layout: LayoutRectangle) => React.ReactNode;
export { Renderer, Entity, Entities, ScreenType, Callback, DetailedTouchEvent, TouchProcessorFinalReturn, DispatchFunction, TimeUpdate, };
//# sourceMappingURL=types.d.ts.map