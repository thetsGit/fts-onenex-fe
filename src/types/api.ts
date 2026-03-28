export type TResponse<T, E = Record<string, string[]>> = {
  data: T;
  success: "ok" | "error";
  status: number;
  message?: string;
  errors?: E;
};

export type ApiRequest<TPayload, TRes, TResult = TRes, TError = unknown> = {
  request: (payload: TPayload) => Promise<TRes>;
  resolver: (response: TRes) => TResult;
  errorResolver: (response: TRes) => TError;
  abort: () => void;
};

export type TErrorData<E = Record<string, string[]>> = {
  errors?: E;
  message: string;
};
