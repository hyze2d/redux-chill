// /**
//  * Object with fields typed by passed type
//  */
// type HashMap<T> = { [x: string]: T };
// /**
//  * Simple function
//  */
// type Func<P extends any[] = any[]> = (...args: P) => any;
// /**
//  * Function hash map
//  */
// type FuncMap = HashMap<Func>;
// /**
//  * Redux action
//  */
// type Action<P = any> = {
//   /**
//    * Action type
//    */
//   type: string;
//   /**
//    * Action payload
//    */
//   payload: P;
// };

// type WithType = {
//   /**
//    * Action type
//    */
//   type: string;
// };

// /**
//  * Action creator with type
//  */
// type ActionCreator<PC extends Func> = ((
//   ...args: Parameters<PC>
// ) => Action<ReturnType<PC>>) &
//   WithType;

// /**
//  * Builder params
//  */
// type Params<S, C extends Func = any> = {
//   name: string;
//   stages: S;
//   create: ActionCreator<C>;
// };
// /**
//  * Define stage
//  */
// type Stage<S> = <H extends Func = any, N extends string = any>(
//   name: N,
//   handler?: H
// ) => Actions<S & { [P in N]: H }>;

// /**
//  * Build action creators
//  */
// type Build<S extends FuncMap> = <H extends Func = any>(
//   handler?: H
// ) => ActionCreator<H> & { [P in keyof S]: ActionCreator<S[P]> };

// /**
//  * Builder actions
//  */
// type Actions<S extends FuncMap> = {
//   stage: Stage<S>;
//   build: Build<S>;
// };

// /**
//  * Action creator maker
//  */
// type Make = (name: string) => Actions<{}>;

type ActionCreator<P extends any[], R = any> = {
  type: string;
  (...args: P): {
    type: string;
    payload: R;
  };
};

type SingleArgActionCreator<P = any, R = any> = {
  type: string;
  (payload?: P): {
    type: string;
    payload: R;
  };
};

interface Stage<C extends (...args) => any, S = {}> {
  <CR extends (...args) => any>(create: CR): Result<CR, S> & S;
  <N extends string>(name: N): Result<
    C,
    S &
      {
        [P in N]: SingleArgActionCreator<any, any>;
      }
  > &
    S &
    {
      [P in N]: SingleArgActionCreator<any, any>;
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
    payload?: ReturnType<C>;
  };
  stage: Stage<C, S>;
}

type Make = <T = any>(name: string) => Result<(payload: T) => T>;

let make: Make;

make("dsa").stage((id: number) => id)(123).payload;

export // Make,
// ActionCreator,
// Action,
// HashMap,
// Func,
// Build,
// Stage,
// FuncMap,
// Params
{};

const getSomething = make("[some] action name")
  .stage((something: string) => something)
  .stage("success", (data: any[]) => data)
  .stage("failure");

getSomething.type; // [some] action name
getSomething("somethingargument"); // {payload: string; type: string}
getSomething.success.type; // [some] action name success
getSomething.success([]); // {type: string; payload: any[]}
getSomething.failure.type; // [some] action name failure
getSomething.failure()
