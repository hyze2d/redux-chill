import { SagaMetdata, SAGA_METAKEY } from "./saga";

/**
 * Define context
 */
const Context = (prop?: string | ((context) => any)) => {
  return ((target: any, key: string, descriptor) => {
    const metadata: SagaMetdata = target[SAGA_METAKEY] || new SagaMetdata();

    metadata.contexts.push({
      name: key,
      prop
    });

    Object.defineProperty(target, SAGA_METAKEY, { value: metadata });
  }) as any;
};

class Test {
  @Context()
  test;
}

export { Context };
