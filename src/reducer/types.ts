import { ActionCreator, Func, make } from "../actions";

/**
 * Extract payload from creator
 */
type Payload<T extends ActionCreator<any>> = ReturnType<T>["payload"];

type HandlePayload<T> = T extends ActionCreator<any, any>
  ? Payload<T>
  : T extends ReadonlyArray<ActionCreator<any, any>>
  ? Payload<T[number]>
  : any;

type ExtendableReducer<S, A = any> = {
  (state: S, action: A): S;

  on: <
    T extends ActionCreator<any, any> | ReadonlyArray<ActionCreator<any, any>>
  >(
    types: T,
    handle: (state: S, payload: HandlePayload<T>) => any
  ) => ExtendableReducer<S, A>;
};

type Reducer = {
  <S>(defaultState: S): ExtendableReducer<S>;
};

export { Reducer, Payload };
