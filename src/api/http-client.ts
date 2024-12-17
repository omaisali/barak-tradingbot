// Base HTTP client for making API requests
export class HttpClient {
  protected async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors', // Enable CORS
        credentials: 'omit', // Don't send credentials for third-party APIs
        headers: {
          ...options.headers,
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);
      
      // Check if the response is ok before returning
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  protected handleError(error: unknown): never {
    console.error('API Error:', error);
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw new Error('An unknown API error occurred');
  }
}