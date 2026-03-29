import { computed, ref, toRaw } from "vue";

import type { ApiRequest } from "@/types/api";

type UseRequestOptions<TPaylod, TResult> = {
  onSuccess?: (data: TResult, params: TPaylod) => void;
  onError?: (error: unknown, params: TPaylod) => void;
};

export function useRequest<TPayload, TResponse, TResult, TError>(
  apiFn: () => ApiRequest<TPayload, TResponse, TResult, TError>,
  options?: UseRequestOptions<TPayload, TResult>,
) {
  const { onSuccess, onError } = { ...options };

  const data = ref<TResult | null>(null);
  const error = ref<unknown>(null);
  const fetching = ref(false);
  const pending = computed(() => Boolean(!data.value && fetching.value));

  const { request, resolver, abort, errorResolver } = apiFn();

  const execute = async (payload: TPayload): Promise<TResult> => {
    fetching.value = true;
    error.value = null;

    try {
      abort();
      const response = await request(payload);
      const errorData = errorResolver(response);
      if (errorData) {
        error.value = errorData;
        onError?.(errorData, payload);
        throw errorData as TError;
      }

      const resolved = resolver(response);
      data.value = resolved;

      onSuccess?.(resolved, payload);

      return toRaw(data.value);
    } catch (err) {
      error.value = err;
      onError?.(err, payload);
      throw err;
    } finally {
      fetching.value = false;
    }
  };

  return {
    data,
    error,
    pending,
    fetching,
    execute,
    abort,
  };
}
