// import 'reflect-'
import { Saga, run } from "./saga";
import { make } from "./actions";
import { Payload, reducer } from "./reducer";
import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import { createStore as reduxCreateStore, applyMiddleware } from "redux";

const get = make("[posts] get")
  .stage((count: number) => count)
  .stage("success", (data: string[]) => data)
  .stage("failure");

class PostsSaga {
  /**
   * Get posts
   */
  @Saga(get)
  public *get(payload: Payload<typeof get>, { mode }) {
    try {
      console.log("MODE IS: ", mode);
      console.log("ID IS: ", payload);

      const posts = yield call(() => ["dsa", "dsada"]);

      yield put(get.success(posts));
    } catch (error) {
      yield put(get.failure());
    }
  }
}

const posts = reducer({
  posts: [] as string[],
  isError: false,
  isFetching: false
})
  .on(get, (state, payload) => {
    console.log("GET FIRST: ", payload);
    state.isFetching = true;
  })
  .on(get.success, (state, posts) => {
    console.log("GET SUCCESS SECOND: ", posts);
    state.posts = posts;
  })
  .on(get.failure, state => {
    console.log("GET FAILURE SECOND");
    state.isError = true;
  })
  .on([get.success, get.failure], (state, payload) => {
    console.log("GET SUCCESS/FAILURE: ", payload);
    state.isFetching = false;
  });

/**
 * Create redux store
 */
const createStore = () => {
  const sagaMiddleware = createSagaMiddleware({
    onError: error => console.log(error, "Saga error occured")
  });

  const store = reduxCreateStore(posts, applyMiddleware(sagaMiddleware));

  run(sagaMiddleware, [new PostsSaga()], {
    mode: "development"
  });

  return store;
};

const store = createStore();

store.dispatch(get(123));
