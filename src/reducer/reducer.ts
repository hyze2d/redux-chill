import { produce, immerable } from "immer";
import { CreateReducer } from "./types";

/**
 * Create reducer with add handler .on method
 */
const createReducer = (defaultState, handlers = []) => {
  /**
   * Reducer which will handle actions via handlers list
   */
  const result = (state = defaultState, action) => {
    const match = handlers.filter(one =>
      one.types.some(actionType => {
        if (typeof actionType == "string") {
          return action.type == actionType;
        }

        if ("type" in actionType) {
          return action.type == actionType.type;
        }
      })
    );

    if (!match || !match.length) return state;

    return produce(state, draft => {
      match.map(item => {
        item.handle(draft, action.payload);
      });
    });
  };

  /**
   * Define new handler
   */
  result.on = (actions, handle) =>
    createReducer(defaultState, [
      ...handlers,
      {
        types: Array.isArray(actions) ? actions : [actions],
        handle
      }
    ]);

  return result;
};

/**
 * Create reducer with default state
 */
const reducer: CreateReducer = <S>(defaultState: S) => {
  /**
   * Required to make class instances immutable when processing with immer
   */
  defaultState[immerable] = true;

  return createReducer(defaultState);
};

export { reducer };
