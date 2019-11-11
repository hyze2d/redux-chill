/**
 * Any function
 */
type Func<P extends any[] = any[]> = (...args: P) => any;

/**
 * Generic standart action
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

/**
 * Action creator with type
 */
type ActionCreator<P extends any[], R = any> = {
  type: string;
  (...args: P): Action<R>;
};

/**
 * Mapped params and RT to action creator field
 */
type ExtendedStages<N extends string, Params extends any[], R> = {
  [P in N]: ActionCreator<Params, R>;
};

/**
 * Stage function
 */
type Stage<C extends (...args) => any, S = {}> = {
  /**
   * Define root action creator payload processor
   */
  <CR extends (...args) => any>(create: CR): Result<CR, S> & S;
  /**
   * Define stage without params for payload
   */
  <N extends string>(name: N): Result<C, S & ExtendedStages<N, any[], null>> &
    S &
    ExtendedStages<N, any[], null>;
  /**
   * Define stage with params payload params processor
   */
  <PC extends (...args) => any, N extends string>(name: N, create: PC): Result<
    C,
    S & ExtendedStages<N, Parameters<PC>, ReturnType<PC>>
  > &
    S &
    ExtendedStages<N, Parameters<PC>, ReturnType<PC>>;
};

/**
 * Root action creator with extend stage function
 */
type Result<C extends (...args) => any, S = {}> = {
  /**
   * Function with params which creates action object
   */
  (...args: Parameters<C>): Action<ReturnType<C>>;
  /**
   * Action type
   */
  type: string;
  /**
   * Stage method which returns new instance with new defined stage
   */
  stage: Stage<C, S>;
};

/**
 * Make action creator with stage extending possibility
 */
type Make = <T = any>(name: string) => Result<(payload: T) => T>;

export { Make, Action, ActionCreator, Func };
