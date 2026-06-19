import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { DashboardData } from '../types';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  AlertTriangle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getIncidentStatusClass = (status?: string) => {
    if (status === 'resolved') return 'online';
    if (status === 'investigating' || status === 'monitoring') return 'degraded';
    return 'offline';
  };

  const getIncidentStatusLabel = (status?: string) => {
    if (status === 'open') return 'Aberto';
    if (status === 'investigating') return 'Investigando';
    if (status === 'monitoring') return 'Monitorando';
    if (status === 'resolved') return 'Resolvido';
    return status || '';
  };

  const getLatencyClass = (ms: number) => {
    if (ms < 50) return 'latency-low';
    if (ms < 200) return 'latency-med';
    return 'latency-high';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="dashboard-header">
          <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '8px' }}></div>
          <div className="skeleton" style={{ width: '300px', height: '20px' }}></div>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card skeleton" style={{ height: '100px' }}></div>
          ))}
        </div>
        <div className="charts-grid">
          <div className="chart-card skeleton" style={{ height: '300px' }}></div>
          <div className="chart-card skeleton" style={{ height: '300px' }}></div>
          <div className="chart-card skeleton" style={{ height: '300px' }}></div>
        </div>
      </div>
    );
  }

  if (error || !data) return (
    <div className="error-state" role="alert">
      <AlertCircle size={48} />
      <h2>Erro ao carregar dashboard</h2>
      <p>Verifique sua conexão e tente novamente.</p>
      <button className="btn btn-primary" onClick={fetchDashboard} style={{ marginTop: '20px' }}>Tentar Novamente</button>
    </div>
  );

  const statusData = [
    { name: 'Online', value: parseInt(data.applications.online), color: '#10b981' },
    { name: 'Degradado', value: parseInt(data.applications.degraded), color: '#f59e0b' },
    { name: 'Offline', value: parseInt(data.applications.offline), color: '#ef4444' },
    { name: 'Manutenção', value: parseInt(data.applications.maintenance), color: '#8b5cf6' },
    { name: 'Desconhecido', value: parseInt(data.applications.unknown), color: '#4b5563' },
  ].filter(s => s.value > 0);

  const envData = data.environments.map(e => ({
    name: e.environment.charAt(0).toUpperCase() + e.environment.slice(1),
    quantidade: parseInt(e.count)
  }));

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral da saúde das aplicações em tempo real</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" role="status" aria-label="Aplicações Online">
          <div className="stat-card-header">
            <span className="stat-card-title">Online</span>
            <div className="stat-card-icon-wrapper online" aria-hidden="true"><CheckCircle2 /></div>
          </div>
          <span className="stat-card-value">{data.applications.online}</span>
          <div className="stat-card-footer">
            <span style={{ color: 'var(--status-online)', fontSize: '11px', fontWeight: 600 }}>100% Operacional</span>
          </div>
        </div>

        <div className="stat-card" role="status" aria-label="Aplicações Degradadas">
          <div className="stat-card-header">
            <span className="stat-card-title">Degradadas</span>
            <div className="stat-card-icon-wrapper degraded" aria-hidden="true"><Clock /></div>
          </div>
          <span className="stat-card-value">{data.applications.degraded}</span>
          <div className="stat-card-footer">
            <span style={{ color: parseInt(data.applications.degraded) > 0 ? 'var(--status-degraded)' : 'var(--text-dim)', fontSize: '11px', fontWeight: 600 }}>
              {parseInt(data.applications.degraded) > 0 ? 'Latência Instável' : 'Sem lentidão detectada'}
            </span>
          </div>
        </div>

        <div className="stat-card" role="status" aria-label="Aplicações Offline">
          <div className="stat-card-header">
            <span className="stat-card-title">Offline</span>
            <div className="stat-card-icon-wrapper offline" aria-hidden="true"><AlertCircle /></div>
          </div>
          <span className="stat-card-value">{data.applications.offline}</span>
          <div className="stat-card-footer">
            <span style={{ color: parseInt(data.applications.offline) > 0 ? 'var(--status-offline)' : 'var(--text-dim)', fontSize: '11px', fontWeight: 600 }}>
              {parseInt(data.applications.offline) > 0 ? 'Requer atenção imediata' : 'Sem falhas ativas'}
            </span>
          </div>
        </div>

        <div className="stat-card" role="status" aria-label="Incidentes Abertos">
          <div className="stat-card-header">
            <span className="stat-card-title">Incidentes</span>
            <div className="stat-card-icon-wrapper incidents" aria-hidden="true"><AlertTriangle /></div>
          </div>
          <span className="stat-card-value">{data.incidents.open}</span>
          <div className="stat-card-footer">
            <span style={{ color: data.incidents.open > 0 ? 'var(--status-offline)' : 'var(--text-dim)', fontSize: '11px', fontWeight: 600 }}>
              {data.incidents.open > 0 ? 'Incidentes em aberto' : 'Sem incidentes ativos'}
            </span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <section className="chart-card card" aria-labelledby="status-chart-title">
          <h3 id="status-chart-title">Status Distribution</h3>
          <div className="chart-container" style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 8px ${entry.color}44)` }} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#11131c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center-widget" style={{
              position: 'absolute',
              top: '42%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                {data.applications.online} / {data.applications.total}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ativos
              </div>
            </div>
          </div>
        </section>

        <section className="chart-card card" aria-labelledby="env-chart-title">
          <h3 id="env-chart-title">Applications by Environment</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={envData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#11131c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                <Bar dataKey="quantidade" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="chart-card card highlight" aria-labelledby="perf-title">
          <h3 id="perf-title">Tempo de Resposta</h3>
          <div className="big-metric">
            <span className="metric-value">{data.average_response_time_ms}</span>
            <span className="metric-unit">ms</span>
          </div>
          <p style={{ opacity: 0.8, fontSize: '12px', marginTop: '4px' }}>Média das últimas 24h</p>
          <Activity className="metric-icon" size={48} aria-hidden="true" />
        </section>
      </div>

      <div className="dashboard-bottom-grid">
        <section className="card" aria-labelledby="incidents-title">
          <div className="card-header">
            <h3 id="incidents-title">Incidentes Recentes</h3>
            <Link to="/incidents" className="btn-text-premium" aria-label="Ver todos os incidentes">Ver todos <span>→</span></Link>
          </div>
          <div className="table-container mini">
            <table>
              <thead>
                <tr>
                  <th>Aplicação</th>
                  <th>Título</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_incidents.map((incident) => {
                  const sClass = getIncidentStatusClass(incident.status);
                  const sLabel = getIncidentStatusLabel(incident.status);
                  return (
                    <tr key={incident.id}>
                      <td><span className="app-name">{incident.application_name}</span></td>
                      <td>{incident.title}</td>
                      <td>
                        <div className="status-dot-container">
                          <span className={`status-dot ${sClass}`}></span>
                          <span style={{ color: `var(--status-${sClass})` }}>{sLabel}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {data.recent_incidents.length === 0 && (
                  <tr><td colSpan={3} className="empty">Nenhum incidente ativo</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card" aria-labelledby="checks-title">
          <div className="card-header">
            <h3 id="checks-title">Últimas Verificações</h3>
            <Link to="/applications" className="btn-text-premium" aria-label="Ver todas as aplicações">Ver todas <span>→</span></Link>
          </div>
          <div className="table-container mini">
            <table>
              <thead>
                <tr>
                  <th>Aplicação</th>
                  <th>Status</th>
                  <th>Tempo</th>
                </tr>
              </thead>
              <tbody>
                {data.latest_checks.map((check) => (
                  <tr key={check.id}>
                    <td><span className="app-name">{check.application_name}</span></td>
                    <td>
                      <div className="status-dot-container">
                        <span className={`status-dot ${check.status}`}></span>
                        <span style={{ color: `var(--status-${check.status})`, textTransform: 'capitalize' }}>
                          {check.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={getLatencyClass(check.response_time_ms || 0)}>
                        {check.response_time_ms}ms
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;