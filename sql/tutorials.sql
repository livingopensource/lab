CREATE TABLE tutorials(
    id        SERIAL PRIMARY KEY,
    title     TEXT,
    authors   TEXT,
    contents  TEXT,
    metadata  JSONB 
);