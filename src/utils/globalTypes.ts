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
