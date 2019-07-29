import { produce, PatchListener } from "immer";

/**
 * Action type
 */
type ActionLike<T> = { type: string | number } & T;
/**
 * Simple function for extend
 */
type ActionCreator<T extends (...args) => any> = (
  ...args: any[]
) => ActionLike<ReturnType<T>>;
/**
 * With action type
 */
type WithActionType<T> = T & { type: string };

/**
 * Get user creation operators
 */
const create = <S>(defaultState: S, onPatch?: PatchListener) => {
  /**
   * Define action handler
   */
  const on = <T extends ActionCreator<any>>(
    creator: WithActionType<T> & ActionCreator<T>,
    execute: (state: S, action: ReturnType<T>) => any
  ) => {
    const result = ((...args) => (execute as any)(...args)) as WithActionType<
      typeof execute
    >;

    result.type = creator.type;

    return result;
  };

  /**
   * Bootstrap reducer
   */
  const bootstrap = <A extends { type: string }>(
    ...handlers: ReturnType<typeof on>[]
  ) => (state: S = JSON.parse(JSON.stringify(defaultState)), action: A) =>
    produce(
      state,
      draft => {
        handlers.map((handler: WithActionType<(...args: any) => any>) => {
          if (handler.type == action.type) {
            handler(draft, action);
          }
        });
      },
      onPatch
    );

  return {
    on,
    bootstrap
  };
};

/**
 * Write to source object fields from second
 * Note: explict write without assign to use it with proxy
 */
const writeTo = <P>(source: P, payload: Partial<P>) => {
  Object.keys(payload).map(key => (source[key] = payload[key]));
};

export { create, writeTo };
