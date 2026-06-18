import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { User } from '../types';
import { UserPlus, ToggleLeft, ToggleRight, Edit } from 'lucide-react';
import './Users.css';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' as 'admin' | 'operator' | 'viewer'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}/toggle-active`, { active: !user.active });
      fetchUsers();
    } catch (err) { alert('Erro ao alterar status.'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, { name: formData.name, role: formData.role });
      } else {
        await api.post('/users', formData);
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'viewer' });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao salvar usuário.');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowModal(true);
  };

  if (loading) return <div className="loading-container">Carregando usuários...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Gestão de Usuários</h1>
          <p>Controle de acessos e perfis</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', password: '', role: 'viewer' }); setShowModal(true); }}>
          <UserPlus size={18} />
          Novo Usuário
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><span className="app-name">{user.name}</span></td>
                <td>{user.email}</td>
                <td><span className="badge badge-unknown">{user.role}</span></td>
                <td>
                  <span className={`badge ${user.active ? 'badge-online' : 'badge-offline'}`}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-icon" title="Editar" onClick={() => handleEdit(user)}>
                      <Edit size={18} />
                    </button>
                    <button 
                      className="btn-icon" 
                      title={user.active ? 'Desativar' : 'Ativar'}
                      onClick={() => handleToggleActive(user)}
                    >
                      {user.active ? <ToggleRight size={24} color="#22c55e" /> : <ToggleLeft size={24} color="#94a3b8" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal card" style={{ maxWidth: '500px', width: '90%' }}>
            <h2>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="input-group">
                <label>Nome Completo</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>E-mail</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={!!editingUser} />
              </div>
              {!editingUser && (
                <div className="input-group">
                  <label>Senha</label>
                  <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
              )}
              <div className="input-group">
                <label>Perfil</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                  <option value="viewer">Visualizador</option>
                  <option value="operator">Operador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;