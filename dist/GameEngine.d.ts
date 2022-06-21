import React, { Component } from "react";
import { StyleProp, ViewStyle, GestureResponderEvent, LayoutChangeEvent, LayoutRectangle } from "react-native";
import DefaultTimer from "./DefaultTimer";
import type { TouchProcessorFinalReturn, DetailedTouchEvent, Entities, Renderer, Event, ScreenType, EntitiesMaybePromise, System } from "./types";
import DefaultTouchProcessor from "./DefaultTouchProcessor";
import type { Optional } from "./typeUtils";
interface GameEngineProps<OneTruth> {
    systems: System<OneTruth>[];
    entities?: EntitiesMaybePromise<OneTruth>;
    renderer?: Renderer<OneTruth>;
    touchProcessor: ReturnType<typeof DefaultTouchProcessor>;
    timer?: DefaultTimer;
    running?: boolean;
    onEvent?: (e: Event) => void;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
interface GameEngineState<OneTruth> {
    entities: Entities<OneTruth> | null;
}
export default class GameEngine<OneTruth = void> extends Component<GameEngineProps<OneTruth>, GameEngineState<OneTruth>> {
    timer: DefaultTimer;
    touches: DetailedTouchEvent[];
    screen: ScreenType;
    previousTime: Optional<number>;
    previousDelta: Optional<number>;
    events: Event[];
    touchProcessor: TouchProcessorFinalReturn;
    layout: Optional<LayoutRectangle>;
    static defaultProps: {
        systems: never[];
        entities: {};
        renderer: <OneTruth_1>(entities: Entities<OneTruth_1>, screen: import("react-native").ScaledSize, layout: LayoutRectangle) => (JSX.Element | null)[] | null;
        touchProcessor: (touches: DetailedTouchEvent[]) => {
            process(type: import("./types").TouchEventType, event: import("react-native").NativeTouchEvent): void;
            end(): void;
        };
        running: boolean;
    };
    constructor(props: GameEngineProps<OneTruth>);
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: GameEngineProps<OneTruth>): void;
    clear: () => void;
    start: () => void;
    stop: () => void;
    swap: (newEntities: Entities<OneTruth>) => Promise<void>;
    dispatch: (e: Event) => void;
    updateHandler: (currentTime: number) => void;
    onLayoutHandler: (e: LayoutChangeEvent) => void;
    onTouchStartHandler: (e: GestureResponderEvent) => void;
    onTouchMoveHandler: (e: GestureResponderEvent) => void;
    onTouchEndHandler: (e: GestureResponderEvent) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=GameEngine.d.ts.map