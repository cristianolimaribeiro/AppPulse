export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  active: boolean;
  created_at?: string;
}

export interface Application {
  id: number;
  name: string;
  description: string;
  url: string;
  environment: 'development' | 'homologation' | 'production';
  criticality: 'low' | 'medium' | 'high' | 'critical';
  expected_status_code: number;
  timeout_ms: number;
  check_interval_minutes: number;
  monitoring_enabled: boolean;
  current_status: 'online' | 'degraded' | 'offline' | 'maintenance' | 'unknown';
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Check {
  id: number;
  application_id: number;
  status: string;
  http_status_code: number | null;
  response_time_ms: number | null;
  error_message: string | null;
  checked_at: string;
}

export interface Incident {
  id: number;
  application_id: number;
  application_name?: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'monitoring' | 'resolved';
  started_at: string;
  resolved_at: string | null;
  created_by: number;
  created_by_name?: string;
  created_at: string;
}

export interface StatusHistory {
  id: number;
  application_id: number;
  old_status: string;
  new_status: string;
  reason: string | null;
  created_at: string;
}

export interface DashboardData {
  applications: {
    total: string;
    online: string;
    degraded: string;
    offline: string;
    maintenance: string;
    unknown: string;
  };
  incidents: {
    open: number;
  };
  environments: {
    environment: string;
    count: string;
  }[];
  average_response_time_ms: number;
  recent_incidents: Partial<Incident>[];
  latest_checks: Partial<Check & { application_name: string }>[];
}