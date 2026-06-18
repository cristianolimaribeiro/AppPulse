CREATE TABLE IF NOT EXISTS ap_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ap_applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(2048) NOT NULL,
    environment VARCHAR(50) NOT NULL DEFAULT 'production',
    criticality VARCHAR(50) NOT NULL DEFAULT 'medium',
    expected_status_code INTEGER NOT NULL DEFAULT 200,
    timeout_ms INTEGER NOT NULL DEFAULT 5000,
    check_interval_minutes INTEGER NOT NULL DEFAULT 5,
    monitoring_enabled BOOLEAN NOT NULL DEFAULT true,
    current_status VARCHAR(50) NOT NULL DEFAULT 'unknown',
    last_checked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ap_checks (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES ap_applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    http_status_code INTEGER,
    response_time_ms INTEGER,
    error_message TEXT,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ap_incidents (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES ap_applications(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'medium',
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_by INTEGER REFERENCES ap_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ap_status_history (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES ap_applications(id) ON DELETE CASCADE,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ap_applications_monitoring ON ap_applications(monitoring_enabled, current_status);
CREATE INDEX IF NOT EXISTS idx_ap_checks_application_id ON ap_checks(application_id);
CREATE INDEX IF NOT EXISTS idx_ap_incidents_application_id ON ap_incidents(application_id);
CREATE INDEX IF NOT EXISTS idx_ap_incidents_status ON ap_incidents(status);
CREATE INDEX IF NOT EXISTS idx_ap_status_history_application_id ON ap_status_history(application_id);