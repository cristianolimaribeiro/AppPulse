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
    { name: 'Online', value: parseInt(data.applications.online), color: '#22c55e' },
    { name: 'Degradado', value: parseInt(data.applications.degraded), color: '#f59e0b' },
    { name: 'Offline', value: parseInt(data.applications.offline), color: '#ef4444' },
    { name: 'Manutenção', value: parseInt(data.applications.maintenance), color: '#6366f1' },
    { name: 'Desconhecido', value: parseInt(data.applications.unknown), color: '#94a3b8' },
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
          <div className="stat-icon online" aria-hidden="true"><CheckCircle2 /></div>
          <div className="stat-content">
            <span className="stat-label">Online</span>
            <span className="stat-value">{data.applications.online}</span>
          </div>
        </div>
        <div className="stat-card" role="status" aria-label="Aplicações Degradadas">
          <div className="stat-icon degraded" aria-hidden="true"><Clock /></div>
          <div className="stat-content">
            <span className="stat-label">Degradadas</span>
            <span className="stat-value">{data.applications.degraded}</span>
          </div>
        </div>
        <div className="stat-card" role="status" aria-label="Aplicações Offline">
          <div className="stat-icon offline" aria-hidden="true"><AlertCircle /></div>
          <div className="stat-content">
            <span className="stat-label">Offline</span>
            <span className="stat-value">{data.applications.offline}</span>
          </div>
        </div>
        <div className="stat-card" role="status" aria-label="Incidentes Abertos">
          <div className="stat-icon incidents" aria-hidden="true"><AlertTriangle /></div>
          <div className="stat-content">
            <span className="stat-label">Incidentes</span>
            <span className="stat-value">{data.incidents.open}</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <section className="chart-card card" aria-labelledby="status-chart-title">
          <h3 id="status-chart-title">Status Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
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
                  contentStyle={{ backgroundColor: '#15171e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="chart-card card" aria-labelledby="env-chart-title">
          <h3 id="env-chart-title">Applications by Environment</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={envData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3d5afe" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#3d5afe" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: '#15171e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
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
            <Link to="/incidents" className="btn-text" aria-label="Ver todos os incidentes">Ver todos</Link>
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
                {data.recent_incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td><span className="app-name">{incident.application_name}</span></td>
                    <td>{incident.title}</td>
                    <td><span className="badge badge-unknown">{incident.status}</span></td>
                  </tr>
                ))}
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
            <Link to="/applications" className="btn-text" aria-label="Ver todas as aplicações">Ver todas</Link>
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
                    <td><span className={`badge badge-${check.status}`}>{check.status}</span></td>
                    <td><strong>{check.response_time_ms}ms</strong></td>
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