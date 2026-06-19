import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Application } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Play, 
  Power, 
  ExternalLink
} from 'lucide-react';
import './Applications.css';

const Applications: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { isOperator } = useAuth();

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await api.get('/applications');
      setApps(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerCheck = async (id: number) => {
    try {
      await api.post(`/applications/${id}/check`);
      fetchApps();
    } catch (err) {
      alert('Erro ao executar verificação manual.');
    }
  };

  const handleToggleMonitoring = async (id: number, enabled: boolean) => {
    try {
      await api.patch(`/applications/${id}/toggle-monitoring`, { enabled: !enabled });
      fetchApps();
    } catch (err) {
      alert('Erro ao alterar monitoramento.');
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                         app.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === '' || app.current_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <div className="skeleton" style={{ width: '200px', height: '32px' }}></div>
          <div className="skeleton" style={{ width: '150px', height: '44px' }}></div>
        </div>
        <div className="card skeleton" style={{ height: '60px', marginBottom: '24px' }}></div>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Nome</th><th>Ambiente</th><th>Status</th><th>Criticidade</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td colSpan={5}><div className="skeleton" style={{ height: '40px' }}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header" role="banner">
        <div>
          <h1>Aplicações</h1>
          <p>Gerencie e monitore seus serviços</p>
        </div>
        {isOperator && (
          <Link to="/applications/new" className="btn btn-primary" aria-label="Cadastrar nova aplicação">
            <Plus size={18} aria-hidden="true" />
            Nova Aplicação
          </Link>
        )}
      </div>

      <div className="filters-bar card" role="search" aria-label="Filtros de aplicações">
        <div className="search-input">
          <Search size={18} aria-hidden="true" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou URL..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar aplicações"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por status"
        >
          <option value="">Todos os Status</option>
          <option value="online">Online</option>
          <option value="degraded">Degradado</option>
          <option value="offline">Offline</option>
          <option value="maintenance">Manutenção</option>
        </select>
      </div>

      <div className="table-container">
        <table aria-label="Lista de aplicações monitoradas">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Ambiente</th>
              <th scope="col">Status</th>
              <th scope="col">Criticidade</th>
              <th scope="col">Última Verificação</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <tr key={app.id}>
                <td>
                  <div className="app-name-cell">
                    <span className="app-name">{app.name}</span>
                    <span className="app-url">{app.url}</span>
                  </div>
                </td>
                <td><span className="env-tag">{app.environment}</span></td>
                <td>
                  <div className="status-dot-container" role="status">
                    <span className={`status-dot ${app.current_status}`}></span>
                    <span style={{ color: `var(--status-${app.current_status})`, textTransform: 'capitalize' }}>
                      {app.current_status}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${app.criticality}`}>
                    {app.criticality}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {app.last_checked_at 
                      ? new Date(app.last_checked_at).toLocaleString() 
                      : 'Nunca'
                    }
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <Link 
                      to={`/applications/${app.id}`} 
                      className="btn-icon" 
                      title="Ver Detalhes"
                      aria-label={`Ver detalhes da aplicação ${app.name}`}
                    >
                      <ExternalLink size={18} aria-hidden="true" />
                    </Link>
                    {isOperator && (
                      <>
                        <button 
                          className="btn-icon" 
                          title="Verificar agora"
                          onClick={() => handleTriggerCheck(app.id)}
                          disabled={app.current_status === 'maintenance'}
                          aria-label={`Executar verificação manual em ${app.name}`}
                        >
                          <Play size={18} aria-hidden="true" />
                        </button>
                        <button 
                          className={`btn-icon ${app.monitoring_enabled ? 'text-primary' : 'text-muted'}`}
                          title={app.monitoring_enabled ? 'Desativar monitoramento' : 'Ativar monitoramento'}
                          onClick={() => handleToggleMonitoring(app.id, app.monitoring_enabled)}
                          aria-label={`${app.monitoring_enabled ? 'Desativar' : 'Ativar'} monitoramento em ${app.name}`}
                        >
                          <Power size={18} aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredApps.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <Search size={48} aria-hidden="true" />
                    <p>Nenhuma aplicação encontrada com os filtros atuais.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;