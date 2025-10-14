-- V5__create_enrollments_table.sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id),
    plan_id UUID NOT NULL REFERENCES plans(id),
    coverage_start DATE NOT NULL,
    coverage_end DATE NOT NULL,
    active BOOLEAN NOT NULL
);

CREATE INDEX idx_enrollment_member_id ON enrollments (member_id);
CREATE INDEX idx_enrollment_plan_id ON enrollments (plan_id);
CREATE INDEX idx_enrollment_active ON enrollments (active);
