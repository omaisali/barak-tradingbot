export interface AuthConfig {
  publicKey: string;
  privateKey: string;
}

export class AuthService {
  constructor(private config: AuthConfig) {}

  async generateSignature(message: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(this.config.privateKey);
      const messageData = encoder.encode(message);

      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        messageData
      );

      return btoa(String.fromCharCode(...new Uint8Array(signature)));
    } catch (error) {
      throw new Error('Failed to generate signature: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async getHeaders(message: string = ''): Promise<Headers> {
    const timestamp = Date.now();
    const signature = await this.generateSignature(message);

    return new Headers({
      'X-PCK': this.config.publicKey,
      'X-Stamp': timestamp.toString(),
      'X-Signature': signature,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  }
}