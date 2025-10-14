-- V9__create_accumulators_table.sql
CREATE TABLE accumulators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('DEDUCTIBLE', 'OOP_MAX')),
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('IN_NETWORK', 'OUT_OF_NETWORK')),
    limit_amount NUMERIC(10,2) NOT NULL,
    used_amount NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE INDEX idx_accumulator_enrollment_id ON accumulators (enrollment_id);
CREATE INDEX idx_accumulator_type ON accumulators (type);
CREATE INDEX idx_accumulator_tier ON accumulators (tier);