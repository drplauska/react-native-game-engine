"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTimer = exports.DefaultRenderer = exports.DefaultTouchProcessor = exports.GameEngine = exports.GameLoop = void 0;
const GameLoop_1 = __importDefault(require("./GameLoop"));
exports.GameLoop = GameLoop_1.default;
const GameEngine_1 = __importDefault(require("./GameEngine"));
exports.GameEngine = GameEngine_1.default;
const DefaultTouchProcessor_1 = __importDefault(require("./DefaultTouchProcessor"));
exports.DefaultTouchProcessor = DefaultTouchProcessor_1.default;
const DefaultRenderer_1 = __importDefault(require("./DefaultRenderer"));
exports.DefaultRenderer = DefaultRenderer_1.default;
const DefaultTimer_1 = __importDefault(require("./DefaultTimer"));
exports.DefaultTimer = DefaultTimer_1.default;
