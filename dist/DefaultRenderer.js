"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const isEntityRenderable = (entity) => !!entity.renderer;
exports.default = (entities, screen, layout) => {
    if (!entities || !screen || !layout) {
        return null;
    }
    const entitiesToRender = Object.entries(entities)
        .filter(([_key, entity]) => isEntityRenderable(entity))
        .map(([key, entity]) => {
        if (typeof entity.renderer === "object") {
            return (<entity.renderer.type key={key} screen={screen} layout={layout} {...entity}/>);
        }
        if (typeof entity.renderer === "function") {
            return (<entity.renderer key={key} screen={screen} layout={layout} {...entity}/>);
        }
        return null;
    });
    return entitiesToRender;
};
