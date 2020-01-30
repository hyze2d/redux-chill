import { Make } from "./types";

/**
 * Rebuild root
 */
function rebuild(cp: (...args) => any, type: string, stages) {
  const result = (...payload) => ({
    type,
    payload: cp(...payload)
  });

  result.type = type;
  result.stage = stage(result, stages, cp);

  Object.entries(stages).map(([key, value]) => {
    result[key] = value;
    result[key].type = type + " " + key;
  });

  return result;
}

/**
 * Define action stage
 */
function stage(result, stages, createRootPayload = (...args: any[]) => null) {
  return (...args) => {
    if (args.length == 1) {
      const [arg] = args;

      if (typeof arg == "function") {
        return rebuild(arg, result.type, stages);
      }


      if (typeof arg == "string") {
        return rebuild(createRootPayload, result.type, {
          ...stages,
          [arg]: () => ({
            type: result.type + " " + arg
          })
        });
      }
    }

    if (args.length == 2) {
      const [name, createPayload] = args;

      return rebuild(createRootPayload, result.type, {
        ...stages,
        [name]: (...payload) => ({
          type: result.type + " " + name,
          payload: createPayload(...payload)
        })
      });
    }
  };
}

/**
 * Make action creator with stage extending possibility
 */
const make: Make = (name: string) => rebuild(() => null, name, {}) as any;

export { make };

