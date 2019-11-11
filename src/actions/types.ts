type Func<P extends any[] = any[]> = (...args: P) => any;
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

type ActionCreator<P extends any[], R = any> = {
  type: string;
  (...args: P): Action<R>;
};


interface Stage<C extends (...args) => any, S = {}> {
  <CR extends (...args) => any>(create: CR): Result<CR, S> & S;
  <N extends string>(name: N): Result<
    C,
    S &
      {
        [P in N]: ActionCreator<any[], null>;
      }
  > &
    S &
    {
      [P in N]: ActionCreator<any[], null>;
    };
  <PC extends (...args) => any, N extends string>(name: N, create: PC): Result<
    C,
    S &
      {
        [P in N]: ActionCreator<Parameters<PC>, ReturnType<PC>>;
      }
  > &
    S &
    {
      [P in N]: ActionCreator<Parameters<PC>, ReturnType<PC>>;
    };
}

interface Result<C extends (...args) => any, S = {}> {
  type: string;
  (...args: Parameters<C>): {
    type: string;
    payload: ReturnType<C>;
  };
  stage: Stage<C, S>;
}

type Make = <T = any>(name: string) => Result<(payload: T) => T>;

export { Make, Action, ActionCreator, Func };
