import { takeLatest, takeEvery, takeLeading } from "redux-saga/effects";

/**
 * Allowed effects for @Saga
 */
type SagaEffect = typeof takeLatest | typeof takeEvery;
/**
 * Action type description
 */
type Pattern = string | { type: string };
/**
 * Saga metadata for decorators
 */
class SagaMetdata {
  /**
   * Sagas list
   */
  public workers: {
    effect?: SagaEffect;
    pattern?: Pattern;
    name: string;
  }[] = [];
}

/**
 * Saga metakey for decorator
 */
const SAGA_METAKEY = "@SAGA_METAKEY";

export { SagaEffect, Pattern, SagaMetdata, SAGA_METAKEY };
