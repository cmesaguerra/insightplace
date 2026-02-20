import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ReportViewer = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { token, user, company, isAdmin } = useAuth();
  const [report, setReport] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reportId && token) {
      fetchReportContent();
    }
  }, [reportId, token]);

  const fetchReportContent = async () => {
    try {
      setLoading(true);
      
      // First get report details
      const reportRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/client/reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!reportRes.ok) {
        throw new Error('No se pudo cargar el reporte');
      }

      const reportData = await reportRes.json();
      setReport(reportData);

      // Then get the HTML content
      const contentRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/client/reports/${reportId}/view`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!contentRes.ok) {
        throw new Error('No se pudo cargar el contenido del reporte');
      }

      let html = await contentRes.text();
      
      // Replace relative asset paths with authenticated API paths
      const assetBaseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/client/reports/${reportId}/asset`;
      
      // Replace src="./path" or src="path" with authenticated URLs
      html = html.replace(
        /src=["'](?!http|data:)([^"']+)["']/gi,
        (match, path) => {
          const cleanPath = path.replace(/^\.\//, '');
          return `src="${assetBaseUrl}/${cleanPath}?token=${token}"`;
        }
      );
      
      // Replace href="./path" for CSS files
      html = html.replace(
        /href=["'](?!http|#)([^"']+\.css)["']/gi,
        (match, path) => {
          const cleanPath = path.replace(/^\.\//, '');
          return `href="${assetBaseUrl}/${cleanPath}?token=${token}"`;
        }
      );

      setHtmlContent(html);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!report?.allow_download) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/client/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo descargar el archivo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = report.main_file.split('/').pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reporte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar el reporte</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/portal"
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Volver al Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <Link to="/portal" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                  {report?.title}
                </h1>
                <p className="text-sm text-gray-500">{company?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {report?.allow_download && (
                <button
                  onClick={handleDownload}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>Descargar</span>
                </button>
              )}
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
                >
                  Admin
                </Link>
              )}
              
              <Link
                to="/portal"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 bg-white">
        <div 
          className="report-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            maxWidth: '100%',
            margin: '0 auto',
            padding: '20px',
          }}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-gray-400 text-center py-4 text-sm">
        <p>© 2024 InsightPlace. Documento confidencial - No compartir.</p>
      </div>

      {/* Prevent right-click and text selection on report content */}
      <style>{`
        .report-content {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        .report-content img {
          max-width: 100%;
          height: auto;
        }
        .report-content table {
          border-collapse: collapse;
          width: 100%;
        }
        .report-content th, .report-content td {
          border: 1px solid #ddd;
          padding: 8px;
        }
      `}</style>
    </div>
  );
};

export default ReportViewer;
