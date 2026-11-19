CREATE TABLE IF NOT EXISTS licenses (
  code_hash TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'issued' CHECK(status IN ('issued','redeemed','revoked')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  redeemed_at TEXT,
  expires_at TEXT,
  note TEXT
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL REFERENCES licenses(code_hash),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS sessions_license_idx ON sessions(code_hash);
