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

-- Create a member record for dmasonone@gmail.com (if the user exists and member doesn't exist)
INSERT INTO members (id, user_id, first_name, last_name, email, date_of_birth, phone, line1, line2, city, state, postal_code)
SELECT 
    '550e8400-e29b-41d4-a716-446655440001',
    u.id,
    'Devin',
    'Mason',
    'dmasonone@gmail.com',
    '2003-07-23', -- Update with your actual DOB
    '410-459-9139', -- Update with your actual phone
    '1702 W Cleveland Ave', -- Update with your actual address
    NULL,
    'Tampa', -- Update with your actual city
    'FL', -- Update with your actual state
    '33606' -- Update with your actual postal code
FROM users u
WHERE u.email = 'dmasonone@gmail.com'
AND NOT EXISTS (SELECT 1 FROM members WHERE user_id = u.id);

-- Insert enrollment for the member (only if member was created)
INSERT INTO enrollments (id, member_id, plan_id, coverage_start, coverage_end, active)
SELECT 
    '550e8400-e29b-41d4-a716-446655440003',
    m.id,
    '550e8400-e29b-41d4-a716-446655440002',
    '2025-01-01',
    '2025-12-31',
    true
FROM members m
WHERE m.id = '550e8400-e29b-41d4-a716-446655440001';

-- Insert accumulators for the enrollment (only if enrollment exists)
INSERT INTO accumulators (id, enrollment_id, type, tier, limit_amount, used_amount)
SELECT
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440003',
    'DEDUCTIBLE',
    'IN_NETWORK',
    1500.00,
    300.00
WHERE EXISTS (SELECT 1 FROM enrollments WHERE id = '550e8400-e29b-41d4-a716-446655440003');

INSERT INTO accumulators (id, enrollment_id, type, tier, limit_amount, used_amount)
SELECT
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440003',
    'OOP_MAX',
    'IN_NETWORK',
    6000.00,
    1200.00
WHERE EXISTS (SELECT 1 FROM enrollments WHERE id = '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample claims (only if member exists)
INSERT INTO claims (id, claim_number, member_id, provider_id, service_start_date, service_end_date, received_date, status, total_billed, total_allowed, total_plan_paid, total_member_responsibility, updated_at)
SELECT
    '550e8400-e29b-41d4-a716-446655440010',
    'C-10421',
    m.id,
    '550e8400-e29b-41d4-a716-446655440006',
    '2024-08-29',
    '2024-08-29',
    '2024-08-30',
    'PROCESSED',
    300.00,
    200.00,
    155.00,
    45.00,
    NOW()
FROM members m
WHERE m.id = '550e8400-e29b-41d4-a716-446655440001';

-- Add more sample claims for better dashboard testing
INSERT INTO claims (id, claim_number, member_id, provider_id, service_start_date, service_end_date, received_date, status, total_billed, total_allowed, total_plan_paid, total_member_responsibility, updated_at)
SELECT
    '550e8400-e29b-41d4-a716-446655440011',
    'C-10422',
    m.id,
    '550e8400-e29b-41d4-a716-446655440007',
    '2024-08-15',
    '2024-08-15',
    '2024-08-16',
    'PROCESSED',
    450.00,
    350.00,
    280.00,
    70.00,
    NOW()
FROM members m
WHERE m.id = '550e8400-e29b-41d4-a716-446655440001';

INSERT INTO claims (id, claim_number, member_id, provider_id, service_start_date, service_end_date, received_date, status, total_billed, total_allowed, total_plan_paid, total_member_responsibility, updated_at)
SELECT
    '550e8400-e29b-41d4-a716-446655440012',
    'C-10423',
    m.id,
    '550e8400-e29b-41d4-a716-446655440008',
    '2024-08-10',
    '2024-08-12',
    '2024-08-13',
    'PENDING',
    1200.00,
    900.00,
    0.00,
    900.00,
    NOW()
FROM members m
WHERE m.id = '550e8400-e29b-41d4-a716-446655440001';

INSERT INTO claims (id, claim_number, member_id, provider_id, service_start_date, service_end_date, received_date, status, total_billed, total_allowed, total_plan_paid, total_member_responsibility, updated_at)
SELECT
    '550e8400-e29b-41d4-a716-446655440013',
    'C-10424',
    m.id,
    '550e8400-e29b-41d4-a716-446655440006',
    '2024-08-05',
    '2024-08-05',
    '2024-08-06',
    'PROCESSED',
    180.00,
    120.00,
    96.00,
    24.00,
    NOW()
FROM members m
WHERE m.id = '550e8400-e29b-41d4-a716-446655440001';

INSERT INTO claims (id, claim_number, member_id, provider_id, service_start_date, service_end_date, received_date, status, total_billed, total_allowed, total_plan_paid, total_member_responsibility, updated_at)
SELECT
    '550e8400-e29b-41d4-a716-446655440014',
    'C-10425',
    m.id,
    '550e8400-e29b-41d4-a716-446655440007',
    '2024-07-28',
    '2024-07-28',
    '2024-07-29',
    'PROCESSED',
    320.00,
    250.00,
    200.00,
    50.00,
    NOW()
FROM members m
WHERE m.id = '550e8400-e29b-41d4-a716-446655440001';