import { make } from "../../actions";
import { LocationDescriptorObject, Location } from "history";
/**
 * Init router with start location
 */
const init = make("[router] init", (location: Location) => location);
/**
 * Go to location
 */
const navigate = make(
  "[router] navigate",
  (path: string | LocationDescriptorObject<any>, state?: any) =>
    [path, state] as [string | LocationDescriptorObject<any>, any?]
);
/**
 * Location changed event
 */
const transitioned = make(
  "[router] transitioned",
  (location: Location) => location
);

export { navigate, transitioned, init };
