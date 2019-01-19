<h1 align='center'>
	Redux Chill
</h1>

This library is compilation of solutions that i came with after a while working with redux. It includes solution for actions definition, reducers, async flow in redux.

Action creators will be like:

```typescript
import { make } from "redux-chill";

const myAction = make(
  "[namespace] my action",
  (myArgument: MyType) => ({ myArgument }),
  {
    start: (timeout: number) => ({ timeout })
    // here you can define any action stage that you want
  }
);

// that will generate:
// myAction(variableOfMyTypeType) -> {type: string; payload { myArgument: MyType }}

// myAction.type -> string
// myAction.start(1000) -> {type: string; payload : {timeout: nubmer}}

// all code above typed for usage with typescript
// so if you will try to myAction.success('string') // type error
```

To get rid of ugly switch cases there is also way to define reducers. Under the hood it uses immer so you don't need to care about immutability. If you will need some extra performance you can use anything you want, but probably you will not need some extraordinary performance so it will be ok to go with immer.
Reducers definition will become:

```typescript
import { create } from "redux-chill";

// init functions for reducer definition
const { on, bootstrap } = create({ id });

// state will be typed automatically
// action will be typed as ReturnType<typeof myAction>, so it reduces boilerplate
// note you can use anything as first argument that is {type: string }, but will lose auto typing of action argument
const onMyAction = on(myAction, (state, action) => {
  // it's ok because of immer
  state.someField = someValue;
  // you don't need to return anything, just change value
});

// same as above
const onMyActionStart = on(myAction.start, (state, action) => {
  state.isStarted = true;
});
/*
	> on
	will return :
	const result = (..args) => handler(...args);
	result.type = type // type which you passed to first arg of on

	So you can test that function wrapped with on separatly
*/

// my reducer will be type reducer with first argument with same typed that you defined in create above
const myReducer = bootstrap(onMyAction, onMyActionStart);

export { myReducer };
```

As solution for async actions i came with redux-saga, because it has flexible tools for managing async flow in you app. But i don't like problems with naming ( because probably you need to duplicate action names with prefixes watch - for watching for actions and so on, and also you will encounter naming collisions with action creators ( but may be it's only my problem )) and also function() {} definitions. So there is a way to use it in oop style, that solves few another problems.

```typescript
import { Saga, run } from "redux-chill";

// actually we can't call class "saga" itself but i think it's better to mark it somehow to differ it from another classes
class MySaga {
  @Saga(takeEvery, myAction) // same as in reducers, you can use here anything like {type: string} and default takeEvery/latest pattern type
  // for action type you can use ReturnType to not duplicate action creator return type somewhere, but if you have solition to make it auto like in reducers ping me!
  public *get(action: ReturnType<typeof myAction>) {
    // do something here
    // definition like that will spawn saga that watches for myAction and calls get method on match
    // note: methods will not loose context, so this will be MySaga instance, so you can use some class methods and properties
  }

  // if Saga arguments is empty, that method will be runned from start
  @Saga()
  public *manual() {
    while (true) {
      const action = take(myAction.start);

      put(otherAction.triggered(action));
      // do something
    }
  }
}
```

Actually solution above was planned to use with inversify to manage dependencies, so you can use sagas with di.

Also there is already one predefault saga, made for history.
RouterSaga.

```typescript
import {
  init,
  navigate,
  transitioned,
	router,
	SagaEffects,
	SagaHelpers,
	SagaUtils,
  RouterState,
  RouterSaga
} from "redux-chill";

// somewhere when you configuring store
store.dispatch(init(history.location));

// subscribe for location change
history.listen(location => store.dispatch(transitioned(location)));

// router reducer for storing current location
router;


// ...args -> same args as history.push
store.dispatch(navigate(...args))

// to use router saga you need to configure inversify and provide:
SagHelpers -> bind to self
SagEffects -> bind to self
// history instance bounded to history type form History package
history -> History
```
