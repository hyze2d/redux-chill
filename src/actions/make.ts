import { HashMap, Func, StagesList, MakeResult, ActionCreator } from "./types";

/**
 * Stages map
 */
type Stages = HashMap<Func>;
/**
 * 2-4 params
 */
type OptionalParams = Stages | Func | StagesList;

/**
 * Get stages object from args
 */
const getStages = (...args: (OptionalParams)[]) => {
  return args.find(item => typeof item == "object" && !Array.isArray(item));
};

/**
 * Get stages names list from args
 */
const getStagesList = (...args: (OptionalParams)[]) => args.find(Array.isArray);

type StageNames = ReadonlyArray<string | number>;

function make(name: string): MakeResult;
function make<P extends Func>(name: string, initial: P): MakeResult<P>;
function make<S extends Stages>(name: string, stages: S): MakeResult<any, S>;
function make<SL extends StageNames>(
  name: string,
  ...args: SL
): MakeResult<any, any, SL>;
function make<P extends Func, S extends Stages>(
  name: string,
  initial: P,
  stages: S
): MakeResult<P, S>;
function make<P extends Func, SL extends StageNames>(
  name: string,
  initial: P,
  ...args: SL
): MakeResult<P, any, SL>;
function make<P extends Func, S extends Stages, SL extends StageNames>(
  name: string,
  initial: P,
  stages: S,
  ...args: SL
): MakeResult<P, S, SL>;
function make<S extends Stages>(name: string, stages: S): MakeResult<any, S>;
function make<SL extends StageNames>(
  name: string,
  ...args: SL
): MakeResult<any, any, SL>;
function make<S extends Stages, SL extends StageNames>(
  name: string,
  stages: S,
  ...args: SL
): MakeResult<any, S, SL>;
function make(
  name: string,
  second?: Func | StagesList | Stages,
  third?: StagesList | Stages,
  ...args: StageNames
) {
  const createPayload = typeof second == "function" && second;
  const stages = getStages(second, third, args);
  const stagesList = getStagesList(second, third, args);
  const create = function(...args) {
    return {
      type: name,
      payload: createPayload ? createPayload(...args) : null
    };
  };

  create.type = name;

  if (stages) {
    Object.values(stages).map(([value, key]) => {
      const type = name + " " + key;
      const creator = function(...args) {
        return {
          type,
          payload: value(...args)
        };
      };
      creator.type = type;

      create[name + key] = creator;
    });
  }

  if (stagesList) {
    stagesList.map(item => {
      const type = name + " " + item;
      const creator = function(...args) {
        return {
          type
        };
      };
      creator.type = type;

      create[name + item] = creator;
    });
  }

  return create as any;
}

const kek = make("kek", "ch", "ll");
