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

    metadata.workers.map(worker => {
      const method = saga[worker.name];
      const { effect, pattern } = worker;

      if (effect) {
        result.push(function*() {
          yield (effect as any)(pattern, function*(action) {
            return yield call(method.bind(saga), action.payload, context);
          });
        });
      } else {
        const handle = method.bind(saga);
        result.push(function*() {
          return yield call(handle, context);
        });
      }
    });
  });

  result.map(middleware.run);

  return result;
};

export { run };
