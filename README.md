# Redux-Chill

This library is another try to reduce pain of working with redux in terms of writing boilerplate. It includes utils for: action creators building, reducers, redux-saga approache. Also library provides that tools with full typisation for typesafely working with typescript.

## Actions

When working with action creators you need to define 2 things: action type for matching, and action creator for building action object. Classic approach is to define constants like `const ACTION_TYPE = 'ACTION_TYPE'`, and function for defining how object is created where that const used as type field.
With redux-chill you can:

```javascript
import { make } from "redux-chill";

// make takes single arg that is name of base action type
const doSomething = make("[namespace] do something")
  // with .stage you define "stage" of action to group it with initial action creator, it will return { type: 'here will be type that you pass to make() + first argument of stage' }
  .stage("success", (id: number, result: SoemType) => {
    // return here what you want to see in .payload field of doSomethings.success will return
    id, result;
  })
  // you can define as many stages as you want
  .stage("failure", (message: string) => message)
  // second argument is optional, if it's empty, action.payload will contain null
  .stage("finish")
  // stage name can be any string, but recommended to name it in camel case, because you will use it like: doSomething.whatever(), it's also can be doSomething['what-ever'] if you passed like that in stage, but it's you choise
  .stage("whatever")
  // build action creator, here you pass initial action creator function : doSomething(123, 'dsada').
  // initial action creator is optional, if not passed it will be just function without arguments
  .build((some: number, arguments: string) => ({
    // return here whatever you want
    field: some + Math.random(),
    arguments
  }));

// doSomething will be:
// it will be typed like function passed to build
doSomething(some, arguments); // {type, payload: { field, arguments } }, also all types will be same as you defined in build

// action type passed to make()
doSomething.type;

// all stages will be fields on build() return type, so in our case it can be success, failure, finish, whatever
// same arguments that you defined in failure stage above
doSomething.failure(message); // {type, payload }, payload will be typed as string because we returned string type in stage definition above

// so other stages will work the same, but stages without second arguments will not require any arguments
doSomething.success;
// make()  argument + ' ' + stage name (stage's first argument )
doSomething.success.type;
```

So because of all described above you will get rid of writing action type constants, you will be able you action creator .type field as constant for matching in reducers or where you want it. Also you group your actions to single reference and no more need to write something like: "doSomething, doSomethingSuccess, doSomethingFailure ... ". Also full type safety for TS.

## Reducers

For reducers you'll get simplier syntax then huge swith cases with ugly spread operations and typesafety for you handlers. Final reducer is made with immer, so you can write handlers that mutate state and it will return new state on changes anyway.

```javascript
import { reducer } from "redux-chill";

const defaultState = {
  some: null,
  fields: "1111",
  goes: 123,
  here: {
    id: 123,
    name: "111"
  }
};

// reducer takes single argument - defaultState which will be used as default value for first agument and for argument typisation
const someReducer = reducer(defaultState);
            // with on you define handlers for specific action creator
            // because parts of library targeted to work together, first argument requires function which returns { type, payload } and has .type field for matching so we take example from above of action creator made with make()
            // second argument will be action.payload to get rid of unneeded "action.payload" or { payload }
            .on(doSomething, (state, payload) => {
                // under the hood that handler is wrapped with produce from immer library, so here you can perform mutable actions but it will return new state is result

                // payload type will be same as doSomething().payload type, so it's typesafe
                // state type will be same as we provided in reducer(), or reducer<T>
                state.some = payload.field;

                // you don't need to return anything, just set needed fields and it's all

            })
            // same as above
            .on(doSomething.success, (state, payload) => {
                // same as previous case, but type of payload will be same as doSomething.success().payload
            })
            .build(); // not arguments, returns bootstraped reducer

// first argument - typed as defaultState
// second argument - typed as return types of all action creators used in .on calls
someReducer(defaultState, { type, payload });

```

## Sagas

It's probably most optional thing here, but if you use redux-saga, it's will help you with namespacing problems, remove watcher sagas ( which just call banch of take or single yield takeEvery/takeLatest ). But it force you to define your sagas as group in single class ( but probably it's not a problem because in most cases you grouping your sagas by feature ).

```typescript
import { Saga, Context, Payload, run } from 'redux-chill'

// i call it saga, because it just helps to mark it as class which contains sagas
class MySaga {
    // saga's can be dfined with @Saga decorator
    // if no arguments passed it will be runned immimmediately
    @Saga()
    public instant*() {
        // here you just implement your saga's logic
    }

    // in case if you want to handle specific action, just pass takeLatest/takeEvery to first arg and pass action creator with .type field to second
    @Saga(takeLatest, doSomething) // doSomething.success / doSomething.finish and others which have .type field, you can even pass { type: 'action type' } or just action type itself
    // as argument it just takes action itself ( same logic as .on in reducers )
    // to simplify typisation ( because we pass handler in decorator, so it doesn't help us with types, we need to type it here ) you can use Payload type and pass in it typeof youractioncreator, and it will just type argument as .payload of function return type
    // as second argument saga takes provided on initializtion context ( explanation will be bellow )
    // all @Saga marked methods will be bounded to class instance, so you will not lose this and can make some class methods and use them here as this.methodName
    public doSomething(payload : Payload<typeof doSomething>, context : any) {

    }

    // information about how to pass context will be bellow
    // with context you define value that will be injected from context on sagas initialization
    // With that decorator you can get some deps like api services, helpers and other staff
    // For same reason you can you redux-saga setContext, getContext api, so it's optional but can simplify staff
    @Context('contextProp') // get some prop from context ( context[prop])
    @Context((context) => context.some.field) // select(context)
    @Context() // get full context
    public someContextData : YourTypeHere;
}


// To boostrap saga's classes you need
import { run } from 'redux-chill'

// just pass redux-saga mw instance
// list of instances of your classes with @Sagas, 
// and optionaly context value that will be used by @Context, and will be passed to second argument ( or first if it's @Saga()) in any saga.
run(sagaMw, [new MySaga()], { api, history }); // it will just boostrap it to simple functions, pass context, and run them with sagaMw.run()

```
