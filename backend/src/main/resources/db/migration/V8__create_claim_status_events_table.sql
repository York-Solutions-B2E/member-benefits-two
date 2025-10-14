-- V8__create_claim_status_events_table.sql
CREATE TABLE claim_status_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES claims(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('SUBMITTED', 'IN_REVIEW', 'PROCESSED', 'PAID', 'DENIED')),
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    note VARCHAR(500)
);

CREATE INDEX idx_claim_status_event_claim_id ON claim_status_events (claim_id);
CREATE INDEX idx_claim_status_event_occurred_at ON claim_status_events (occurred_at);
