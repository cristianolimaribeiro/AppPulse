import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Application, Check, StatusHistory, Incident } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Play, 
  Hammer, 
  History,
  Activity as ActivityIcon,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import './ApplicationDetails.css';

const ApplicationDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOperator, isAdmin } = useAuth();

  const [app, setApp] = useState<Application | null>(null);
  const [checks, setChecks] = useState<Check[]>([]);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'checks' | 'history' | 'incidents'>('checks');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [appRes, checksRes, historyRes, incidentsRes] = await Promise.all([
        api.get(`/applications/${id}`),
        api.get(`/applications/${id}/checks`),
        api.get(`/applications/${id}/status-history`),
        api.get('/incidents') // Filtered manually or via API if implemented
      ]);
      setApp(appRes.data);
      setChecks(checksRes.data);
      setHistory(historyRes.data);
      // Filter incidents for this app
      setIncidents(incidentsRes.data.filter((i: Incident) => i.application_id === Number(id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheck = async () => {
    try {
      await api.post(`/applications/${id}/check`);
      fetchData();
    } catch (err) { alert('Erro ao verificar.'); }
  };

  const handleToggleMaintenance = async () => {
    const isMaintenance = app?.current_status === 'maintenance';
    try {
      await api.patch(`/applications/${id}/maintenance`, { maintenance: !isMaintenance });
      fetchData();
    } catch (err) { alert('Erro ao alterar manutenção.'); }
  };

  const handleDelete = async () => {
    if (window.confirm('Deseja realmente excluir esta aplicação? Esta ação é irreversível.')) {
      try {
        await api.delete(`/applications/${id}`);
        navigate('/applications');
      } catch (err) { alert('Erro ao excluir.'); }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="details-header">
          <div className="skeleton" style={{ width: '300px', height: '40px' }}></div>
          <div className="skeleton" style={{ width: '200px', height: '40px' }}></div>
        </div>
        <div className="details-grid">
          <div className="skeleton" style={{ height: '300px' }}></div>
          <div className="skeleton" style={{ height: '300px' }}></div>
        </div>
      </div>
    );
  }

  if (!app) return (
    <div className="error-state" role="alert">
      <h2>Aplicação não encontrada</h2>
      <button className="btn btn-primary" onClick={() => navigate('/applications')}>Voltar para lista</button>
    </div>
  );

  const chartData = [...checks].reverse().map(c => ({
    time: new Date(c.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ms: c.response_time_ms || 0,
    status: c.status
  }));

  return (
    <div className="container">
      <div className="details-header" role="banner">
        <div className="header-left">
          <button className="btn btn-outline" onClick={() => navigate('/applications')} aria-label="Voltar para aplicações">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <div className="title-area">
            <h1>{app.name}</h1>
            <span className={`badge badge-${app.current_status}`} role="status">{app.current_status}</span>
          </div>
        </div>
        <div className="header-actions">
          {isOperator && (
            <>
              <button className="btn btn-outline" title="Verificar Agora" onClick={handleManualCheck} aria-label="Executar verificação manual agora">
                <Play size={18} aria-hidden="true" />
              </button>
              <button 
                className={`btn btn-outline ${app.current_status === 'maintenance' ? 'active-maint' : ''}`} 
                title="Modo Manutenção" 
                onClick={handleToggleMaintenance}
                aria-label={app.current_status === 'maintenance' ? "Sair do modo manutenção" : "Entrar em modo manutenção"}
              >
                <Hammer size={18} aria-hidden="true" />
              </button>
              <Link to={`/applications/${app.id}/edit`} className="btn btn-outline" title="Editar" aria-label="Editar configuração da aplicação">
                <Edit size={18} aria-hidden="true" />
              </Link>
            </>
          )}
          {isAdmin && (
            <button className="btn btn-danger" title="Excluir" onClick={handleDelete} aria-label="Excluir esta aplicação">
              <Trash2 size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="details-grid">
        <section className="info-section card" aria-labelledby="general-info-title">
          <h3 id="general-info-title">Informações Gerais</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">URL:</span>
              <a href={app.url} target="_blank" rel="noreferrer" className="value link" aria-label={`Abrir URL externa: ${app.url}`}>{app.url}</a>
            </div>
            <div className="info-item">
              <span className="label">Ambiente:</span>
              <span className="value capitalize">{app.environment}</span>
            </div>
            <div className="info-item">
              <span className="label">Criticidade:</span>
              <span className={`badge badge-${app.criticality}`}>{app.criticality}</span>
            </div>
            <div className="info-item">
              <span className="label">Timeout Configurado:</span>
              <span className="value">{app.timeout_ms}ms</span>
            </div>
            <div className="info-item">
              <span className="label">Frequência:</span>
              <span className="value">A cada {app.check_interval_minutes} min</span>
            </div>
            <div className="info-item">
              <span className="label">Monitoramento:</span>
              <span className={`badge ${app.monitoring_enabled ? 'badge-online' : 'badge-offline'}`}>
                {app.monitoring_enabled ? 'ATIVO' : 'DESATIVADO'}
              </span>
            </div>
          </div>
        </section>

        <section className="performance-section card" aria-labelledby="perf-chart-title">
          <h3 id="perf-chart-title">Latência Recente (ms)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)' }} />
                <YAxis fontSize={10} unit="ms" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: '8px', boxShadow: 'var(--shadow-card)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                  labelStyle={{ color: 'var(--text-muted)' }}
                />
                <Area type="monotone" dataKey="ms" stroke="#2563eb" fillOpacity={1} fill="url(#colorMs)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="tabs-section" role="tablist">
        <div className="tabs-header">
          <button 
            role="tab"
            aria-selected={activeTab === 'checks'}
            className={`tab-btn ${activeTab === 'checks' ? 'active' : ''}`} 
            onClick={() => setActiveTab('checks')}
          >
            <ActivityIcon size={18} aria-hidden="true" />
            Verificações
          </button>
          <button 
            role="tab"
            aria-selected={activeTab === 'history'}
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => setActiveTab('history')}
          >
            <History size={18} aria-hidden="true" />
            Timeline de Status
          </button>
          <button 
            role="tab"
            aria-selected={activeTab === 'incidents'}
            className={`tab-btn ${activeTab === 'incidents' ? 'active' : ''}`} 
            onClick={() => setActiveTab('incidents')}
          >
            <AlertTriangle size={18} aria-hidden="true" />
            Incidentes ({incidents.length})
          </button>
        </div>

        <div className="tab-content card" role="tabpanel">
          {activeTab === 'checks' && (
            <div className="table-container">
              <table aria-label="Histórico de verificações">
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Status</th>
                    <th>HTTP</th>
                    <th>Tempo</th>
                    <th>Log de Erro</th>
                  </tr>
                </thead>
                <tbody>
                  {checks.map(check => (
                    <tr key={check.id}>
                      <td>{new Date(check.checked_at).toLocaleString()}</td>
                      <td><span className={`badge badge-${check.status}`}>{check.status}</span></td>
                      <td><code>{check.http_status_code || '-'}</code></td>
                      <td><strong>{check.response_time_ms ? `${check.response_time_ms}ms` : '-'}</strong></td>
                      <td className="error-cell" title={check.error_message || ''}>{check.error_message || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="table-container">
              <table aria-label="Histórico de mudanças de status">
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Status Anterior</th>
                    <th>Novo Status</th>
                    <th>Motivo da Mudança</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id}>
                      <td>{new Date(h.created_at).toLocaleString()}</td>
                      <td><span className={`badge badge-${h.old_status}`}>{h.old_status}</span></td>
                      <td><span className={`badge badge-${h.new_status}`}>{h.new_status}</span></td>
                      <td>{h.reason || 'Alteração detectada pelo monitor'}</td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        <div className="empty-state">
                          <p>Sem histórico de mudanças registrado.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="table-container">
              <table aria-label="Incidentes vinculados">
                <thead>
                  <tr>
                    <th>Data de Início</th>
                    <th>Título</th>
                    <th>Severidade</th>
                    <th>Situação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map(i => (
                    <tr key={i.id}>
                      <td>{new Date(i.started_at).toLocaleString()}</td>
                      <td><strong>{i.title}</strong></td>
                      <td><span className={`badge badge-${i.severity}`}>{i.severity}</span></td>
                      <td><span className="badge badge-unknown">{i.status}</span></td>
                      <td>
                        <Link to={`/incidents/${i.id}/edit`} className="btn-text">Ver Detalhes</Link>
                      </td>
                    </tr>
                  ))}
                  {incidents.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state">
                          <p>Nenhum incidente registrado para este serviço.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;