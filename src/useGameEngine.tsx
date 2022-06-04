import React, { Component, useCallback, useEffect, useState } from "react";
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

interface PropsForEntities {
  initState?: any;
  initialState?: any;
  state?: any;
  initEntities?: any;
  initialEntities?: any;
  entities?: any;
}

const getEntitiesFromProps = (props: PropsForEntities): Entities =>
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
  systems: ((
    entities: Entities,
    { touches, time }: { touches: NativeTouchEvent[]; time: TimeUpdate }
  ) => Entities)[];
  entities?: Entities | Promise<Entities>;
  renderer?: Renderer;
  touchProcessor: ReturnType<typeof DefaultTouchProcessor>;
  timer?: DefaultTimer;
  running?: boolean;
  onEvent?: ({ type }: DispatchFunction) => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

let screenSize = Dimensions.get("window");

const useGameEngine = (props: GameEngineProps) => {
  const {
    systems = [],
    touchProcessor = DefaultTouchProcessor({
      triggerPressEventBefore: 200,
      triggerLongPressEventAfter: 700,
    }),
    entities = {},
    onEvent,
    renderer = DefaultRenderer,
    running = true,
    style,
    timer = new DefaultTimer(),
  } = props;
  const [touches, setTouches] = useState<NativeTouchEvent[]>([]);
  const [previousTime, setPreviousTime] = useState<number | null>(null);
  const [previousDelta, setPreviousDelta] = useState<number | null>(null);
  const [events, setEvents] = useState<DispatchFunction[]>([]);
  const [currentTouchProcessor, setCurrentTouchProcessor] = useState(
    touchProcessor(touches)
  );
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const [currentEntities, setCurrentEntities] = useState<Entities>();

  useEffect(() => {
    timer.subscribe(updateHandler);
    let entitiesFromProps = getEntitiesFromProps(props);

    if (isPromise(entitiesFromProps)) {
      (async () => {
        entitiesFromProps = await entities;
      })();
    }
    setCurrentEntities(entitiesFromProps);
    if (running) {
      start();
    }
  }, []);

  useEffect(() => {
    return () => {
      stop();
      timer.unsubscribe(updateHandler);
      if (currentTouchProcessor.end) {
        currentTouchProcessor.end();
      }
    };
  }, []);

  useEffect(() => {
    if (running) {
      return start();
    }
    return stop();
  }, [running]);

  const clear = () => {
    setTouches([]);
    setEvents([]);
    setPreviousTime(null);
    setPreviousDelta(null);
  };

  const start = () => {
    clear();
    timer.start();
    dispatch({ type: "started" });
  };

  const stop = () => {
    timer.stop();
    dispatch({ type: "stopped" });
  };

  const swap = async (newEntities: Entities) => {
    let awaitedEntities = newEntities;
    if (isPromise(newEntities)) {
      awaitedEntities = await newEntities;
    }

    setCurrentEntities(awaitedEntities);
    clear();
    dispatch({ type: "swapped" });
  };

  const dispatch = (e: DispatchFunction) => {
    setTimeout(() => {
      setEvents((currentEvents) => [...currentEvents, e]);
      if (onEvent) {
        onEvent(e);
      }
    }, 0);
  };

  const updateHandler = useCallback(
    (currentTime: number) => {
      if (!currentEntities) {
        return;
      }
      const args = {
        touches,
        screen: screenSize,
        layout,
        events,
        dispatch,
        time: {
          current: currentTime,
          previous: previousTime,
          delta: currentTime - (previousTime || currentTime),
          previousDelta: previousDelta,
        },
      };

      const newEntities = systems.reduce(
        (result, sys) => sys(result, args),
        currentEntities
      );

      setTouches([]);
      setEvents([]);
      setPreviousTime(currentTime);
      setPreviousDelta(args.time.delta);
      setCurrentEntities(newEntities);
    },
    [currentEntities, touches, screenSize, layout, events, dispatch]
  );

  useEffect(() => {
    timer.unsubscribe(updateHandler);
    timer.subscribe(updateHandler);
  }, [updateHandler]);

  const onLayoutHandler = (e: LayoutChangeEvent) => {
    screenSize = Dimensions.get("window");
    setLayout(e.nativeEvent.layout);
    // forceUpdate();
  };

  const onTouchStartHandler = (e: GestureResponderEvent) => {
    currentTouchProcessor.process("start", e.nativeEvent);
  };

  const onTouchMoveHandler = (e: GestureResponderEvent) => {
    currentTouchProcessor.process("move", e.nativeEvent);
  };

  const onTouchEndHandler = (e: GestureResponderEvent) => {
    currentTouchProcessor.process("end", e.nativeEvent);
  };

  if (!currentEntities) {
    return null;
  }

  return {
    commands: { start, stop },
    Engine: (
      <View style={[css.container, style]} onLayout={onLayoutHandler}>
        <View
          style={css.entityContainer}
          onTouchStart={onTouchStartHandler}
          onTouchMove={onTouchMoveHandler}
          onTouchEnd={onTouchEndHandler}
        >
          {!!layout && renderer(currentEntities, screenSize, layout)}
        </View>

        {/* <View pointerEvents={"box-none"} style={StyleSheet.absoluteFill}>
          {children}
        </View> */}
      </View>
    ),
  };
};

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

export default useGameEngine;
