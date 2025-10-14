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