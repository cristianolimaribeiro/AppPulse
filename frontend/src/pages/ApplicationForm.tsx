import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const ApplicationForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    environment: 'production',
    criticality: 'medium',
    expected_status_code: 200,
    timeout_ms: 5000,
    check_interval_minutes: 5,
    monitoring_enabled: true
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      api.get(`/applications/${id}`).then(res => {
        setFormData(res.data);
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/applications/${id}`, formData);
      } else {
        await api.post('/applications', formData);
      }
      navigate('/applications');
    } catch (err) {
      alert('Erro ao salvar aplicação.');
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
        <h1>{isEdit ? 'Editar Aplicação' : 'Nova Aplicação'}</h1>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nome da Aplicação</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Ex: API de Pagamentos"
            />
          </div>

          <div className="input-group">
            <label>Descrição</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Breve descrição do propósito desta aplicação"
              rows={3}
            />
          </div>

          <div className="input-group">
            <label>URL de Health Check</label>
            <input 
              type="url" 
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
              required
              placeholder="https://api.exemplo.com/health"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label>Ambiente</label>
              <select 
                value={formData.environment}
                onChange={e => setFormData({...formData, environment: e.target.value as any})}
              >
                <option value="development">Development</option>
                <option value="homologation">Homologation</option>
                <option value="production">Production</option>
              </select>
            </div>

            <div className="input-group">
              <label>Criticidade</label>
              <select 
                value={formData.criticality}
                onChange={e => setFormData({...formData, criticality: e.target.value as any})}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label>Status Esperado</label>
              <input 
                type="number" 
                value={formData.expected_status_code}
                onChange={e => setFormData({...formData, expected_status_code: Number(e.target.value)})}
                required
              />
            </div>

            <div className="input-group">
              <label>Timeout (ms)</label>
              <input 
                type="number" 
                value={formData.timeout_ms}
                onChange={e => setFormData({...formData, timeout_ms: Number(e.target.value)})}
                required
              />
            </div>

            <div className="input-group">
              <label>Intervalo (min)</label>
              <input 
                type="number" 
                value={formData.check_interval_minutes}
                onChange={e => setFormData({...formData, check_interval_minutes: Number(e.target.value)})}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              {isEdit ? 'Salvar Alterações' : 'Criar Aplicação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;