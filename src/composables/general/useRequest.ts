import { computed, ref, toRaw } from "vue";

import type { ApiRequest } from "@/types/api";

export function useRequest<TPayload, TResponse, TResult, TError>(
  apiFn: () => ApiRequest<TPayload, TResponse, TResult, TError>,
) {
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
        throw errorData as TError;
      }
      data.value = resolver(response);

      return toRaw(data.value);
    } catch (err) {
      error.value = err;
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
