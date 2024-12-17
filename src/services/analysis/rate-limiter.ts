export class RateLimiter {
  private lastExecutionTime: number = 0;

  constructor(private minInterval: number) {}

  async waitForNextExecution(): Promise<void> {
    const now = Date.now();
    const timeSinceLastExecution = now - this.lastExecutionTime;

    if (timeSinceLastExecution < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastExecution)
      );
    }

    this.lastExecutionTime = Date.now();
  }
}