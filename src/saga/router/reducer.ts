import { RouterState } from "./state";
import { transitioned, init } from "./actions";
import { create } from "../../reducer";

const { bootstrap, on } = create(new RouterState());

/**
 * Write new location
 */
const onChange = on(
  transitioned,
  (state, action) => (state.location = action.payload)
);
/**
 * On router init
 */
const onInit = on(init, onChange);
/**
 * Router state
 */
const router = bootstrap(onChange, onInit);

export { router };
