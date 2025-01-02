import { Buffer } from 'buffer';

export function computeSignature(message: string, privateKey: string): string {
  const encoder = new TextEncoder();
  const messageData = encoder.encode(message);
  const keyData = encoder.encode(privateKey);
  
  // Create HMAC
  const hmac = crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  ).then(key => 
    crypto.subtle.sign(
      'HMAC',
      key,
      messageData
    )
  );

  return hmac.then(signature => 
    Buffer.from(signature).toString('base64')
  );
}