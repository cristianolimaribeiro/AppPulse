-- Senha para todos: 123456 (hash bcrypt: $2a$10$2vJDZcF3PtAkzRgPHs2giOTUdnhaHUb8MuuLRXjJcyAfaHcrJglzC)
INSERT INTO ap_users (name, email, password_hash, role, active) VALUES
('Admin User', 'admin@apppulse.com', '$2a$10$2vJDZcF3PtAkzRgPHs2giOTUdnhaHUb8MuuLRXjJcyAfaHcrJglzC', 'admin', true),
('Operador', 'operador@apppulse.com', '$2a$10$2vJDZcF3PtAkzRgPHs2giOTUdnhaHUb8MuuLRXjJcyAfaHcrJglzC', 'operator', true),
('Visualizador', 'viewer@apppulse.com', '$2a$10$2vJDZcF3PtAkzRgPHs2giOTUdnhaHUb8MuuLRXjJcyAfaHcrJglzC', 'viewer', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO ap_applications (name, description, url, environment, criticality, expected_status_code, timeout_ms, check_interval_minutes, monitoring_enabled, current_status) VALUES
('API Principal', 'Core API do sistema', 'https://jsonplaceholder.typicode.com/posts/1', 'production', 'critical', 200, 5000, 5, true, 'online'),
('Site Institucional', 'Landing page pública', 'https://example.com', 'production', 'medium', 200, 5000, 5, true, 'unknown'),
('Painel Legado', 'Sistema antigo', 'https://httpstat.us/500', 'production', 'low', 200, 5000, 5, true, 'offline')
ON CONFLICT DO NOTHING;

INSERT INTO ap_checks (application_id, status, http_status_code, response_time_ms) VALUES
(1, 'online', 200, 120),
(1, 'online', 200, 150),
(2, 'online', 200, 300),
(3, 'offline', 500, 200);

INSERT INTO ap_incidents (application_id, title, description, severity, status, created_by) VALUES
(3, 'Sistema antigo fora do ar', 'O sistema retornou erro 500 nas últimas verificações.', 'low', 'open', 1);

INSERT INTO ap_status_history (application_id, old_status, new_status, reason) VALUES
(1, 'unknown', 'online', 'Primeira verificação bem sucedida'),
(2, 'unknown', 'online', 'Primeira verificação bem sucedida'),
(3, 'unknown', 'offline', 'Retornou 500 Internal Server Error');