import React from "react";
import { LayoutRectangle } from "react-native";

import type { Entity, Entities, ScreenType } from "./types";

const isEntityRenderable = (entity: Entity) => !!entity.renderer;

const DefaultRenderer = (
  entities: Entities,
  screen: ScreenType,
  layout: LayoutRectangle
) => {
  if (!entities || !screen || !layout) {
    return null;
  }

  const entitiesToRender = Object.entries(entities)
    .filter(([_key, entity]) => isEntityRenderable(entity))
    .map(([key, entity]) => {
      if (typeof entity.renderer === "object") {
        return (
          <entity.renderer.type
            key={key}
            screen={screen}
            layout={layout}
            {...entity}
          />
        );
      }
      if (typeof entity.renderer === "function") {
        return (
          <entity.renderer
            key={key}
            screen={screen}
            layout={layout}
            {...entity}
          />
        );
      }
      return null;
    });

  return entitiesToRender;
};

export default DefaultRenderer;
