type Func = (...args) => any;

/**
 * Action creator function with action type
 */
type ActionCreator<C extends Func> = { type: string } & ((
  ...args: Parameters<C>
) => {
  type: string;
  payload: ReturnType<C>;
});

/**
 * Create action
 */
const make = <C extends Func, T>(
  type: string,
  create?: C,
  stages: T = {} as T
) => {
  /**
   * Initial action
   */
  const result = (...args: Parameters<C>) => {
    return {
      type,
      payload: create ? (create(...args) as ReturnType<C>) : null
    };
  };
  /**
   * Initial type
   */
  result.type = type;

  Object.keys(stages).map(key => {
    const subType = type + " " + key;
    result[key] = (...args) => ({
      type: subType,
      payload: stages[key](...args)
    });
    result[key].type = subType;
  });

  return result as Function &
    ActionCreator<C> &
    // @ts-ignore
    { [P in keyof T]: ActionCreator<T[P]> };
};

export { make };
