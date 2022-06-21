import React, { Component } from "react";
import { LayoutRectangle, LayoutChangeEvent, GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import type { DetailedTouchEvent, GameLoopOnUpdate, ScreenType, TouchProcessorFinalReturn } from "./types";
import type { Optional } from "./typeUtils";
import DefaultTimer from "./DefaultTimer";
import DefaultTouchProcessor from "./DefaultTouchProcessor";
interface GameLoopProps {
    timer?: DefaultTimer;
    touchProcessor: ReturnType<typeof DefaultTouchProcessor>;
    running: boolean;
    onUpdate: ({ touches, screen, layout, time }: GameLoopOnUpdate) => void;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export default class GameLoop extends Component<GameLoopProps> {
    timer: DefaultTimer;
    touches: DetailedTouchEvent[];
    screen: ScreenType;
    previousTime: Optional<number>;
    previousDelta: Optional<number>;
    touchProcessor: TouchProcessorFinalReturn;
    layout: Optional<LayoutRectangle>;
    static defaultProps: {
        touchProcessor: (touches: DetailedTouchEvent[]) => {
            process(type: import("./types").TouchEventType, event: import("react-native").NativeTouchEvent): void;
            end(): void;
        };
        running: boolean;
    };
    constructor(props: GameLoopProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: GameLoopProps): void;
    start: () => void;
    stop: () => void;
    updateHandler: (currentTime: number) => void;
    onLayoutHandler: (e: LayoutChangeEvent) => void;
    onTouchStartHandler: (e: GestureResponderEvent) => void;
    onTouchMoveHandler: (e: GestureResponderEvent) => void;
    onTouchEndHandler: (e: GestureResponderEvent) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=GameLoop.d.ts.map