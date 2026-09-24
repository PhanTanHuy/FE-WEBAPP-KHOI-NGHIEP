import React, { useState } from 'react';
import { Users, FileText, CheckSquare, Settings, Activity, Shield } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Shield size={24} className="text-indigo-500 mr-2" />
          <span>EduConnect Admin</span>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> User Management
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            <FileText size={18} /> Materials Approval
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <CheckSquare size={18} /> Tutor Applications
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <Activity size={18} /> Audit Logs
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h2>
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'materials' && 'Material Approvals'}
            {activeTab === 'applications' && 'Tutor Applications'}
            {activeTab === 'logs' && 'System Audit Logs'}
          </h2>
          <div className="admin-profile">
            <div className="avatar">AD</div>
            <span>Super Admin</span>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'users' && (
            <div className="admin-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Nguyen Van A</td>
                      <td>vana@example.com</td>
                      <td><span className="role-badge tutor">Tutor</span></td>
                      <td>
                        <button className="btn-sm text-blue-600">Edit Role</button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Le Thi B</td>
                      <td>thib@example.com</td>
                      <td><span className="role-badge parent">Parent</span></td>
                      <td>
                        <button className="btn-sm text-blue-600">Edit Role</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="admin-card">
              <p className="text-gray-500">Showing pending materials requiring approval...</p>
              {/* Dummy data for visual */}
              <div className="material-item">
                <div className="material-info">
                  <h4>Toán 12 - Đề cương ôn tập HK1</h4>
                  <p>Uploaded by: Tutor Nguyen Van A</p>
                </div>
                <div className="material-actions">
                  <button className="btn-sm btn-success">Approve</button>
                  <button className="btn-sm btn-danger">Reject</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="admin-card">
              <p className="text-gray-500">Showing pending tutor applications...</p>
              <div className="application-item">
                <div className="app-info">
                  <h4>Tran Van C</h4>
                  <p>Subject: Math | Experience: 5 years</p>
                </div>
                <div className="app-actions">
                  <button className="btn-sm btn-primary">Review Docs</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="admin-card">
              <ul className="audit-list">
                <li>
                  <span className="time">10:45 AM</span>
                  <span className="action">Admin approved material #102</span>
                </li>
                <li>
                  <span className="time">09:12 AM</span>
                  <span className="action">User role updated for ID 45</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
