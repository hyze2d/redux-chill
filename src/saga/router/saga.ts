import { takeEvery } from "redux-saga/effects";
import { navigate } from "./actions";
import { History } from "history";
import { injectable, inject } from "inversify";
import { SagaHelpers, SagaEffects } from "../bundles";
import { Saga } from "../saga";

@injectable()
class RouterSaga {
  /**
   * Get dependencies
   */
  public constructor(
    @inject(History) public history: History,
    @inject(SagaHelpers) public helpers: SagaHelpers,
    @inject(SagaEffects) public effects: SagaEffects
  ) {}
  /**
   * Push path
   */
  @Saga(takeEvery, navigate)
  public *push({ payload }: ReturnType<typeof navigate>) {
    const { history } = this;
    const [path, state] = payload;

    history.push(path as any, state);
  }
}

export { RouterSaga };
