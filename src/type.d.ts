export type ActionFunction<T> = (
  state: T,
  ...args: any[]
) => void | Promise<void>;
export type WrappedActionsType<K extends Record<string, ActionFunction<any>>> =
  {
    [P in keyof K]: (...args: OmitFirstParameter<K[P]>) => void;
  };
export type OmitFirstParameter<T extends (...args: any) => any> = T extends (
  state: any,
  ...args: infer P
) => any
  ? P
  : never;
