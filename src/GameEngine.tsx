import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScaledSize,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeTouchEvent,
  LayoutRectangle,
} from "react-native";
import DefaultTimer from "./DefaultTimer";
import DefaultRenderer from "./DefaultRenderer";
import type {
  TouchProcessorFinalReturn,
  DetailedTouchEvent,
  Entities,
  Renderer,
  DispatchFunction,
  Entity,
  TimeUpdate,
} from "./types";
import DefaultTouchProcessor from "./DefaultTouchProcessor";

interface Props {
  initState?: any;
  initialState?: any;
  state?: any;
  initEntities?: any;
  initialEntities?: any;
  entities?: any;
}

const getEntitiesFromProps = (props: Props) =>
  props.initState ||
  props.initialState ||
  props.state ||
  props.initEntities ||
  props.initialEntities ||
  props.entities;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPromise = (obj: any): obj is Promise<any> => {
  return !!(
    obj &&
    obj.then &&
    obj.then.constructor &&
    obj.then.call &&
    obj.then.apply
  );
};

interface GameEngineProps {
  systems?: ((
    entities: Entities,
    { touches, time }: { touches: DetailedTouchEvent[]; time: TimeUpdate }
  ) => Entities)[];
  entities?: Entities | Promise<Entities>;
  renderer?: Renderer;
  touchProcessor: TouchProcessorFinalReturn;
  timer?: DefaultTimer;
  running?: boolean;
  onEvent?: ({ type }: DispatchFunction) => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

interface GameEngineState {
  entities: null | Entities;
}

export default class GameEngine extends Component<
  GameEngineProps,
  GameEngineState
> {
  timer: DefaultTimer;
  touches: DetailedTouchEvent[];
  screen: ScaledSize;
  previousTime: number | null;
  previousDelta: number | null;
  events: DispatchFunction[];
  touchProcessor: TouchProcessorFinalReturn;
  layout: LayoutRectangle;

  static defaultProps = {
    systems: [],
    entities: {},
    renderer: DefaultRenderer,
    touchProcessor: DefaultTouchProcessor({
      triggerPressEventBefore: 200,
      triggerLongPressEventAfter: 700,
    }),
    running: true,
  };

  constructor(props: GameEngineProps) {
    super(props);
    this.state = {
      entities: null,
    };
    this.timer = props.timer || new DefaultTimer();
    this.timer.subscribe(this.updateHandler);
    this.touches = [];
    this.screen = Dimensions.get("window");
    this.previousTime = null;
    this.previousDelta = null;
    this.events = [];
    this.touchProcessor = props.touchProcessor(this.touches);
    this.layout = null;
  }

  async componentDidMount() {
    let entities = getEntitiesFromProps(this.props);

    if (isPromise(entities)) {
      entities = await entities;
    }

    this.setState(
      {
        entities: entities || {},
      },
      () => {
        if (this.props.running) this.start();
      }
    );
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
    if (this.touchProcessor.end) {
      this.touchProcessor.end();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.running !== this.props.running) {
      if (nextProps.running) this.start();
      else this.stop();
    }
  }

  clear = () => {
    this.touches.length = 0;
    this.events.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
  };

  start = () => {
    this.clear();
    this.timer.start();
    this.dispatch({ type: "started" });
  };

  stop = () => {
    this.timer.stop();
    this.dispatch({ type: "stopped" });
  };

  swap = async (newEntities: Entities) => {
    if (isPromise(newEntities)) {
      newEntities = await newEntities;
    }

    this.setState({ entities: newEntities || {} }, () => {
      this.clear();
      this.dispatch({ type: "swapped" });
    });
  };

  publish = (e) => {
    // unused
    this.dispatch(e);
  };

  publishEvent = (e) => {
    // unused
    this.dispatch(e);
  };

  dispatch = (e: DispatchFunction) => {
    setTimeout(() => {
      this.events.push(e);
      if (this.props.onEvent) {
        this.props.onEvent(e);
      }
    }, 0);
  };

  dispatchEvent = (e) => {
    // unused
    this.dispatch(e);
  };

  updateHandler = (currentTime: number) => {
    const args = {
      touches: this.touches,
      screen: this.screen,
      layout: this.layout,
      events: this.events,
      dispatch: this.dispatch,
      time: {
        current: currentTime,
        previous: this.previousTime,
        delta: currentTime - (this.previousTime || currentTime),
        previousDelta: this.previousDelta,
      },
    };

    const newState = this.props.systems.reduce(
      (result, sys) => sys(result, args),
      this.state.entities
    );

    this.touches.length = 0;
    this.events.length = 0;
    this.previousTime = currentTime;
    this.previousDelta = args.time.delta;
    this.setState({ entities: newState });
  };

  onLayoutHandler = (e: LayoutChangeEvent) => {
    this.screen = Dimensions.get("window");
    this.layout = e.nativeEvent.layout;
    this.forceUpdate();
  };

  onTouchStartHandler = (e: GestureResponderEvent) => {
    this.touchProcessor.process("start", e.nativeEvent);
  };

  onTouchMoveHandler = (e: GestureResponderEvent) => {
    this.touchProcessor.process("move", e.nativeEvent);
  };

  onTouchEndHandler = (e: GestureResponderEvent) => {
    this.touchProcessor.process("end", e.nativeEvent);
  };

  render() {
    return (
      <View
        style={[css.container, this.props.style]}
        onLayout={this.onLayoutHandler}
      >
        <View
          style={css.entityContainer}
          onTouchStart={this.onTouchStartHandler}
          onTouchMove={this.onTouchMoveHandler}
          onTouchEnd={this.onTouchEndHandler}
        >
          {this.props.renderer(this.state.entities, this.screen, this.layout)}
        </View>

        <View pointerEvents={"box-none"} style={StyleSheet.absoluteFill}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

// GameEngine.

const css = StyleSheet.create({
  container: {
    flex: 1,
  },
  entityContainer: {
    flex: 1,
    //-- Looks like Android requires bg color here
    //-- to register touches. If we didn't worry about
    //-- 'children' (foreground) components capturing events,
    //-- this whole shenanigan could be avoided..
    backgroundColor: "transparent",
  },
});
