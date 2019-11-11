import { SagaEffect, Pattern, SagaMetdata, SAGA_METAKEY } from "./types";
import { takeLatest } from "redux-saga/effects";

/**
 * Defines saga with instant execution
 */
function Saga();
/**
 * Defines saga wich will be wrapped with passed effect
 */
function Saga(pattern: Pattern);
function Saga(effect: SagaEffect, pattern: Pattern);
function Saga(...args: any[]) {
  let effect: SagaEffect, pattern: Pattern;

  if (args.length == 1) {
    effect = takeLatest;

    [pattern] = args;
  }

  if (args.length == 2) {
    [effect, pattern] = args;
  }

  if (effect) {
    if (!pattern || (typeof pattern == "object" && !pattern.type)) {
      throw new Error(
        "You need to provide action type or { type : string } for action matching"
      );
    }
  }

  return (target, key) => {
    const metadata: SagaMetdata = target[SAGA_METAKEY] || new SagaMetdata();

    Object.defineProperty(target, SAGA_METAKEY, { value: metadata });

    metadata.workers.push({
      name: key,
      effect,
      pattern:
        (typeof pattern == "object" || typeof pattern == "function") &&
        "type" in pattern
          ? pattern.type
          : pattern
    });
  };
}

export { Saga, SagaMetdata, SAGA_METAKEY, SagaEffect };
