import { Make } from "./types";

/**
 * Define action stage
 */
const stage = (
  result,
  stages,
  createRootPayload = (...args: any[]) => null
) => (...args) => {
  if (args.length == 1) {
    const [arg] = args;

    if (typeof arg == "function") {
      const create = (...payload) => ({
        type: result.type,
        payload: arg(...payload)
      });

      create["type"] = result.type;
      create["stage"] = stage(create, { ...stages }, arg);

      Object.entries(stages).map(([key, value]) => {
        create[key] = value;
      });

      return create;
    }

    if (typeof arg == "string") {
      const type = result.type + " " + arg;
      const _stages = {
        ...stages
      };
      const create = (...payload) => ({
        type: result.type,
        payload: createRootPayload(...payload)
      });

      create["type"] = result.type;

      _stages[arg] = create[arg] = payload => ({
        type,
        payload
      });
      _stages[arg].type = create[arg].type = type;

      create["stage"] = stage(create, _stages, createRootPayload);

      Object.entries(_stages).map(([key, value]) => {
        create[key] = value;
      });

      return create;
    }
  }

  if (args.length == 2) {
    const [name, createPayload] = args;
    const _stages = {
      ...stages
    };
    const type = result.type + " " + name;
    const create = (...payload) => {
      return {
        type: result.type,
        payload: createRootPayload(...payload)
      };
    };
    create["type"] = result.type;
    _stages[name] = create[name] = (...payload) => ({
      type,
      payload: createPayload(...payload)
    });

    _stages[name].type = create[name].type = type;

    create["stage"] = stage(create, _stages, createRootPayload);

    Object.entries(_stages).map(([key, value]) => {
      create[key] = value;
    });

    return create;
  }
};

const make: Make = (name: string) => {
  const result = payload => ({
    type: name,
    payload
  });
  result.type = name;
  result.stage = stage(result, {});

  return result as any;
};

export { make };
