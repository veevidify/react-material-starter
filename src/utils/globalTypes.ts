/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
declare global {
  type Nullable<T> = T | null;
  type GOb = { [key: string]: any };

  class Effect<T = any> {
    private type: T;
  }

  interface IO<T = any> extends Effect<T> {}
  interface NetworkIO<T = any> extends Effect<T> {}

  interface DOMMutation<T = any> extends Effect<T> {}
  interface LocalStorageAction<T = any> extends Effect<T> {}
}

export default {};
