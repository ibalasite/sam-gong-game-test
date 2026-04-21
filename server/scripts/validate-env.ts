/**
 * validate-env.ts
 *
 * Validates all required environment variables at startup.
 * Call this before starting the Colyseus server to fail fast
 * on missing or insecure configuration.
 */

const INSECURE_PLACEHOLDER = 'your-256-bit-secret-here';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnv(): void {
  const result = checkEnv();

  for (const warning of result.warnings) {
    console.warn(`[ENV WARN] ${warning}`);
  }

  if (result.errors.length > 0) {
    for (const error of result.errors) {
      console.error(`[ENV ERROR] ${error}`);
    }
    throw new Error(
      `Environment validation failed with ${result.errors.length} error(s). Refusing to start.`
    );
  }

  console.log('[ENV] Environment validation passed.');
}

export function checkEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // --- Required vars (always) ---
  const alwaysRequired: string[] = ['PORT', 'NODE_ENV'];
  const missing = alwaysRequired.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    errors.push(`Missing required env vars: ${missing.join(', ')}`);
  }

  // --- NODE_ENV must be known value ---
  const nodeEnv = process.env.NODE_ENV;
  const validEnvs = ['development', 'test', 'production'];
  if (nodeEnv && !validEnvs.includes(nodeEnv)) {
    warnings.push(`NODE_ENV="${nodeEnv}" is not a standard value. Expected: ${validEnvs.join(' | ')}`);
  }

  const isProduction = nodeEnv === 'production';

  // --- Security: JWT_SECRET ---
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret === INSECURE_PLACEHOLDER) {
    errors.push(
      'JWT_SECRET is using the example placeholder value — set a real secret! ' +
      'Generate one with: openssl rand -base64 32'
    );
  } else if (!jwtSecret) {
    if (isProduction) {
      warnings.push('JWT_SECRET not set — auth features will be disabled in production');
    } else {
      warnings.push('JWT_SECRET not set — auth features will be disabled');
    }
  } else if (jwtSecret.length < 32) {
    warnings.push('JWT_SECRET appears short (< 32 chars) — consider using a 256-bit key');
  }

  // --- Production-only required vars ---
  if (isProduction) {
    const prodRequired: string[] = ['ALLOWED_ORIGINS'];
    const missingProd = prodRequired.filter((k) => !process.env[k]);
    if (missingProd.length > 0) {
      errors.push(`Missing required production env vars: ${missingProd.join(', ')}`);
    }
  }

  // --- Database config ---
  const sqlitePath = process.env.SQLITE_DB_PATH;
  const databaseUrl = process.env.DATABASE_URL;
  if (!sqlitePath && !databaseUrl) {
    warnings.push('No database configured (SQLITE_DB_PATH or DATABASE_URL). In-memory state only.');
  }
  if (databaseUrl && databaseUrl.includes('password@localhost')) {
    warnings.push('DATABASE_URL appears to use example credentials — verify it is correct for your environment');
  }

  // --- Game config bounds ---
  const maxRooms = parseInt(process.env.MAX_ROOMS ?? '100', 10);
  if (isNaN(maxRooms) || maxRooms < 1) {
    errors.push('MAX_ROOMS must be a positive integer');
  }

  const maxPlayers = parseInt(process.env.MAX_PLAYERS_PER_ROOM ?? '6', 10);
  if (isNaN(maxPlayers) || maxPlayers < 2 || maxPlayers > 10) {
    warnings.push('MAX_PLAYERS_PER_ROOM should be between 2 and 10 for Three-Card Poker');
  }

  return { valid: errors.length === 0, errors, warnings };
}
