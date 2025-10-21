-- V1__complete_schema_and_data.sql
-- Complete schema and seed data for Member Benefits Dashboard

-- ==============================================
-- TABLE DEFINITIONS
-- ==============================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_provider VARCHAR(50) NOT NULL,
    auth_sub VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uk_user_auth_provider_sub UNIQUE (auth_provider, auth_sub)
);

CREATE INDEX idx_user_auth_provider_sub ON users (auth_provider, auth_sub);
CREATE INDEX idx_user_email ON users (email);

-- Plans table
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    network_name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('EPO', 'HDHP', 'HMO', 'PPO')),
    plan_year INTEGER NOT NULL
);

CREATE INDEX idx_plan_name ON plans (name);
CREATE INDEX idx_plan_year ON plans (plan_year);

-- Providers table
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100),
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20)
);

CREATE INDEX idx_provider_name ON providers (name);
CREATE INDEX idx_provider_specialty ON providers (specialty);
CREATE INDEX IF NOT EXISTS idx_provider_name_lower ON providers (LOWER(name));

-- Members table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE NOT NULL,
    phone VARCHAR(20),
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_member_user_id ON members (user_id);
CREATE INDEX idx_member_email ON members (email);

-- Enrollments table
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
CREATE INDEX idx_enrollment_member_active ON enrollments (member_id, active) WHERE active = true;

-- Claims table
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
CREATE INDEX idx_claims_member_received_date_desc ON claims (member_id, received_date DESC);
CREATE INDEX IF NOT EXISTS idx_claims_service_start_date ON claims (service_start_date);
CREATE INDEX IF NOT EXISTS idx_claims_service_end_date ON claims (service_end_date);
CREATE INDEX IF NOT EXISTS idx_claims_member_status ON claims (member_id, status);
CREATE INDEX IF NOT EXISTS idx_claims_member_service_dates ON claims (member_id, service_start_date, service_end_date);
CREATE INDEX IF NOT EXISTS idx_claims_provider_member ON claims (provider_id, member_id);

-- Claim lines table
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

-- Claim status events table
CREATE TABLE claim_status_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES claims(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('SUBMITTED', 'IN_REVIEW', 'PROCESSED', 'PAID', 'DENIED')),
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    note VARCHAR(500)
);

CREATE INDEX idx_claim_status_event_claim_id ON claim_status_events (claim_id);
CREATE INDEX idx_claim_status_event_occurred_at ON claim_status_events (occurred_at);

-- Accumulators table
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
CREATE INDEX idx_accumulator_enrollment_tier ON accumulators (enrollment_id, tier);

-- ==============================================
-- SEED DATA
-- ==============================================

-- Insert test plan
INSERT INTO plans (id, name, type, network_name, plan_year)
VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'Gold PPO',
    'PPO',
    'Prime',
    2025
);

-- Insert providers
INSERT INTO providers (id, name, specialty, line1, line2, city, state, postal_code, phone)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440006', 'River Clinic', 'Primary Care', '456 River Road', NULL, 'Rivertown', 'CA', '12346', '555-234-5678'),
    ('550e8400-e29b-41d4-a716-446655440007', 'City Imaging Center', 'Radiology', '789 City Ave', 'Suite 200', 'Citytown', 'CA', '12347', '555-345-6789'),
    ('550e8400-e29b-41d4-a716-446655440008', 'Prime Hospital', 'Hospital', '321 Prime Blvd', NULL, 'Primetown', 'CA', '12348', '555-456-7890');

-- Create a test user for dmasonone@gmail.com (this will be overridden when real OIDC user logs in)
INSERT INTO users (id, auth_provider, auth_sub, email, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'google',
    'test-sub-123',
    'dmasonone@gmail.com',
    NOW(),
    NOW()
) ON CONFLICT (auth_provider, auth_sub) DO NOTHING;

-- Create a member record for dmasonone@gmail.com
INSERT INTO members (id, user_id, first_name, last_name, email, date_of_birth, phone, line1, line2, city, state, postal_code, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Devin',
    'Mason',
    'dmasonone@gmail.com',
    '2003-07-23',
    '410-459-9139',
    '1702 W Cleveland Ave',
    NULL,
    'Tampa',
    'FL',
    '33606',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert enrollment for the member
INSERT INTO enrollments (id, member_id, plan_id, coverage_start, coverage_end, active)
VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '2025-01-01',
    '2025-12-31',
    true
) ON CONFLICT (id) DO NOTHING;

-- Insert accumulators for the enrollment
INSERT INTO accumulators (id, enrollment_id, type, tier, limit_amount, used_amount)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'DEDUCTIBLE', 'IN_NETWORK', 1500.00, 300.00),
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'OOP_MAX', 'IN_NETWORK', 6000.00, 1200.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample claims
INSERT INTO claims (id, claim_number, member_id, provider_id, service_start_date, service_end_date, received_date, status, total_billed, total_allowed, total_plan_paid, total_member_responsibility, updated_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440010', 'C-10421', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', '2024-08-29', '2024-08-29', '2024-08-30', 'PROCESSED', 300.00, 200.00, 155.00, 45.00, NOW()),
    ('550e8400-e29b-41d4-a716-446655440011', 'C-10405', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', '2024-08-20', '2024-08-20', '2024-08-21', 'DENIED', 500.00, 0.00, 0.00, 0.00, NOW()),
    ('550e8400-e29b-41d4-a716-446655440012', 'C-10398', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', '2024-08-09', '2024-08-09', '2024-08-10', 'PAID', 800.00, 600.00, 480.00, 120.00, NOW()),
    ('550e8400-e29b-41d4-a716-446655440013', 'C-10375', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', '2024-07-25', '2024-07-25', '2024-07-26', 'IN_REVIEW', 400.00, 0.00, 0.00, 0.00, NOW()),
    ('550e8400-e29b-41d4-a716-446655440014', 'C-10312', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', '2024-07-15', '2024-07-15', '2024-07-16', 'PAID', 300.00, 240.00, 180.00, 60.00, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert claim lines for the first claim
INSERT INTO claim_lines (id, claim_id, line_number, cpt_code, description, billed_amount, allowed_amount, deductible_applied, copay_applied, coinsurance_applied, plan_paid, member_responsibility)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 1, '99213', 'Office Visit, Est Pt', 150.00, 100.00, 0.00, 25.00, 10.00, 65.00, 35.00),
    ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', 2, '81002', 'Urinalysis', 150.00, 100.00, 0.00, 0.00, 10.00, 90.00, 10.00)
ON CONFLICT (id) DO NOTHING;

-- Insert claim status events for the first claim
INSERT INTO claim_status_events (id, claim_id, status, occurred_at, note)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440010', 'SUBMITTED', '2024-08-29 10:00:00+00', 'Claim submitted by provider'),
    ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440010', 'IN_REVIEW', '2024-08-30 14:30:00+00', 'Claim under review'),
    ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440010', 'PROCESSED', '2024-09-02 09:15:00+00', 'Claim processed and approved'),
    ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440010', 'PAID', '2024-09-03 11:45:00+00', 'Payment issued to provider')
ON CONFLICT (id) DO NOTHING;


-- Documents table for EOB storage
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    storage_path VARCHAR(255) NOT NULL,
    member_id UUID NOT NULL REFERENCES members(id),
    claim_id UUID REFERENCES claims(id),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_member_id ON documents (member_id);
CREATE INDEX idx_document_claim_id ON documents (claim_id);