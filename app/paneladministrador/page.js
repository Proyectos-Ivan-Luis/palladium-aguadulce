'use client';

import React, { useState, useEffect } from 'react';

export default function PanelAdministrador() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUbicacion, setSelectedUbicacion] = useState('');

  // Cargar contraseña guardada en localStorage si existe
  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_token');
    if (savedPassword) {
      verifySavedPassword(savedPassword);
    }
  }, []);

  const verifySavedPassword = async (savedPassword) => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads', {
        headers: {
          'x-admin-password': encodeURIComponent(savedPassword)
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
        setIsAuthorized(true);
        setPassword(savedPassword); // Mantener en estado local
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setSubmittingAuth(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        headers: {
          'x-admin-password': encodeURIComponent(password)
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLeads(data);
        setIsAuthorized(true);
        localStorage.setItem('admin_token', password);
      } else {
        setError('Contraseña incorrecta. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de red. No se pudo validar la contraseña.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthorized(false);
    setLeads([]);
    setPassword('');
  };

  // Toggles de Estado en Base de Datos
  const handleToggleClaseGratuita = async (id, currentValue) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': encodeURIComponent(password)
        },
        body: JSON.stringify({
          id,
          clase_gratuita: !currentValue
        })
      });

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === id ? { ...lead, clase_gratuita: !currentValue } : lead
        ));
      } else {
        alert('No se pudo actualizar el estado de la clase gratuita.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al actualizar clase gratuita.');
    }
  };

  const handleToggleDescuento = async (id, currentValue) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': encodeURIComponent(password)
        },
        body: JSON.stringify({
          id,
          descuento_aplicado: !currentValue
        })
      });

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === id ? { ...lead, descuento_aplicado: !currentValue } : lead
        ));
      } else {
        alert('No se pudo actualizar el estado del descuento.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al actualizar el descuento.');
    }
  };

  const handleDeleteLead = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el lead de "${nombre}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/leads?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': encodeURIComponent(password)
        }
      });

      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== id));
      } else {
        alert('No se pudo eliminar el registro.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al intentar eliminar.');
    }
  };

  // Formateador de fechas
  const formatDate = (isoString) => {
    if (!isoString) return 'Sin fecha';
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrado de Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.apellidos && lead.apellidos.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lead.telefono.includes(searchTerm);
    const matchesUbicacion = selectedUbicacion ? lead.ubicacion === selectedUbicacion : true;
    return matchesSearch && matchesUbicacion;
  });

  // Estadísticas
  const totalLeads = leads.length;
  
  const leadsHoy = leads.filter(lead => {
    const leadDate = new Date(lead.fecha);
    const today = new Date();
    return (
      leadDate.getDate() === today.getDate() &&
      leadDate.getMonth() === today.getMonth() &&
      leadDate.getFullYear() === today.getFullYear()
    );
  }).length;

  // Sedes desglose
  const ubicacionesCount = leads.reduce((acc, lead) => {
    acc[lead.ubicacion] = (acc[lead.ubicacion] || 0) + 1;
    return acc;
  }, {});



  // Exportar a CSV
  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;
    
    const headers = ['ID', 'Nombre', 'Apellidos', 'Teléfono', 'Sede', 'Disciplina', 'Clase Gratuita', 'Descuento Aplicado', 'Fecha Registro'];
    
    const rows = filteredLeads.map(lead => [
      lead.id,
      `"${lead.nombre.replace(/"/g, '""')}"`,
      `"${(lead.apellidos || '').replace(/"/g, '""')}"`,
      lead.telefono,
      `"${lead.ubicacion}"`,
      `"${lead.disciplina}"`,
      lead.clase_gratuita ? 'SÍ' : 'NO',
      lead.descuento_aplicado ? 'SÍ' : 'NO',
      formatDate(lead.fecha)
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_palladium_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Verificando credenciales de administrador...</p>
        <style jsx>{`
          .admin-loading-container {
            background-color: #F8F9FA;
            color: #1A1A1A;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: sans-serif;
          }
          .spinner {
            border: 4px solid rgba(0,0,0,0.05);
            border-top: 4px solid #1A1A1A;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 1.5rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="admin-auth-bg">
        <div className="admin-auth-card">
          <div className="brand-logo">
            PALLADIUM <span>PANEL</span>
          </div>
          <h2>Acceso Restringido</h2>
          <p>Introduce la contraseña del administrador para ver los leads registrados.</p>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <input
                type="password"
                placeholder="Contraseña del Administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" disabled={submittingAuth} className="btn-submit">
              {submittingAuth ? 'Verificando...' : 'Acceder al Panel'}
            </button>
          </form>
        </div>
        
        <style jsx>{`
          .admin-auth-bg {
            background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            font-family: 'Montserrat', sans-serif;
            color: #1A1A1A;
          }
          .admin-auth-card {
            background: #FFFFFF;
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 16px;
            padding: 2.5rem 2rem;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            text-align: center;
          }
          .brand-logo {
            font-size: 1.6rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            margin-bottom: 1.5rem;
            color: #000000;
          }
          .brand-logo span {
            font-weight: 300;
            color: #666666;
          }
          h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.6rem;
            margin-bottom: 0.75rem;
            letter-spacing: -0.01em;
            color: #000000;
          }
          p {
            color: #666666;
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 2rem;
          }
          .form-group {
            margin-bottom: 1.25rem;
          }
          input {
            width: 100%;
            background: #F8F9FA;
            border: 1.5px solid #CED4DA;
            border-radius: 8px;
            padding: 1rem;
            color: #1A1A1A;
            font-size: 1rem;
            transition: all 0.2s;
            text-align: center;
          }
          input:focus {
            outline: none;
            border-color: #000000;
            background: #FFFFFF;
            box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
          }
          .error-message {
            color: #D32F2F;
            font-size: 0.85rem;
            margin-bottom: 1.25rem;
            font-weight: 600;
          }
          .btn-submit {
            width: 100%;
            background: #000000;
            color: #FFFFFF;
            font-weight: 700;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #000000;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-submit:hover {
            background: transparent;
            color: #000000;
          }
          .btn-submit:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Cabecera del Panel */}
        <header className="admin-header">
          <div className="logo-group">
            <h1>PALLADIUM</h1>
            <span className="subtitle">PANEL DE CONTROL</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </header>

        {/* Tarjetas de Métricas Estadísticas */}
        <section className="metrics-section">
          <div className="metric-card">
            <div className="metric-icon total">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div className="metric-info">
              <h3>Total Alumnos</h3>
              <div className="metric-value">{totalLeads}</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon today">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div className="metric-info">
              <h3>Inscritos Hoy</h3>
              <div className="metric-value">{leadsHoy}</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon locations">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div className="metric-info">
              <h3>Sedes</h3>
              <div className="metric-details">
                <div>Aguadulce: <strong>{ubicacionesCount['Aguadulce'] || 0}</strong></div>
                <div>Roquetas: <strong>{ubicacionesCount['Roquetas de Mar'] || 0}</strong></div>
                <div>El Ejido: <strong>{ubicacionesCount['El Ejido'] || 0}</strong></div>
              </div>
            </div>
          </div>


        </section>

        {/* Barra de Búsqueda y Filtros */}
        <section className="filter-bar">
          <div className="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Buscar lead por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters-group">
            <select
              value={selectedUbicacion}
              onChange={(e) => setSelectedUbicacion(e.target.value)}
            >
              <option value="">Todas las Sedes</option>
              <option value="Aguadulce">Aguadulce</option>
              <option value="Roquetas de Mar">Roquetas de Mar</option>
              <option value="El Ejido">El Ejido</option>
            </select>



            <button 
              onClick={exportToCSV} 
              className="btn-export"
              disabled={filteredLeads.length === 0}
              title="Descargar listado en Excel / CSV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Exportar CSV ({filteredLeads.length})
            </button>
          </div>
        </section>

        {/* Tabla / Lista de leads */}
        <section className="leads-list-section">
          {filteredLeads.length === 0 ? (
            <div className="no-leads-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <p>No se encontraron registros con los filtros seleccionados.</p>
            </div>
          ) : (
            <>
              {/* Escritorio: Tabla */}
              <div className="table-responsive">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Apellidos</th>
                      <th>Teléfono</th>
                      <th>Preferencia</th>
                      <th className="text-center">Seguimiento</th>
                      <th>Fecha Registro</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => {
                      const cleanPhone = lead.telefono.replace(/\s+/g, '');
                      const isNewToday = new Date(lead.fecha).toDateString() === new Date().toDateString();
                      const whatsappText = encodeURIComponent(`¡Hola ${lead.nombre}! Te escribimos de Palladium. Hemos recibido tu solicitud para las clases de ${lead.disciplina} en ${lead.ubicacion}. ¿Cuándo te vendría bien hacer la clase de prueba gratuita?`);
                      const whatsappLink = `https://wa.me/34${cleanPhone}?text=${whatsappText}`;

                      return (
                        <tr key={lead.id} className={isNewToday ? 'row-new' : ''}>
                          <td>
                            <div className="name-cell">
                              <span className="avatar">
                                {lead.nombre.charAt(0).toUpperCase()}
                              </span>
                              <div>
                                <span className="lead-name">{lead.nombre}</span>
                                {isNewToday && <span className="badge-new">NUEVO</span>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="lead-apellidos" style={{ fontWeight: '600', color: '#1A1A1A' }}>{lead.apellidos || '-'}</span>
                          </td>
                          <td>
                            <div className="phone-cell">
                              <span className="phone-number">{lead.telefono}</span>
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-whatsapp"
                                title="Contactar por WhatsApp"
                              >
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style={{marginRight: '4px'}}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.9 9.9 0 00-6.98-2.879C6.18.961 1.756 5.334 1.752 10.763c0 1.677.452 3.313 1.312 4.757L2.092 20.8l5.555-1.446-.99-.59z"/></svg>
                                WhatsApp
                              </a>
                            </div>
                          </td>
                          <td>
                            <div className="pref-cell">
                              <span className="lead-ubicacion">{lead.ubicacion}</span>
                              <span className={`badge-style ${lead.disciplina.toLowerCase().replace(/\s+/g, '-')}`}>
                                {lead.disciplina.toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="seguimiento-buttons">
                              {/* Botón Clase Gratuita */}
                              <button
                                onClick={() => handleToggleClaseGratuita(lead.id, lead.clase_gratuita)}
                                className={`btn-status class ${lead.clase_gratuita ? 'active' : ''}`}
                                title={lead.clase_gratuita ? "Desmarcar clase gratuita" : "Marcar clase gratuita realizada"}
                              >
                                {lead.clase_gratuita ? 'Clase Disfrutada ✓' : 'Clase Gratuita'}
                              </button>

                              {/* Botón Aplicar Descuento / Descuento Aplicado */}
                              <button
                                onClick={() => handleToggleDescuento(lead.id, lead.descuento_aplicado)}
                                className={`btn-status discount ${lead.descuento_aplicado ? 'active' : ''}`}
                                title={lead.descuento_aplicado ? "Desmarcar descuento" : "Marcar descuento primer mes aplicado"}
                              >
                                {lead.descuento_aplicado ? 'Descuento Aplicado ✓' : 'Aplicar Descuento'}
                              </button>
                            </div>
                          </td>
                          <td>
                            <span className="lead-date">{formatDate(lead.fecha)}</span>
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() => handleDeleteLead(lead.id, lead.nombre)}
                              className="action-delete"
                              title="Eliminar Registro"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Móvil: Cards en lugar de tabla */}
              <div className="mobile-leads-list">
                {filteredLeads.map((lead) => {
                  const cleanPhone = lead.telefono.replace(/\s+/g, '');
                  const isNewToday = new Date(lead.fecha).toDateString() === new Date().toDateString();
                  const whatsappText = encodeURIComponent(`¡Hola ${lead.nombre}! Te escribimos de Palladium. Hemos recibido tu solicitud para las clases de ${lead.disciplina} en ${lead.ubicacion}. ¿Cuándo te vendría bien hacer la clase de prueba gratuita?`);
                  const whatsappLink = `https://wa.me/34${cleanPhone}?text=${whatsappText}`;

                  return (
                    <div key={lead.id} className={`lead-mobile-card ${isNewToday ? 'card-new' : ''}`}>
                      <div className="card-header">
                        <div className="card-title-group">
                          <span className="avatar-mobile">
                            {lead.nombre.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <h4>{lead.nombre}</h4>
                            <span className="mobile-date">{formatDate(lead.fecha)}</span>
                          </div>
                        </div>
                        {isNewToday && <span className="badge-new-mobile">NUEVO</span>}
                      </div>

                      <div className="card-details-group">
                        <div className="detail-item">
                          <span className="label">Apellidos:</span>
                          <span className="value">{lead.apellidos || '-'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Teléfono:</span>
                          <span className="value">{lead.telefono}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Sede:</span>
                          <span className="value">{lead.ubicacion}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Disciplina:</span>
                          <span className={`badge-style ${lead.disciplina.toLowerCase().replace(/\s+/g, '-')}`}>
                            {lead.disciplina.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Seguimiento en móviles */}
                      <div className="card-tracking-mobile">
                        <button
                          onClick={() => handleToggleClaseGratuita(lead.id, lead.clase_gratuita)}
                          className={`btn-status-mobile class ${lead.clase_gratuita ? 'active' : ''}`}
                        >
                          {lead.clase_gratuita ? 'Clase Disfrutada ✓' : 'Clase Gratuita'}
                        </button>
                        <button
                          onClick={() => handleToggleDescuento(lead.id, lead.descuento_aplicado)}
                          className={`btn-status-mobile discount ${lead.descuento_aplicado ? 'active' : ''}`}
                        >
                          {lead.descuento_aplicado ? 'Descuento Aplicado ✓' : 'Aplicar Descuento'}
                        </button>
                      </div>

                      <div className="card-actions">
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-mobile-whatsapp"
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: '6px' }}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.9 9.9 0 00-6.98-2.879C6.18.961 1.756 5.334 1.752 10.763c0 1.677.452 3.313 1.312 4.757L2.092 20.8l5.555-1.446-.99-.59z"/></svg>
                          WhatsApp
                        </a>
                        <button
                          onClick={() => handleDeleteLead(lead.id, lead.nombre)}
                          className="btn-mobile-delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          Borrar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Sobrescribir fondos oscuros globales en modo claro */}
      <style jsx global>{`
        body {
          background-color: #F8F9FA !important;
          color: #1A1A1A !important;
        }
      `}</style>

      <style jsx>{`
        .admin-dashboard {
          background-color: #F8F9FA;
          color: #1A1A1A;
          min-height: 100vh;
          font-family: 'Montserrat', sans-serif;
          padding: 3rem 0;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          padding-bottom: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .logo-group h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin: 0;
          line-height: 1;
          color: #000000;
        }
        .logo-group .subtitle {
          font-size: 0.8rem;
          color: #666666;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          display: block;
          margin-top: 0.35rem;
        }
        .btn-logout {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #FFFFFF;
          border: 1px solid #CED4DA;
          color: #495057;
          padding: 0.6rem 1.1rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-logout:hover {
          background: rgba(220, 53, 69, 0.08);
          color: #DC3545;
          border-color: rgba(220, 53, 69, 0.2);
        }

        /* metrics */
        .metrics-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 576px) {
          .metrics-section {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 992px) {
          .metrics-section {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .metric-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .metric-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .metric-icon.total { background: rgba(50, 150, 255, 0.08); color: #0066CC; }
        .metric-icon.today { background: rgba(37, 211, 102, 0.08); color: #1E8548; }
        .metric-icon.locations { background: rgba(255, 170, 0, 0.08); color: #B27B00; }
        .metric-icon.styles { background: rgba(180, 80, 255, 0.08); color: #7F24CC; }
        
        .metric-info h3 {
          font-size: 0.8rem;
          color: #666666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .metric-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.85rem;
          font-weight: 700;
          color: #000000;
        }
        .metric-details {
          font-size: 0.8rem;
          color: #495057;
          line-height: 1.4;
        }
        .metric-details strong {
          color: #000000;
        }

        /* Filter bar */
        .filter-bar {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 992px) {
          .filter-bar {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        .search-box {
          position: relative;
          width: 100%;
        }
        @media (min-width: 992px) {
          .search-box {
            max-width: 380px;
          }
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #666666;
          pointer-events: none;
        }
        .search-box input {
          width: 100%;
          background: #F8F9FA;
          border: 1px solid #CED4DA;
          border-radius: 8px;
          padding: 0.75rem 1rem 0.75rem 2.8rem;
          color: #1A1A1A;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .search-box input:focus {
          outline: none;
          background: #FFFFFF;
          border-color: #000000;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
        }

        .filters-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          width: 100%;
        }
        @media (min-width: 992px) {
          .filters-group {
            width: auto;
            justify-content: flex-end;
          }
        }
        .filters-group select {
          background: #F8F9FA;
          border: 1px solid #CED4DA;
          color: #1A1A1A;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
          min-width: 160px;
          flex: 1;
        }
        @media (min-width: 576px) {
          .filters-group select {
            flex: none;
          }
        }
        .filters-group select option {
          background: #FFFFFF;
          color: #1A1A1A;
        }
        .btn-export {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #000000;
          color: #FFFFFF;
          border: 1px solid #000000;
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }
        @media (min-width: 576px) {
          .btn-export {
            flex: none;
          }
        }
        .btn-export:hover:not(:disabled) {
          background: transparent;
          color: #000000;
        }
        .btn-export:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Leads list and Table */
        .leads-list-section {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          overflow: hidden;
        }
        .no-leads-state {
          padding: 5rem 2rem;
          text-align: center;
          color: #666666;
        }
        .no-leads-state svg {
          margin-bottom: 1rem;
          color: rgba(0,0,0,0.15);
        }
        .no-leads-state p {
          font-size: 0.95rem;
        }

        .table-responsive {
          display: none;
        }
        @media (min-width: 768px) {
          .table-responsive {
            display: block;
          }
        }
        .leads-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .leads-table th {
          background: #F8F9FA;
          border-bottom: 1.5px solid #E9ECEF;
          color: #495057;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          padding: 1.1rem 1.5rem;
        }
        .leads-table td {
          border-bottom: 1px solid #E9ECEF;
          padding: 1.1rem 1.5rem;
          vertical-align: middle;
          color: #212529;
        }
        .leads-table tr:hover td {
          background: rgba(0, 0, 0, 0.008);
        }
        .leads-table tr.row-new td {
          background: rgba(37, 211, 102, 0.04);
        }
        .leads-table tr.row-new:hover td {
          background: rgba(37, 211, 102, 0.06);
        }

        .name-cell {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #E9ECEF;
          border: 1px solid #DEE2E6;
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .lead-name {
          font-weight: 600;
          color: #000000;
          display: block;
        }
        .badge-new {
          background: #25D366;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
          display: inline-block;
          margin-top: 0.25rem;
        }

        .phone-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .phone-number {
          color: #1A1A1A;
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .action-whatsapp {
          display: inline-flex;
          align-items: center;
          background: rgba(37, 211, 102, 0.08);
          color: #1E8548;
          border: 1px solid rgba(37, 211, 102, 0.25);
          border-radius: 20px;
          padding: 0.3rem 0.65rem;
          font-size: 0.72rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        .action-whatsapp:hover {
          background: #25D366;
          color: #FFFFFF;
          border-color: #25D366;
          transform: translateY(-1px);
        }
        .action-whatsapp svg {
          fill: currentColor;
        }

        .pref-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .badge-style {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          width: fit-content;
        }
        .badge-style.salsa {
          background: rgba(180, 80, 255, 0.08);
          color: #7F24CC;
          border: 1px solid rgba(180, 80, 255, 0.18);
        }
        .badge-style.bachata {
          background: rgba(50, 180, 255, 0.08);
          color: #0066CC;
          border: 1px solid rgba(50, 180, 255, 0.18);
        }
        .badge-style.salsa-y-bachata {
          background: rgba(0, 0, 0, 0.05);
          color: #000000;
          border: 1px solid rgba(0, 0, 0, 0.12);
        }
        .badge-style.desconocida {
          background: #F1F3F5;
          color: #495057;
        }

        .lead-ubicacion {
          color: #000000;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .lead-date {
          color: #666666;
        }

        /* Botones de estado (Seguimiento) */
        .seguimiento-buttons {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        .btn-status {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.45rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-status.class {
          background-color: #FFFFFF;
          color: #495057;
          border: 1.5px solid #CED4DA;
        }
        .btn-status.class:hover {
          background-color: #F8F9FA;
          border-color: #868E96;
        }
        .btn-status.class.active {
          background-color: #E6F7ED;
          color: #1E8548;
          border-color: #A3E6BA;
        }
        .btn-status.class.active:hover {
          background-color: #D4EDDA;
        }

        .btn-status.discount {
          background-color: #FFFFFF;
          color: #495057;
          border: 1.5px solid #CED4DA;
        }
        .btn-status.discount:hover {
          background-color: #F8F9FA;
          border-color: #868E96;
        }
        .btn-status.discount.active {
          background-color: #FFF9E6;
          color: #B27B00;
          border-color: #FFECA3;
        }
        .btn-status.discount.active:hover {
          background-color: #FFF3CD;
        }

        .action-delete {
          background: transparent;
          color: rgba(0,0,0,0.25);
          border: none;
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 4px;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .action-delete:hover {
          background: rgba(220, 53, 69, 0.08);
          color: #DC3545;
        }
        .text-center {
          text-align: center;
        }

        /* Mobile views cards list */
        .mobile-leads-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }
        @media (min-width: 768px) {
          .mobile-leads-list {
            display: none;
          }
        }
        .lead-mobile-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
        }
        .lead-mobile-card.card-new {
          background: rgba(37, 211, 102, 0.02);
          border-color: rgba(37, 211, 102, 0.15);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .card-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .avatar-mobile {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #E9ECEF;
          border: 1px solid #DEE2E6;
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .card-title-group h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #000000;
          margin: 0;
        }
        .mobile-date {
          font-size: 0.75rem;
          color: #666666;
          display: block;
          margin-top: 0.15rem;
        }
        .badge-new-mobile {
          background: #25D366;
          color: #FFFFFF;
          font-size: 0.6rem;
          font-weight: 850;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .card-details-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: #F8F9FA;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.03);
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }
        .detail-item .label {
          color: #666666;
        }
        .detail-item .value {
          color: #000000;
          font-weight: 600;
        }

        /* Seguimiento móvil */
        .card-tracking-mobile {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: rgba(0,0,0,0.01);
          border: 1.5px dashed #DEE2E6;
          padding: 0.75rem;
          border-radius: 8px;
        }
        .btn-status-mobile {
          width: 100%;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .btn-status-mobile.class {
          background-color: #FFFFFF;
          color: #495057;
          border: 1.5px solid #CED4DA;
        }
        .btn-status-mobile.class.active {
          background-color: #E6F7ED;
          color: #1E8548;
          border-color: #A3E6BA;
        }
        .btn-status-mobile.discount {
          background-color: #FFFFFF;
          color: #495057;
          border: 1.5px solid #CED4DA;
        }
        .btn-status-mobile.discount.active {
          background-color: #FFF9E6;
          color: #B27B00;
          border-color: #FFECA3;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn-mobile-whatsapp {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(37, 211, 102, 0.08);
          color: #1E8548;
          border: 1px solid rgba(37, 211, 102, 0.25);
          border-radius: 8px;
          padding: 0.6rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
          transition: all 0.2s;
        }
        .btn-mobile-whatsapp:hover {
          background: #25D366;
          color: #FFFFFF;
        }
        .btn-mobile-delete {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background: rgba(220, 53, 69, 0.05);
          color: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          padding: 0.6rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-mobile-delete:hover {
          background: rgba(220, 53, 69, 0.15);
          color: #DC3545;
          border-color: rgba(220, 53, 69, 0.25);
        }
      `}</style>
    </div>
  );
}
