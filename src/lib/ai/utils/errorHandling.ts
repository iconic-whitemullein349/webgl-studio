export class AIGenerationError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'AIGenerationError';
  }
}

export function handleAIError(error: unknown): AIGenerationError {
  if (error instanceof AIGenerationError) {
    return error;
  }

  if (error instanceof Error) {
    return new AIGenerationError(error.message);
  }

  return new AIGenerationError('An unknown error occurred');
}