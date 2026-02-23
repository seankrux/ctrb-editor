import 'server-only';

const SECRET_KEYS = ['API_SERVICE_TOKEN', 'OPENAI_API_KEY'] as const;

export type ServerSecretKey = (typeof SECRET_KEYS)[number];

function readSecretFromEnv(key: ServerSecretKey): string | undefined {
  const rawValue = process.env[key];
  if (!rawValue) {
    return undefined;
  }

  const trimmed = rawValue.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getServerSecret(key: ServerSecretKey): string | undefined {
  return readSecretFromEnv(key);
}

export function requireServerSecret(key: ServerSecretKey): string {
  const value = readSecretFromEnv(key);
  if (!value) {
    throw new Error(`Missing required server secret: ${key}`);
  }
  return value;
}

export function hasAnyServerSecret(): boolean {
  return SECRET_KEYS.some((key) => Boolean(readSecretFromEnv(key)));
}

