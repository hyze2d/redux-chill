import { SagaMiddleware } from "redux-saga";
import { metaKey, SagaMetdata } from "./saga";

const run = (middleware: SagaMiddleware<any>, groups: any[]) => {
  const boostraped = [];

  groups.map(item => {
    const metadata: SagaMetdata = Object.getPrototypeOf(item)[metaKey];

    if (!metadata) return;

    metadata.sagas.map(saga => {
      const method = item[saga.name];
      const { effect, pattern } = saga;

      if (effect) {
        if (!pattern) {
          throw new Error(
            "You must provide pattern as second arguent for @Saga"
          );
        }

        return boostraped.push(function*() {
          yield (effect as any)(pattern, method.bind(item));
        });
      }

      boostraped.push(method.bind(item));
    });
  });

  boostraped.map(middleware.run);
};

export { run };
