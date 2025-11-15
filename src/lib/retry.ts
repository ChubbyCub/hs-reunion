/**
 * Retry utility for fetch requests
 * Retries a fetch request up to maxRetries times if it fails
 */

interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  shouldRetry?: (error: Error, response?: Response) => boolean;
}

const defaultShouldRetry = (error: Error, response?: Response): boolean => {
  // Retry on network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return true;
  }

  // Retry on 5xx server errors
  if (response && response.status >= 500) {
    return true;
  }

  // Retry on 408 Request Timeout and 429 Too Many Requests
  if (response && (response.status === 408 || response.status === 429)) {
    return true;
  }

  return false;
};

/**
 * Executes a fetch request with retry logic
 * @param url - The URL to fetch
 * @param options - Fetch options (method, headers, body, etc.)
 * @param retryOptions - Retry configuration
 * @returns Promise<Response>
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 2,
    delayMs = 1000,
    shouldRetry = defaultShouldRetry,
  } = retryOptions;

  let lastError: Error | null = null;
  let lastResponse: Response | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // If response is ok, return it
      if (response.ok) {
        return response;
      }

      // If response is not ok, check if we should retry
      lastResponse = response;
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);

      if (attempt < maxRetries && shouldRetry(error, response)) {
        console.warn(`Request to ${url} failed (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }

      // If we shouldn't retry or this is the last attempt, return the response
      return response;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // If this is not the last attempt and we should retry, continue
      if (attempt < maxRetries && shouldRetry(lastError)) {
        console.warn(`Request to ${url} failed (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delayMs}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }

      // If this is the last attempt, throw the error
      throw lastError;
    }
  }

  // This should never be reached, but just in case
  if (lastError) {
    throw lastError;
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw new Error('Unexpected error in fetchWithRetry');
}

/**
 * Helper function to make JSON POST requests with retry
 */
export async function postJsonWithRetry(
  url: string,
  data: unknown,
  retryOptions: RetryOptions = {}
): Promise<Response> {
  return fetchWithRetry(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
    retryOptions
  );
}

/**
 * Helper function to make FormData POST requests with retry
 */
export async function postFormDataWithRetry(
  url: string,
  formData: FormData,
  retryOptions: RetryOptions = {}
): Promise<Response> {
  return fetchWithRetry(
    url,
    {
      method: 'POST',
      body: formData,
    },
    retryOptions
  );
}
