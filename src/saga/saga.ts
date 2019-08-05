import { SagaEffect, PatternOption, SagaMetdata, SAGA_METAKEY } from "./types";

/**
 * Defines saga with instant execution
 */
function Saga();
/**
 * Defines saga wich will be wrapped with passed effect
 */
function Saga(effect: SagaEffect, pattern: PatternOption);
function Saga(effect?: SagaEffect, pattern?: PatternOption) {
  if (effect) {
    if (!pattern || (typeof pattern == "object" && !pattern.type)) {
      throw new Error(
        "You need to provide action type or { type : string } for action matching"
      );
    }
  }

  return (target, key, descriptor: PropertyDescriptor) => {
    const metadata: SagaMetdata = target[SAGA_METAKEY] || new SagaMetdata();

    Object.defineProperty(target, SAGA_METAKEY, { value: metadata });

    metadata.workers.push({
      name: key,
      effect,
      pattern:
        (typeof pattern == "object" || typeof pattern == "function") &&
        "type" in pattern
          ? pattern.type
          : pattern
    });
  };
}

export { Saga, SagaMetdata, SAGA_METAKEY, SagaEffect };
