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

/**
 * Stages name list
 */
type StagesList<T extends any = any> = T[];

/**
 * Hash map of some values
 */
type HashMap<T> = {
  [x: string]: T;
};

type MakeResult<
  InitialCreator extends Func = any,
  StagesHashMap extends HashMap<Func> = any,
  NamedStages extends ReadonlyArray<string | number> = any[]
> = ActionCreator<InitialCreator> &
  { [P in keyof StagesHashMap]: ActionCreator<StagesHashMap[P]> } &
  { [K in NamedStages[number]]: ActionCreator<any> };

export { Func, HashMap, StagesList, Action, ActionCreator, MakeResult };
