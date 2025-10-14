-- V6__create_claims_table.sql
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    claim_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('SUBMITTED', 'IN_REVIEW', 'PROCESSED', 'PAID', 'DENIED')),
    service_start_date DATE NOT NULL,
    service_end_date DATE NOT NULL,
    received_date DATE NOT NULL,
    total_billed NUMERIC(10,2) NOT NULL,
    total_allowed NUMERIC(10,2) NOT NULL,
    total_plan_paid NUMERIC(10,2) NOT NULL,
    total_member_responsibility NUMERIC(10,2) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_claim_member_id ON claims (member_id);
CREATE INDEX idx_claim_provider_id ON claims (provider_id);
CREATE INDEX idx_claim_status ON claims (status);
CREATE INDEX idx_claim_received_date ON claims (received_date);
