import { SagaMiddleware } from "redux-saga";
import { SagaMetdata, SAGA_METAKEY } from "./saga";
import { call } from "redux-saga/effects";
import { Func } from "../actions";

/**
 * Run sagas
 */
const run = (middleware: SagaMiddleware, sagas: Object[], context?: any) => {
  const result = [];

  sagas.map(saga => {
    const metadata: SagaMetdata = Object.getPrototypeOf(saga)[SAGA_METAKEY];

    if (!metadata) return;

    metadata.contexts.map(item => {
      if (item.prop) {
        if (typeof item.prop == "string") {
          saga[item.name] = context[item.prop];
        }

        if (typeof item.prop == "function") {
          saga[item.name] = item.prop(context);
        }
      } else {
        saga[item.name] = context;
      }
    });

    metadata.workers.map(worker => {
      const method = saga[worker.name];
      const { effect, pattern } = worker;

      if (effect) {
        result.push(function*() {
          yield (effect as any)(pattern, function*(action) {
            return yield call(method.bind(saga), action.payload);
          });
        });
      } else {
        result.push(method.bind(saga));
      }
    });
  });

  result.map(middleware.run);

  return result;
};

type SagaAction<T extends Func> = ReturnType<T>;

export { run, SagaAction };
