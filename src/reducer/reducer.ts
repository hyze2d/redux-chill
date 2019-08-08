import { produce, immerable } from "immer";
import { Reducer, Build, Params, On } from "./types";
import { Action, ActionCreator, make } from "../actions";
import { createStore, combineReducers } from "redux";

/**
 * Build reducere
 */
const build = <S, A extends Action>(params: Params<S>): Build<S, A> => () => {
  if (params.defaultState) {
    params.defaultState[immerable] = true;
  }

  return (state: S = params.defaultState, action: A) => {
    const match = params.handlers[action.type];

    if (match) {
      const result = produce(
        state,
        (draft: S) => void match.handle(draft, action.payload)
      );

      return result;
    }

    return state;
  };
};

/**
 * Define handler
 */
const on = <S, A extends Action>(params): On<S, A> => <
  H extends ActionCreator<any>
>(
  action: H,
  handle: (state: S, payload: ReturnType<H>["payload"]) => any
) => {
  params.handlers[action.type] = {
    action,
    handle
  };
  return {
    on: on<S, A | ReturnType<H>>(params),
    build: build<S, A | ReturnType<H>>(params)
  };
};

/**
 * Define reducer
 */
const reducer: Reducer = <S>(defaultState: S) => {
  const params: Params<S> = {
    defaultState,
    handlers: {}
  };

  return {
    on: on(params),
    build: build<S, any>(params)
  };
};

export { reducer };
