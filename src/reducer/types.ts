import { ActionCreator, Func, make, Action } from "../actions";

/**
 * Extract payload from creator
 */
type Payload<T extends ActionCreator<any>> = ReturnType<T>["payload"];

type MixedTypesList = any;
type TypesList = any;
type StringList = any;
type SingleStringType = any;
type SingleType = any;

/**
 * Handle paload method with options to handle single or multiple actions
 */
type HandlePayload<T> = T extends ActionCreator<any, any>
  ? Payload<T>
  : T extends string
  ? unknown
  : T extends string[]
  ? unknown
  : T extends ReadonlyArray<ActionCreator>
  ? Payload<T[number]>
  : unknown;

/**
 * Reducer with .on method which provides new instance with added handler
 */
type ExtendableReducer<S, A = any> = {
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
    handle: (state: S, payload: HandlePayload<T>) => any
  ) => ExtendableReducer<S, A>;
};

/**
 * Reducer function for extendable reducer generation
 */
type Reducer = {
  <S>(defaultState: S): ExtendableReducer<S>;
};

export { Reducer, Payload };
