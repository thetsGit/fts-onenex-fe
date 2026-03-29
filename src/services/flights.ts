import type { TErrorData, TResponse } from "@/types/api";
import type { Flight } from "@/types/entities";

import { API_URL } from "@/constants";

export const getFlights = () => {
  type Response = TResponse<Flight[]>;

  let abortController: AbortController;

  const request = async () => {
    abortController = new AbortController();

    const rawResponse = await fetch(`${API_URL}/flights`, {
      method: "GET",
      signal: abortController.signal,
    });
    const result = (await rawResponse.json()) as Response;
    return result;
  };

  const resolver = (response: Response) => {
    return response.data;
  };

  const errorResolver = (response: Response): TErrorData | null => {
    if (!response.success)
      return {
        errors: response.errors || {},
        message: response.message || "",
      };
    return null;
  };

  const abort = () => {
    abortController?.abort();
  };

  return { request, resolver, abort, errorResolver };
};
