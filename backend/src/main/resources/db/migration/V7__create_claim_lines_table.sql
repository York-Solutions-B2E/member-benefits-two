-- V7__create_claim_lines_table.sql
CREATE TABLE claim_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES claims(id),
    line_number INTEGER NOT NULL,
    cpt_code VARCHAR(10) NOT NULL,
    description VARCHAR(255) NOT NULL,
    billed_amount NUMERIC(10,2) NOT NULL,
    allowed_amount NUMERIC(10,2) NOT NULL,
    copay_applied NUMERIC(10,2) NOT NULL,
    deductible_applied NUMERIC(10,2) NOT NULL,
    coinsurance_applied NUMERIC(10,2) NOT NULL,
    plan_paid NUMERIC(10,2) NOT NULL,
    member_responsibility NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_claim_line_claim_id ON claim_lines (claim_id);
CREATE INDEX idx_claim_line_line_number ON claim_lines (claim_id, line_number);
