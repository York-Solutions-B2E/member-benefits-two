-- Index for finding active enrollments by member
CREATE INDEX idx_enrollment_member_active ON enrollments (member_id, active) WHERE active = true;

-- Index for claims by member ordered by received date (for recent claims)
CREATE INDEX idx_claims_member_received_date_desc ON claims (member_id, received_date DESC);

-- Composite index for accumulator queries
CREATE INDEX idx_accumulator_enrollment_tier ON accumulators (enrollment_id, tier);