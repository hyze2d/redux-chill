import {
  Make,
  Stage,
  Build,
  FuncMap,
  Func,
  ActionCreator,
  Params
} from "./types";

/**
 * Build creator
 */
const build = <S extends FuncMap>(params: Params<S>): Build<S> => <
  H extends Func = any
>(
  create: H
) => {
  type Result = ActionCreator<H> & { [P in keyof S]: ActionCreator<S[P]> };

  const result: Result = function(...args: Parameters<H>) {
    return {
      type: params.name,
      payload: create ? create(...args) : args[0]
    };
  } as Result;

  result.type = params.name;

  Object.entries(params.stages).map(([key, create]) => {
    const type = params.name + " " + key;
    const stage = function(...args) {
      return {
        type,
        payload: create ? create(...args) : args[0]
      };
    };

    stage.type = type;

    (result as any)[key] = stage;
  });

  return result;
};

/**
 * Define action stage
 */
const stage = <S extends FuncMap>(params: Params<S>): Stage<S> => <
  H extends Func = any,
  N extends string = any
>(
  name: N,
  create: H
) => {
  params.stages[name] = create as any;

  return {
    stage: stage<S>(params),
    build: build<S>(params)
  };
};

/**
 * Define action creator with stages
 */
const make: Make = (name: string) => {
  const params: Params<{}> = {
    name,
    stages: {},
    create: null
  };
  return {
    stage: stage<{}>(params),
    build: build<{}>(params)
  };
};

export { make };
