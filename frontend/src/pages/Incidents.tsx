import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Incident } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search } from 'lucide-react';

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { isOperator } = useAuth();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await api.get('/incidents');
      setIncidents(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredIncidents = incidents.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase()) || 
                         (i.application_name?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === '' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="loading-container">Carregando incidentes...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Incidentes</h1>
          <p>Registro de falhas e investigações</p>
        </div>
        {isOperator && (
          <Link to="/incidents/new" className="btn btn-primary">
            <Plus size={18} />
            Novo Incidente
          </Link>
        )}
      </div>

      <div className="filters-bar card">
        <div className="search-input">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título ou aplicação..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos os Status</option>
          <option value="open">Aberto</option>
          <option value="investigating">Investigando</option>
          <option value="monitoring">Monitorando</option>
          <option value="resolved">Resolvido</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Início</th>
              <th>Aplicação</th>
              <th>Título</th>
              <th>Severidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.map((incident) => (
              <tr key={incident.id}>
                <td>{new Date(incident.started_at).toLocaleString()}</td>
                <td><span className="app-name">{incident.application_name}</span></td>
                <td>{incident.title}</td>
                <td>
                  <span className={`badge badge-${incident.severity}`}>
                    {incident.severity}
                  </span>
                </td>
                <td>
                  <span className="badge badge-unknown">
                    {incident.status}
                  </span>
                </td>
                <td>
                  <Link to={`/incidents/${incident.id}/edit`} className="btn-text">
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {filteredIncidents.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <p>Nenhum incidente encontrado</p>
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

export default Incidents;