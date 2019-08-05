import { ActionCreator, Func } from "../actions";

/**
 * Extract payload from creator
 */
type Payload<T extends ActionCreator<any>> = ReturnType<T>["payload"];

/**
 * Builder params
 */
type Params<S> = {
  defaultState: S;
  handlers: {
    [x: string]: {
      action: ActionCreator<any>;
      handle: (state: S, payload) => any;
    };
  };
};
/**
 * Define handler
 */
type On<S, A> = <H extends ActionCreator<any>>(
  action: H,
  handle: (state: S, payload: Payload<H>) => any
) => Actions<S, A | ReturnType<H>>;

/**
 * Build reducer
 */
type Build<S, A> = () => (state: S, action: A) => S;

/**
 * Builder actions
 */
type Actions<S, A> = {
  on: On<S, A>;
  build: Build<S, A>;
};

/**
 * Define reducer
 */
type Reducer = <S>(defaultState?: S) => Actions<S, never>;

export { Reducer, Build, On, Params, Actions, Payload };
