import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Upload Report Section Component
const UploadReportSection = ({ companies, token, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    setError('');
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Por favor ingresa un título para el reporte');
      return;
    }
    
    if (!selectedCompany) {
      setError('Por favor selecciona una empresa');
      return;
    }
    
    if (files.length === 0) {
      setError('Por favor selecciona al menos un archivo');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('company_id', selectedCompany);
      
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/reports/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al subir el reporte');
      }

      const result = await response.json();
      setSuccess(`Reporte "${title}" subido exitosamente. ${result.files_uploaded} archivo(s) subido(s).`);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedCompany('');
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh dashboard data
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Subir Nuevo Reporte</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleUpload} className="max-w-2xl mx-auto space-y-6">
          <p className="text-gray-600">Sube reportes confidenciales para tus clientes de manera segura.</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del Reporte *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ej: Análisis de Mercado Q4 2024"
              disabled={uploading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Descripción breve del contenido del reporte..."
              disabled={uploading}
            />
          </div>

          {/* Company Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa Destinataria *
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={uploading}
            >
              <option value="">Seleccionar empresa...</option>
              {companies.filter(c => c.name !== 'InsightPlace Admin').map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Archivos *
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-red-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".html,.pdf,.png,.jpg,.jpeg,.gif,.csv,.xlsx,.docx,.zip"
                disabled={uploading}
              />
              <div className="text-4xl text-gray-400 mb-2">📁</div>
              <p className="text-gray-600 mb-1">
                Haz clic para seleccionar archivos o arrastra aquí
              </p>
              <p className="text-xs text-gray-500">
                Formatos permitidos: HTML, PDF, PNG, JPG, GIF, CSV, XLSX, DOCX, ZIP
              </p>
            </div>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Archivos seleccionados ({files.length})
              </h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-white p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">
                        {file.name.endsWith('.html') ? '🌐' :
                         file.name.endsWith('.pdf') ? '📕' :
                         file.name.match(/\.(png|jpg|jpeg|gif)$/i) ? '🖼️' :
                         file.name.match(/\.(xlsx|csv)$/i) ? '📊' :
                         file.name.endsWith('.zip') ? '📦' : '📄'}
                      </span>
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={uploading}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-xs text-gray-500">
                Tamaño total: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || files.length === 0}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Subiendo...</span>
              </>
            ) : (
              <>
                <span>⬆️</span>
                <span>Subir Reporte</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

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
  
  // Modal states
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  
  // Form states
  const [newCompany, setNewCompany] = useState({ name: '', description: '' });
  const [newUser, setNewUser] = useState({ email: '', full_name: '', password: '', company_id: '', role: 'client' });

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
        return <UploadReportSection companies={companies} token={token} onUploadSuccess={fetchDashboardData} />;
        
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
