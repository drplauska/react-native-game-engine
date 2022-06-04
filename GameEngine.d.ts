import React, { Component } from "react";
import { ScaledSize, StyleProp, ViewStyle, GestureResponderEvent, LayoutChangeEvent, LayoutRectangle } from "react-native";
import DefaultTimer from "./DefaultTimer";
import type { TouchProcessorFinalReturn, DetailedTouchEvent, Entities, Renderer, DispatchFunction, TimeUpdate } from "./types";
interface GameEngineProps {
    systems?: ((entities: Entities, { touches, time }: {
        touches: DetailedTouchEvent[];
        time: TimeUpdate;
    }) => Entities)[];
    entities?: Entities | Promise<Entities>;
    renderer?: Renderer;
    touchProcessor?: TouchProcessorFinalReturn;
    timer?: typeof DefaultTimer;
    running?: boolean;
    onEvent?: ({ type }: DispatchFunction) => void;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
interface GameEngineStateProps {
    entities: Entities;
}
export default class GameEngine extends Component<GameEngineProps, GameEngineStateProps> {
    timer: DefaultTimer;
    touches: DetailedTouchEvent[];
    screen: ScaledSize;
    previousTime: number;
    previousDelta: number;
    events: DispatchFunction[];
    touchProcessor: TouchProcessorFinalReturn;
    layout: LayoutRectangle;
    static defaultProps: {
        systems: never[];
        entities: {};
        renderer: (entities: Entities, screen: ScaledSize, layout: LayoutRectangle) => (JSX.Element | null)[] | null;
        touchProcessor: (touches: any) => {
            process(type: any, event: any): void;
            end(): void;
        };
        running: boolean;
    };
    constructor(props: any);
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: any): void;
    clear: () => void;
    start: () => void;
    stop: () => void;
    swap: (newEntities: Entities) => Promise<void>;
    publish: (e: any) => void;
    publishEvent: (e: any) => void;
    dispatch: (e: DispatchFunction) => void;
    dispatchEvent: (e: any) => void;
    updateHandler: (currentTime: number) => void;
    onLayoutHandler: (e: LayoutChangeEvent) => void;
    onTouchStartHandler: (e: GestureResponderEvent) => void;
    onTouchMoveHandler: (e: GestureResponderEvent) => void;
    onTouchEndHandler: (e: GestureResponderEvent) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=GameEngine.d.ts.map