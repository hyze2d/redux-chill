import { takeEvery, Pattern, takeLatest } from "redux-saga";
import { take } from "redux-saga/effects";

/**
 * Saga seffect func
 */
type SagaEffect = typeof takeEvery | typeof takeLatest | typeof take;
/**
 * Effects list
 */
const effects = [take, takeEvery, takeLatest];
/**
 * Metakey for class
 */
const metaKey = "SAGA_METADATA_KEY";

class SagaMetdata {
  /**
   * Sagas list
   */
  public sagas: {
    effect?: SagaEffect | Function;
    pattern?: Pattern;
    name: string;
  }[] = [];
}
/**
 * Saga decorator
 */
const Saga = (
  effect?: SagaEffect | Function,
  pattern?: Pattern | { type: string }
) => (target, name, descriptor) => {
  const metadata: SagaMetdata = target[metaKey] || new SagaMetdata();

  Object.defineProperty(target, metaKey, { value: metadata });

  metadata.sagas.push({
    name,
    effect,
    pattern:
      (typeof pattern == "object" || typeof pattern == "function") &&
      "type" in pattern
        ? pattern.type
        : pattern
  });
};

export { Saga, SagaMetdata, metaKey, effects, SagaEffect };
