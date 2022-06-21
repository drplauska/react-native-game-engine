"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const DefaultTimer_1 = __importDefault(require("./DefaultTimer"));
const DefaultRenderer_1 = __importDefault(require("./DefaultRenderer"));
const DefaultTouchProcessor_1 = __importDefault(require("./DefaultTouchProcessor"));
const getEntitiesFromProps = (props // TODO: this function may need some decisions whether to leave it with some many options
) => props.initState ||
    props.initialState ||
    props.state ||
    props.initEntities ||
    props.initialEntities ||
    props.entities;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPromise = (obj) => {
    return !!(obj &&
        obj.then &&
        obj.then.constructor &&
        obj.then.call &&
        obj.then.apply);
};
class GameEngine extends react_1.Component {
    constructor(props) {
        super(props);
        this.clear = () => {
            this.touches.length = 0;
            this.events.length = 0;
            this.previousTime = null;
            this.previousDelta = null;
        };
        this.start = () => {
            this.clear();
            this.timer.start();
            this.dispatch({ type: "started" });
        };
        this.stop = () => {
            this.timer.stop();
            this.dispatch({ type: "stopped" });
        };
        this.swap = (newEntities) => __awaiter(this, void 0, void 0, function* () {
            if (isPromise(newEntities)) {
                newEntities = yield newEntities;
            }
            this.setState({ entities: newEntities || {} }, () => {
                this.clear();
                this.dispatch({ type: "swapped" });
            });
        });
        // publish = (e) => {
        //   // unused
        //   this.dispatch(e);
        // };
        // publishEvent = (e) => {
        //   // unused
        //   this.dispatch(e);
        // };
        this.dispatch = (e) => {
            setTimeout(() => {
                this.events.push(e);
                if (this.props.onEvent) {
                    this.props.onEvent(e);
                }
            }, 0);
        };
        // dispatchEvent = (e) => {
        //   // unused
        //   this.dispatch(e);
        // };
        this.updateHandler = (currentTime) => {
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
            const newState = this.props.systems.reduce((result, sys) => sys(result, args), this.state.entities);
            this.touches.length = 0;
            this.events.length = 0;
            this.previousTime = currentTime;
            this.previousDelta = args.time.delta;
            this.setState({ entities: newState });
        };
        this.onLayoutHandler = (e) => {
            this.screen = react_native_1.Dimensions.get("window");
            this.layout = e.nativeEvent.layout;
            this.forceUpdate();
        };
        this.onTouchStartHandler = (e) => {
            this.touchProcessor.process("start", e.nativeEvent);
        };
        this.onTouchMoveHandler = (e) => {
            this.touchProcessor.process("move", e.nativeEvent);
        };
        this.onTouchEndHandler = (e) => {
            this.touchProcessor.process("end", e.nativeEvent);
        };
        this.state = {
            entities: null,
        };
        this.timer = props.timer || new DefaultTimer_1.default();
        this.timer.subscribe(this.updateHandler);
        this.touches = [];
        this.screen = react_native_1.Dimensions.get("window");
        this.previousTime = null;
        this.previousDelta = null;
        this.events = [];
        this.touchProcessor = props.touchProcessor(this.touches);
        this.layout = null;
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            let entities = getEntitiesFromProps(this.props);
            if (isPromise(entities)) {
                entities = yield entities;
            }
            this.setState({
                entities: entities || {},
            }, () => {
                if (this.props.running)
                    this.start();
            });
        });
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
            if (nextProps.running) {
                this.start();
            }
            else {
                this.stop();
            }
        }
    }
    render() {
        return (<react_native_1.View style={[css.container, this.props.style]} onLayout={this.onLayoutHandler}>
        <react_native_1.View style={css.entityContainer} onTouchStart={this.onTouchStartHandler} onTouchMove={this.onTouchMoveHandler} onTouchEnd={this.onTouchEndHandler}>
          {!!this.props.renderer &&
                this.state.entities &&
                this.layout &&
                this.props.renderer(this.state.entities, this.screen, this.layout)}
        </react_native_1.View>

        <react_native_1.View pointerEvents={"box-none"} style={react_native_1.StyleSheet.absoluteFill}>
          {this.props.children}
        </react_native_1.View>
      </react_native_1.View>);
    }
}
exports.default = GameEngine;
GameEngine.defaultProps = {
    systems: [],
    entities: {},
    renderer: DefaultRenderer_1.default,
    touchProcessor: (0, DefaultTouchProcessor_1.default)({
        triggerPressEventBefore: 200,
        triggerLongPressEventAfter: 700,
    }),
    running: true,
};
// GameEngine.
const css = react_native_1.StyleSheet.create({
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
