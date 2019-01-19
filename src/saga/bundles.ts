import {
  buffers,
  channel,
  delay,
  eventChannel,
  takeEvery,
  takeLatest,
  throttle
} from "redux-saga";
import {
  actionChannel,
  apply,
  call,
  cancel,
  cancelled,
  cps,
  flush,
  fork,
  getContext,
  join,
  put,
  select,
  setContext,
  spawn,
  take
} from "redux-saga/effects";
import { cloneableGenerator, createMockTask } from "redux-saga/utils";
import { injectable } from "inversify";

/**
 * Effected bundle
 */
@injectable()
class SagaEffects {
  public take = take;
  public put = put;
  public call = call;
  public apply = apply;
  public fork = fork;
  public cps = cps;
  public spawn = spawn;
  public join = join;
  public cancel = cancel;
  public select = select;
  public actionChannel = actionChannel;
  public flush = flush;
  public cancelled = cancelled;
  public setContext = setContext;
  public getContext = getContext;
}

/**
 * Saga helpers
 */
@injectable()
class SagaHelpers {
  public takeEvery = takeEvery;
  public takeLatest = takeLatest;
  public throttle = throttle;
}

/**
 * Saga utils bundle
 */
@injectable()
class SagaUtils {
  public channel = channel;
  public eventChannel = eventChannel;
  public buffers = buffers;
  public delay = delay;
  public cloneableGenerator = cloneableGenerator;
  public createMockTask = createMockTask;
}

export { SagaEffects, SagaHelpers, SagaUtils };
