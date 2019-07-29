type PayloadCreator<T = any, P extends any[] = any> = (...args: P) => T;
type StagesList = string[];
type Stages = {
  [x: string]: PayloadCreator;
};

type Action<P = any> = {
  type: string;
  payload?: P;
};
type ActionCreator<PC extends PayloadCreator> = ((
  ...args: Parameters<PC>
) => Action<ReturnType<PC>>) & {
  type: string;
};

type PayloadCreatorMap = {
  [x: string]: PayloadCreator;
};

type MakeResult<
  PC extends PayloadCreator = any,
  S extends PayloadCreatorMap = any,
  SL = any
> = ActionCreator<PC> & { [P in keyof S]: ActionCreator<ReturnType<S[P]>> };

/**
 * Get stages object from args
 */
const getStages = (...args: (Stages | PayloadCreator | StagesList)[]) => {
  return args.find(item => typeof item == "object" && !Array.isArray(item));
};

/**
 * Get stages names list from args
 */
const getStagesList = (...args: (Stages | PayloadCreator | StagesList)[]) =>
  args.find(Array.isArray);

function make(name: string): MakeResult;
function make<P>(
  name: string,
  initial: PayloadCreator<P>
): MakeResult<typeof initial>;
function make<S extends Stages>(name: string, stages: S): MakeResult<any, S>;
function make<SL extends StagesList>(
  name: string,
  stages: SL
): MakeResult<any, any, SL>;
function make<P, S extends Stages>(
  name: string,
  initial: PayloadCreator<P>,
  stages: Stages
): MakeResult<PayloadCreator<P>, S>;
function make<P, SL extends StagesList>(
  name: string,
  initial: PayloadCreator,
  stages: SL
): MakeResult<PayloadCreator<P>, any, SL>;
function make<P, S extends Stages, SL extends StagesList>(
  name: string,
  initial: PayloadCreator<P>,
  stages: S,
  stagesList: SL
): MakeResult<PayloadCreator<P>, S, SL>;
function make<S extends Stages>(name: string, stages: S): MakeResult<any, S>;
function make<SL extends StagesList>(
  name: string,
  stagesList: SL
): MakeResult<any, any, SL>;
function make<S extends Stages, SL extends StagesList>(
  name: string,
  stages: S,
  stagesList: SL
): MakeResult<any, S, SL>;

function make(
  name: string,
  second?: PayloadCreator | StagesList | Stages,
  third?: StagesList | Stages,
  fourth?: StagesList
) {
  const createPayload = typeof second == "function" && second;
  const stages = getStages(second, third, fourth);
  const stagesList = getStagesList(second, third, fourth);

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

const dsad = make("dsad", (kek: number) => kek);
