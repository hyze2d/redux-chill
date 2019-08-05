import { takeLatest, takeEvery, takeLeading } from "redux-saga/effects";

/**
 * Allowed effects for @Saga
 */
type SagaEffect = typeof takeLatest | typeof takeEvery;
/**
 * Action type description
 */
type PatternOption = string | { type: string };

/**
 * Saga metadata for decorators
 */
class SagaMetdata {
  /**
   * Sagas list
   */
  public workers: {
    effect?: SagaEffect;
    pattern?: PatternOption;
    name: string;
  }[] = [];
  /**
   * Context getters
   */
  public contexts: {
    name: string;
    prop?: string | ((context) => any);
  }[] = [];
}

/**
 * Saga metakey for decorator
 */
const SAGA_METAKEY = "@SAGA_METAKEY";

export { SagaEffect, PatternOption, SagaMetdata, SAGA_METAKEY };
