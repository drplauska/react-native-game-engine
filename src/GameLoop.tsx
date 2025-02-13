import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  LayoutRectangle,
  LayoutChangeEvent,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from "react-native";
import type {
  DetailedTouchEvent,
  GameLoopOnUpdate,
  ScreenType,
  TouchProcessorFinalReturn,
} from "./types";
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

  static defaultProps = {
    touchProcessor: DefaultTouchProcessor({
      triggerPressEventBefore: 200,
      triggerLongPressEventAfter: 700,
    }),
    running: true,
  };

  constructor(props: GameLoopProps) {
    super(props);
    this.timer = props.timer || new DefaultTimer();
    this.timer.subscribe(this.updateHandler);
    this.touches = [];
    this.screen = Dimensions.get("window");
    this.previousTime = null;
    this.previousDelta = null;
    this.touchProcessor = props.touchProcessor(this.touches);
    this.layout = null;
  }

  componentDidMount() {
    if (this.props.running) this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
    if (this.touchProcessor.end) this.touchProcessor.end();
  }

  UNSAFE_componentWillReceiveProps(nextProps: GameLoopProps) {
    if (nextProps.running !== this.props.running) {
      if (nextProps.running) this.start();
      else this.stop();
    }
  }

  start = () => {
    this.touches.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
    this.timer.start();
  };

  stop = () => {
    this.timer.stop();
  };

  updateHandler = (currentTime: number) => {
    const args = {
      touches: this.touches,
      screen: this.screen,
      layout: this.layout,
      time: {
        current: currentTime,
        previous: this.previousTime,
        delta: currentTime - (this.previousTime || currentTime),
        previousDelta: this.previousDelta,
      },
    };

    if (this.props.onUpdate) {
      this.props.onUpdate(args);
    }

    this.touches.length = 0;
    this.previousTime = currentTime;
    this.previousDelta = args.time.delta;
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
        onTouchStart={this.onTouchStartHandler}
        onTouchMove={this.onTouchMoveHandler}
        onTouchEnd={this.onTouchEndHandler}
      >
        {this.props.children}
      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
  },
});
