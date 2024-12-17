export async function withRetry<T>(
  operation: () => Promise<T>,
  {
    attempts = 3,
    delay = 1000,
    onError,
  }: {
    attempts?: number;
    delay?: number;
    onError?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (onError) {
        onError(lastError, attempt);
      }

      if (attempt === attempts) {
        throw lastError;
      }

      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}