import { env } from 'node:process';

export function getAPIKey() {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  return env.ANTHROPIC_API_KEY;
}
