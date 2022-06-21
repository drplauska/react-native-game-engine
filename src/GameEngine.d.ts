import React, { Component } from "react";
import { StyleProp, ViewStyle, GestureResponderEvent, LayoutChangeEvent, LayoutRectangle } from "react-native";
import DefaultTimer from "./DefaultTimer";
import type { TouchProcessorFinalReturn, DetailedTouchEvent, Entities, Renderer, Event, TimeUpdate, ScreenType, EntitiesMaybePromise } from "./types";
import DefaultTouchProcessor from "./DefaultTouchProcessor";
import type { Optional } from "./typeUtils";
interface GameEngineProps {
    systems: ((entities: Optional<Entities>, { touches, screen, time, layout, events, dispatch, }: {
        touches: DetailedTouchEvent[];
        time: TimeUpdate;
        screen: ScreenType;
        layout: Optional<LayoutRectangle>;
        dispatch: (event: Event) => void;
        events: Event[];
    }) => Entities)[];
    entities?: EntitiesMaybePromise;
    renderer?: Renderer;
    touchProcessor: ReturnType<typeof DefaultTouchProcessor>;
    timer?: DefaultTimer;
    running?: boolean;
    onEvent?: (e: Event) => void;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
interface GameEngineState {
    entities: Optional<Entities>;
}
export default class GameEngine extends Component<GameEngineProps, GameEngineState> {
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
        renderer: (entities: Entities, screen: import("react-native").ScaledSize, layout: LayoutRectangle) => (JSX.Element | null)[] | null;
        touchProcessor: (touches: DetailedTouchEvent[]) => {
            process(type: import("./types").TouchEventType, event: import("react-native").NativeTouchEvent): void;
            end(): void;
        };
        running: boolean;
    };
    constructor(props: GameEngineProps);
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: GameEngineProps): void;
    clear: () => void;
    start: () => void;
    stop: () => void;
    swap: (newEntities: Entities) => Promise<void>;
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