import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Application } from '../types';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

const IncidentForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    application_id: '',
    title: '',
    description: '',
    severity: 'medium',
    status: 'open'
  });

  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    api.get('/applications').then(res => setApps(res.data));
    
    if (isEdit) {
      api.get(`/incidents/${id}`).then(res => {
        setFormData({
          application_id: res.data.application_id.toString(),
          title: res.data.title,
          description: res.data.description,
          severity: res.data.severity,
          status: res.data.status
        });
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/incidents/${id}`, formData);
      } else {
        await api.post('/incidents', formData);
      }
      navigate('/incidents');
    } catch (err) {
      alert('Erro ao salvar incidente.');
    }
  };

  const handleResolve = async () => {
    try {
      await api.patch(`/incidents/${id}/resolve`);
      navigate('/incidents');
    } catch (err) {
      alert('Erro ao resolver incidente.');
    }
  };

  if (loading) return <div className="loading-container">Carregando...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Voltar
        </button>
        <h1>{isEdit ? 'Editar Incidente' : 'Novo Incidente'}</h1>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Aplicação Afetada</label>
            <select 
              value={formData.application_id}
              onChange={e => setFormData({...formData, application_id: e.target.value})}
              required
              disabled={isEdit}
            >
              <option value="">Selecione uma aplicação</option>
              {apps.map(app => (
                <option key={app.id} value={app.id}>{app.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Título do Incidente</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
              placeholder="Ex: API de Pagamentos instável"
            />
          </div>

          <div className="input-group">
            <label>Descrição e Timeline</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
              placeholder="Detalhes sobre a falha e passos tomados..."
              rows={6}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label>Severidade</label>
              <select 
                value={formData.severity}
                onChange={e => setFormData({...formData, severity: e.target.value as any})}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>

            <div className="input-group">
              <label>Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="open">Aberto</option>
                <option value="investigating">Investigando</option>
                <option value="monitoring">Monitorando</option>
                <option value="resolved">Resolvido</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
            {isEdit && formData.status !== 'resolved' && (
              <button type="button" className="btn btn-success" onClick={handleResolve}>
                <CheckCircle size={18} />
                Resolver Incidente
              </button>
            )}
            <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={18} />
                Salvar Incidente
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;