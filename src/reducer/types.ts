import { ActionCreator, Func, make, Action } from "../actions";

/**
 * Extract payload from creator
 */
type Payload<T extends ActionCreator<any>> = ReturnType<T>["payload"];

/**
 * Handle paload method with options to handle single or multiple actions
 */
type HandleAction<T> = T extends ActionCreator<any, any>
  ? Action<Payload<T>>
  : T extends string
  ? Action<unknown>
  : T extends string[]
  ? Action<unknown>
  : T extends ReadonlyArray<ActionCreator>
  ? Action<Payload<T[number]>>
  : Action<unknown>;

/**
 * Reducer with .on method which provides new instance with added handler
 */
type ExtendableReducer<S, A> = {
  /**
   * Simple reducer which accepts state and actions and return (not)updated state
   */
  (state: S, action: A): S;
  /**
   * Add new handler and returns new reducer with defined handler
   */
  on: <
    T extends
      | ActionCreator
      | ReadonlyArray<ActionCreator>
      | ReadonlyArray<ActionCreator | string>
      | string
      | string[]
  >(
    type: T,
    handle: (state: S, payload: HandleAction<T>["payload"]) => any
  ) => ExtendableReducer<S, A | HandleAction<T>>;
};

/**
 * Reducer function for extendable reducer generation
 */
type CreateReducer = {
  <S>(defaultState: S): ExtendableReducer<S, { type: string }>;
};

export { CreateReducer, Payload };
