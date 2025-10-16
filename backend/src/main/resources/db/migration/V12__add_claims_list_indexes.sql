-- Additional indexes for Claims List filtering and performance
-- These indexes support the complex filtering queries in ClaimsList

-- Index for claims filtering by status
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims (status);

-- Index for claims filtering by service date range
CREATE INDEX IF NOT EXISTS idx_claims_service_start_date ON claims (service_start_date);

-- Index for claims filtering by service end date
CREATE INDEX IF NOT EXISTS idx_claims_service_end_date ON claims (service_end_date);

-- Composite index for member + status filtering (most common filter combination)
CREATE INDEX IF NOT EXISTS idx_claims_member_status ON claims (member_id, status);

-- Composite index for member + service date range filtering
CREATE INDEX IF NOT EXISTS idx_claims_member_service_dates ON claims (member_id, service_start_date, service_end_date);

-- Index for provider name searches (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_provider_name_lower ON providers (LOWER(name));

-- Composite index for claims + provider filtering
CREATE INDEX IF NOT EXISTS idx_claims_provider_member ON claims (provider_id, member_id);

-- Index for exact claim number lookups (already exists as unique, but ensuring it's optimized)
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_claims_claim_number ON claims (claim_number);
