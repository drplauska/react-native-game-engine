import GameLoop from "./GameLoop";
import GameEngine from "./GameEngine";
import GameEngineHook from "./GameEngineHook";
import useGameEngine from "./useGameEngine";
import DefaultTouchProcessor from "./DefaultTouchProcessor";
import DefaultRenderer from "./DefaultRenderer";
import DefaultTimer from "./DefaultTimer";

export {
  GameLoop,
  GameLoop as BasicGameLoop,
  GameEngineHook as GameEngine,
  // GameEngine,
  useGameEngine,
  GameEngine as ComponentEntitySystem,
  GameEngine as ComponentEntitySystems,
  DefaultTouchProcessor,
  DefaultRenderer,
  DefaultTimer,
};
