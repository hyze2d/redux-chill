/**
 * Any function
 */
type Func = (...args) => any;

/**
 * Action type
 */
type Action<P = any> = {
  type: string;
  payload?: P;
};

/**
 * Action creator function with action type
 */
type ActionCreator<C extends Func> = { type: string } & ((
  ...args: Parameters<C>
) => Action<ReturnType<C>>);
type Equals<A, B, T, F> = A extends B ? (B extends A ? T : F) : F;

/**
 * Stages name list
 */
type StagesList = ReadonlyArray<string | number>;

/**
 * Hash map of some values
 */
type HashMap<T> = {
  [x: string]: T;
};

type MakeResult<
  InitialCreator extends Func = any,
  StagesHashMap extends HashMap<Func> = any,
  Stages extends ReadonlyArray<string | number> = any[]
> = ActionCreator<InitialCreator> &
  { [P in keyof StagesHashMap]: ActionCreator<StagesHashMap[P]> } &
  { [K in Stages[number]]: ActionCreator<any> };

export { Func, HashMap, StagesList, Action, ActionCreator, MakeResult };
