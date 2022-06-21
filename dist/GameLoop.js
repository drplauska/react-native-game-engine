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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const DefaultTimer_1 = __importDefault(require("./DefaultTimer"));
const DefaultTouchProcessor_1 = __importDefault(require("./DefaultTouchProcessor"));
class GameLoop extends react_1.Component {
    constructor(props) {
        super(props);
        this.start = () => {
            this.touches.length = 0;
            this.previousTime = null;
            this.previousDelta = null;
            this.timer.start();
        };
        this.stop = () => {
            this.timer.stop();
        };
        this.updateHandler = (currentTime) => {
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
        this.timer = props.timer || new DefaultTimer_1.default();
        this.timer.subscribe(this.updateHandler);
        this.touches = [];
        this.screen = react_native_1.Dimensions.get("window");
        this.previousTime = null;
        this.previousDelta = null;
        this.touchProcessor = props.touchProcessor(this.touches);
        this.layout = null;
    }
    componentDidMount() {
        if (this.props.running)
            this.start();
    }
    componentWillUnmount() {
        this.stop();
        this.timer.unsubscribe(this.updateHandler);
        if (this.touchProcessor.end)
            this.touchProcessor.end();
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.running !== this.props.running) {
            if (nextProps.running)
                this.start();
            else
                this.stop();
        }
    }
    render() {
        return (<react_native_1.View style={[css.container, this.props.style]} onLayout={this.onLayoutHandler} onTouchStart={this.onTouchStartHandler} onTouchMove={this.onTouchMoveHandler} onTouchEnd={this.onTouchEndHandler}>
        {this.props.children}
      </react_native_1.View>);
    }
}
exports.default = GameLoop;
GameLoop.defaultProps = {
    touchProcessor: (0, DefaultTouchProcessor_1.default)({
        triggerPressEventBefore: 200,
        triggerLongPressEventAfter: 700,
    }),
    running: true,
};
const css = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
});
