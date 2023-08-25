CREATE TABLE tln.identity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Identity',
    identity TEXT,
    hashed BOOLEAN,
    salt TEXT
);