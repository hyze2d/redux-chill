const stage = (result, stages) => (...args) => {
  if (args.length == 1) {
    const [arg] = args;

    if (typeof arg == "function") {
      const create = (...payload) => ({
        type: result.type,
        payload: arg(...payload)
      });

      create["type"] = result.type;
      create["stage"] = stage(create, stages);

      Object.values(stages).map(([key, value]) => {
        create[key] = value;
      });

      return create;
    }

    if (typeof arg == "string") {
      stages[arg] = result[arg] = payload => ({
        type: result.type + " " + arg,
        payload
      });

      return result;
    }
  }

  if (args.length == 2) {
    const [name, create] = args;

    stages[name] = result[name] = (...payload) => ({
      type: result.type + " " + name,
      payload: create(...payload)
    });

    return result;
  }
};

const make = (name: string) => {
  const result = payload => ({
    type: name,
    payload
  });
  result.type = name;
  result.stage = stage(result, {});

  return result;
};

export { make };

const get = make("[something] get")
  .stage(id => id)
  .stage("success", data => data)
  .stage("failure");
