-- V2__create_plans_table.sql
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    network_name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('EPO', 'HDHP', 'HMO', 'PPO')),
    plan_year INTEGER NOT NULL
);

CREATE INDEX idx_plan_name ON plans (name);
CREATE INDEX idx_plan_year ON plans (plan_year);
