/**
 * Object with fields typed by passed type
 */
type HashMap<T> = { [x: string]: T };
/**
 * Simple function
 */
type Func<P extends any[] = any[]> = (...args: P) => any;
/**
 * Function hash map
 */
type FuncMap = HashMap<Func>;
/**
 * Redux action
 */
type Action<P = any> = {
  /**
   * Action type
   */
  type: string;
  /**
   * Action payload
   */
  payload: P;
};

type WithType = {
  /**
   * Action type
   */
  type: string;
};

/**
 * Action creator with type
 */
type ActionCreator<PC extends Func> = ((
  ...args: Parameters<PC>
) => Action<ReturnType<PC>>) &
  WithType;

/**
 * Builder params
 */
type Params<S, C extends Func = any> = {
  name: string;
  stages: S;
  create: ActionCreator<C>;
};
/**
 * Define stage
 */
type Stage<S> = <H extends Func = any, N extends string = any>(
  name: N,
  handler?: H
) => Actions<S & { [P in N]: H }>;

/**
 * Build action creators
 */
type Build<S extends FuncMap> = <H extends Func = any>(
  handler?: H
) => ActionCreator<H> & { [P in keyof S]: ActionCreator<S[P]> };

/**
 * Builder actions
 */
type Actions<S extends FuncMap> = {
  stage: Stage<S>;
  build: Build<S>;
};

/**
 * Action creator maker
 */
type Make = (name: string) => Actions<{}>;

export {
  Make,
  ActionCreator,
  Action,
  HashMap,
  Func,
  Build,
  Stage,
  FuncMap,
  Params
};
