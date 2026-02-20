import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminPanel = () => {
  const { user, token, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/portal');
      return;
    }
    fetchDashboardData();
  }, [isAdmin]);

  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, companiesData, usersData, reportsData, logsData] = await Promise.all([
        apiCall('/api/admin/dashboard'),
        apiCall('/api/admin/companies'),
        apiCall('/api/admin/users'),
        apiCall('/api/admin/reports'),
        apiCall('/api/admin/activity-logs')
      ]);

      setStats(statsData);
      setCompanies(companiesData);
      setUsers(usersData);
      setReports(reportsData);
      setLogs(logsData);
    } catch (error) {
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border-l-4 border-red-600 rounded-lg p-6 shadow-sm">
                  <div className="text-3xl font-bold text-red-600">{stats.total_companies}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Empresas Activas</div>
                </div>
                <div className="bg-white border-l-4 border-red-600 rounded-lg p-6 shadow-sm">
                  <div className="text-3xl font-bold text-red-600">{stats.total_users}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Usuarios Totales</div>
                </div>
                <div className="bg-white border-l-4 border-red-600 rounded-lg p-6 shadow-sm">
                  <div className="text-3xl font-bold text-red-600">{stats.total_reports}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Reportes Publicados</div>
                </div>
                <div className="bg-white border-l-4 border-red-600 rounded-lg p-6 shadow-sm">
                  <div className="text-3xl font-bold text-red-600">{stats.total_access_logs}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Registros de Acceso</div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Actividad Reciente</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {stats?.recent_activities.map((activity, index) => (
                  <div key={index} className="px-6 py-4 border-b border-gray-100 flex items-center space-x-4">
                    <div className="bg-red-100 rounded-full p-2">
                      <div className="w-4 h-4 text-red-600 text-xs flex items-center justify-center font-bold">
                        {activity.activity_type === 'login' && '👤'}
                        {activity.activity_type === 'report_upload' && '📊'}
                        {activity.activity_type === 'user_create' && '👥'}
                        {activity.activity_type === 'company_create' && '🏢'}
                        {!['login', 'report_upload', 'user_create', 'company_create'].includes(activity.activity_type) && '📋'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activity.description}</div>
                      <div className="text-sm text-gray-600">{formatDate(activity.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'companies':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h2>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                + Agregar Empresa
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          {company.description && (
                            <div className="text-sm text-gray-500">{company.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(company.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          company.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {company.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button className="text-gray-600 hover:text-gray-900">Editar</button>
                        <button className="text-red-600 hover:text-red-900">Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                + Agregar Usuario
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acceso</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => {
                    const userCompany = companies.find(c => c.id === user.company_id);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {userCompany?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.last_login ? formatDate(user.last_login) : 'Nunca'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button className="text-gray-600 hover:text-gray-900">Editar</button>
                          <button className="text-red-600 hover:text-red-900">Reset Contraseña</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Reportes</h2>
              <button 
                onClick={() => setActiveSection('upload')}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                ⬆️ Subir Reporte
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporte</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subido</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descargas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => {
                    const reportCompany = companies.find(c => c.id === report.company_id);
                    return (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{report.title}</div>
                            {report.description && (
                              <div className="text-sm text-gray-500">{report.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {reportCompany?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(report.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {report.download_count} descargas
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Vista Previa</button>
                          <button className="text-red-600 hover:text-red-900">Descargar</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'upload':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Subir Nuevo Reporte</h2>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="max-w-2xl mx-auto">
                <p className="text-gray-600 mb-6">Sube reportes confidenciales para tus clientes de manera segura.</p>
                
                <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-6xl text-gray-400 mb-4">📄</div>
                  <p className="text-lg text-gray-600 mb-2">Función de subida en desarrollo</p>
                  <p className="text-sm text-gray-500">Por favor contacta al administrador para subir archivos.</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'logs':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Registros de Actividad</h2>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.user_email || 'Desconocido'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            log.activity_type === 'login' ? 'bg-green-100 text-green-800' :
                            log.activity_type === 'failed_login' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {log.activity_type.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.ip_address || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {log.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Sección no encontrada</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <img src="/symbol.png" alt="InsightPlace" className="h-8 w-8" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>
        
        <nav className="mt-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'companies', label: 'Empresas', icon: '🏢' },
            { id: 'users', label: 'Usuarios', icon: '👥' },
            { id: 'reports', label: 'Reportes', icon: '📁' },
            { id: 'upload', label: 'Subir Reporte', icon: '⬆️' },
            { id: 'logs', label: 'Registros', icon: '📋' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors border-l-4 ${
                activeSection === item.id
                  ? 'bg-red-50 text-red-600 border-red-600'
                  : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-red-600'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-64 p-6 border-t">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">{user?.full_name}</div>
              <div className="text-xs text-gray-600">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPanel;
