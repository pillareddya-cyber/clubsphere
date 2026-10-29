import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Base backend API endpoint
const API_BASE = 'http://localhost:8080/api';

function App() {
  // Navigation & Role states
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'members', 'clubs', 'requests', 'announcements'
  const [currentRole, setCurrentRole] = useState('STUDENT'); // 'STUDENT', 'FACULTY', 'COORDINATOR'

  // Data states
  const [members, setMembers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  // UI / Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Modal / Form states
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberFormData, setMemberFormData] = useState({
    name: '',
    identifier: '',
    role: 'STUDENT',
    branch: 'Computer Science & Engineering',
    marks: '',
    clubId: '',
    clubName: ''
  });

  // Join Request Modal
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedClubForJoin, setSelectedClubForJoin] = useState(null);
  const [joinFormData, setJoinFormData] = useState({
    studentName: '',
    studentRollNumber: '',
    studentBranch: 'Computer Science & Engineering',
    remarks: ''
  });

  // Announcement Modal
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementFormData, setAnnouncementFormData] = useState({
    title: '',
    content: '',
    category: 'ANNOUNCEMENT',
    clubName: 'All Clubs'
  });

  // Show transient alert message
  const showMessage = (text, type = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  // 1. Fetch Total Student Count (Requirement 5)
  const fetchStudentCount = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/members/count/students`);
      if (res.ok) {
        const data = await res.json();
        setTotalStudents(data.totalStudents || 0);
      }
    } catch (err) {
      console.error('Failed to fetch student count:', err);
    }
  }, []);

  // 2. Fetch Members (Requirements 1, 2, 4)
  const fetchMembers = useCallback(async (search = '', role = 'ALL') => {
    try {
      setLoading(true);
      let url = `${API_BASE}/members`;
      const params = new URLSearchParams();
      if (search && search.trim()) {
        params.append('search', search.trim());
      } else if (role && role !== 'ALL') {
        params.append('role', role);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Fetch Clubs with Faculty and Coordinator Details (Requirement 3)
  const fetchClubs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/clubs`);
      if (res.ok) {
        const data = await res.json();
        setClubs(data);
      }
    } catch (err) {
      console.error('Failed to fetch clubs:', err);
    }
  }, []);

  // 4. Fetch Membership Requests
  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/requests`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  }, []);

  // 5. Fetch Announcements and Alerts (Requirement 8)
  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMembers();
    fetchStudentCount();
    fetchClubs();
    fetchRequests();
    fetchAnnouncements();
  }, [fetchMembers, fetchStudentCount, fetchClubs, fetchRequests, fetchAnnouncements]);

  // Handle Search input change (Requirement 4)
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    fetchMembers(val, memberRoleFilter);
  };

  // Handle Role Filter change
  const handleRoleFilterChange = (role) => {
    setMemberRoleFilter(role);
    setSearchQuery('');
    fetchMembers('', role);
  };

  // Open modal to Add New Member
  const openAddMemberModal = () => {
    setEditingMember(null);
    setMemberFormData({
      name: '',
      identifier: '',
      role: 'STUDENT',
      branch: 'Computer Science & Engineering',
      marks: '',
      clubId: '',
      clubName: ''
    });
    setIsMemberModalOpen(true);
  };

  // Open modal to Edit Member (Requirement 6)
  const openEditMemberModal = (member) => {
    setEditingMember(member);
    setMemberFormData({
      name: member.name,
      identifier: member.identifier,
      role: member.role,
      branch: member.branch,
      marks: member.marks !== null ? member.marks : '',
      clubId: member.clubId || '',
      clubName: member.clubName || ''
    });
    setIsMemberModalOpen(true);
  };

  // Save or Update Member (Requirement 1, 6)
  const handleMemberFormSubmit = async (e) => {
    e.preventDefault();
    if (!memberFormData.name.trim() || !memberFormData.identifier.trim()) {
      showMessage('Please fill all mandatory fields (Name & Identifier).', 'error');
      return;
    }

    try {
      const payload = {
        name: memberFormData.name.trim(),
        identifier: memberFormData.identifier.trim(),
        role: memberFormData.role,
        branch: memberFormData.branch,
        marks: memberFormData.marks ? parseFloat(memberFormData.marks) : 0.0,
        clubId: memberFormData.clubId ? parseInt(memberFormData.clubId) : null,
        clubName: memberFormData.clubName || ''
      };

      let res;
      if (editingMember) {
        // Update existing
        res = await fetch(`${API_BASE}/members/${editingMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new
        res = await fetch(`${API_BASE}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showMessage(editingMember ? 'Record updated successfully!' : 'Record added successfully!');
        setIsMemberModalOpen(false);
        fetchMembers(searchQuery, memberRoleFilter);
        fetchStudentCount(); // Auto-update student count (Requirement 5)
      } else {
        const errorText = await res.text();
        showMessage(`Error: ${errorText}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Network error while saving record.', 'error');
    }
  };

  // Delete Member (Requirement 6)
  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/members/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showMessage('Record deleted successfully.');
        fetchMembers(searchQuery, memberRoleFilter);
        fetchStudentCount(); // Auto-update count on delete (Requirement 5)
      } else {
        showMessage('Failed to delete member.', 'error');
      }
    } catch (err) {
      showMessage('Network error during deletion.', 'error');
    }
  };

  // Submit Join Request (Requirement 8)
  const handleOpenJoinModal = (club) => {
    setSelectedClubForJoin(club);
    setJoinFormData({
      studentName: '',
      studentRollNumber: '',
      studentBranch: 'Computer Science & Engineering',
      remarks: ''
    });
    setIsJoinModalOpen(true);
  };

  const handleJoinFormSubmit = async (e) => {
    e.preventDefault();
    if (!joinFormData.studentName.trim() || !joinFormData.studentRollNumber.trim()) {
      showMessage('Please provide your name and roll number.', 'error');
      return;
    }

    try {
      const payload = {
        studentName: joinFormData.studentName.trim(),
        studentRollNumber: joinFormData.studentRollNumber.trim(),
        studentBranch: joinFormData.studentBranch,
        clubId: selectedClubForJoin.id,
        clubName: selectedClubForJoin.name,
        remarks: joinFormData.remarks.trim()
      };

      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showMessage(`Join request for "${selectedClubForJoin.name}" submitted successfully!`);
        setIsJoinModalOpen(false);
        fetchRequests();
      } else {
        showMessage('Failed to submit join request.', 'error');
      }
    } catch (err) {
      showMessage('Network error while submitting request.', 'error');
    }
  };

  // Accept or Reject Request (Role-Based for Faculty & Coordinator)
  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          remarks: `Reviewed and ${newStatus.toLowerCase()} by ${currentRole}`
        })
      });
      if (res.ok) {
        showMessage(`Request status marked as ${newStatus}!`);
        fetchRequests();
      } else {
        showMessage('Failed to update status.', 'error');
      }
    } catch (err) {
      showMessage('Network error while updating request.', 'error');
    }
  };

  // Create Announcement / Alert (Requirement 8)
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!announcementFormData.title.trim() || !announcementFormData.content.trim()) {
      showMessage('Please enter title and content.', 'error');
      return;
    }

    try {
      const payload = {
        title: announcementFormData.title.trim(),
        content: announcementFormData.content.trim(),
        category: announcementFormData.category,
        clubName: announcementFormData.clubName,
        postedBy: `${currentRole.charAt(0) + currentRole.slice(1).toLowerCase()} Desk`
      };

      const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showMessage('Announcement broadcasted successfully!');
        setIsAnnouncementModalOpen(false);
        setAnnouncementFormData({
          title: '',
          content: '',
          category: 'ANNOUNCEMENT',
          clubName: 'All Clubs'
        });
        fetchAnnouncements();
      } else {
        showMessage('Failed to post announcement.', 'error');
      }
    } catch (err) {
      showMessage('Network error while posting announcement.', 'error');
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      const res = await fetch(`${API_BASE}/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('Announcement deleted.');
        fetchAnnouncements();
      }
    } catch (err) {
      showMessage('Failed to delete announcement.', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Top Banner & Role Selector (Requirement 7) */}
      <header className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">🎓</div>
          <div>
            <h1 className="brand-title">ClubSphere</h1>
            <p className="brand-subtitle">College Clubs & Campus Engagement Portal</p>
          </div>
        </div>

        {/* Role Selector Pill */}
        <div className="role-selector-bar">
          <span className="role-label">Active Role:</span>
          <div className="role-buttons">
            <button
              className={`role-btn ${currentRole === 'STUDENT' ? 'active student' : ''}`}
              onClick={() => setCurrentRole('STUDENT')}
            >
              👨‍🎓 Student
            </button>
            <button
              className={`role-btn ${currentRole === 'FACULTY' ? 'active faculty' : ''}`}
              onClick={() => setCurrentRole('FACULTY')}
            >
              👨‍🏫 Faculty
            </button>
            <button
              className={`role-btn ${currentRole === 'COORDINATOR' ? 'active coordinator' : ''}`}
              onClick={() => setCurrentRole('COORDINATOR')}
            >
              ⭐ Coordinator
            </button>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      {feedbackMessage && (
        <div className={`toast-banner ${feedbackMessage.type}`}>
          {feedbackMessage.text}
        </div>
      )}

      {/* Live Alert Ticker (Requirement 8) */}
      {announcements.length > 0 && (
        <div className="news-ticker">
          <span className="ticker-badge">LATEST</span>
          <div className="ticker-text">
            📢 <strong>{announcements[0].title}</strong>: {announcements[0].content}
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          👥 Directory & Records
        </button>
        <button
          className={`tab-btn ${activeTab === 'clubs' ? 'active' : ''}`}
          onClick={() => setActiveTab('clubs')}
        >
          🏛️ Clubs & Leadership
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📥 Join Requests {requests.filter(r => r.status === 'PENDING').length > 0 && (
            <span className="badge-pill">{requests.filter(r => r.status === 'PENDING').length}</span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          📢 Announcements & Alerts
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="content-container">

        {/* ===================== TAB 1: DASHBOARD ===================== */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            {/* KPI 1: Total Registered Students (Requirement 5) */}
            <div className="kpi-card student-kpi">
              <div className="kpi-icon">🎓</div>
              <div className="kpi-info">
                <h3>Total Registered Students</h3>
                <div className="kpi-number">{totalStudents}</div>
                <p className="kpi-subtext">Automatically synchronized with database</p>
              </div>
            </div>

            {/* KPI 2: Total Active Clubs */}
            <div className="kpi-card club-kpi">
              <div className="kpi-icon">🏛️</div>
              <div className="kpi-info">
                <h3>Active College Clubs</h3>
                <div className="kpi-number">{clubs.length}</div>
                <p className="kpi-subtext">Technical, Cultural, and Sports bodies</p>
              </div>
            </div>

            {/* KPI 3: Pending Membership Requests */}
            <div className="kpi-card request-kpi">
              <div className="kpi-icon">📋</div>
              <div className="kpi-info">
                <h3>Pending Membership Requests</h3>
                <div className="kpi-number">
                  {requests.filter(r => r.status === 'PENDING').length}
                </div>
                <p className="kpi-subtext">Awaiting Faculty/Coordinator review</p>
              </div>
            </div>

            {/* KPI 4: Announcements & Alerts */}
            <div className="kpi-card alert-kpi">
              <div className="kpi-icon">🔔</div>
              <div className="kpi-info">
                <h3>Broadcasted Notices</h3>
                <div className="kpi-number">{announcements.length}</div>
                <p className="kpi-subtext">Events, Alerts, and Reminders</p>
              </div>
            </div>

            {/* Quick Actions & Role Brief */}
            <div className="card dashboard-welcome-card">
              <h2>Welcome to ClubSphere, {currentRole}!</h2>
              <p>
                ClubSphere streamlines college club administration and communication between students, faculty in-charges, and student coordinators.
              </p>
              <div className="role-permissions-box">
                <h4>Current Role Permissions ({currentRole}):</h4>
                {currentRole === 'STUDENT' && (
                  <ul>
                    <li>✅ Browse all clubs and their Faculty / Coordinator leadership.</li>
                    <li>✅ Submit direct join requests for clubs.</li>
                    <li>✅ Track real-time status of your membership applications.</li>
                    <li>✅ Receive notifications, upcoming events, and urgent alerts.</li>
                    <li>🔒 Member editing/deletion restricted to Faculty and Coordinators.</li>
                  </ul>
                )}
                {currentRole === 'FACULTY' && (
                  <ul>
                    <li>✅ Full CRUD access to add, update, and remove student, faculty, and coordinator records.</li>
                    <li>✅ Review, Accept, or Reject student membership applications.</li>
                    <li>✅ Broadcast campus-wide alerts, club events, and notifications.</li>
                    <li>✅ Oversee club leadership and manage members.</li>
                  </ul>
                )}
                {currentRole === 'COORDINATOR' && (
                  <ul>
                    <li>✅ Manage club operations and review student join requests.</li>
                    <li>✅ Accept or reject membership applications.</li>
                    <li>✅ Broadcast club activities, upcoming hackathons, and announcements.</li>
                    <li>✅ Update and maintain club member records.</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: MEMBERS DIRECTORY ===================== */}
        {activeTab === 'members' && (
          <div className="section-container">
            {/* Section Header with Total Student Count & Add Button */}
            <div className="section-header">
              <div>
                <h2>Saved Records Directory</h2>
                <p className="section-desc">
                  Students, Faculty Members, and Club Coordinators database.
                </p>
              </div>

              {/* Requirement 5: Prominent Total Student Count Badge */}
              <div className="counter-pill">
                <span className="counter-icon">🎓</span>
                <span>Total Registered Students: <strong>{totalStudents}</strong></span>
              </div>

              {/* Add Member button (Authorized roles) */}
              {(currentRole === 'FACULTY' || currentRole === 'COORDINATOR') && (
                <button className="primary-btn" onClick={openAddMemberModal}>
                  ➕ Add New Member
                </button>
              )}
            </div>

            {/* Search Bar & Filter Tabs (Requirement 4 & 2) */}
            <div className="search-filter-bar">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by Name, Roll No / Employee ID, or Branch..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="clear-btn" onClick={() => { setSearchQuery(''); fetchMembers('', memberRoleFilter); }}>
                    ✕
                  </button>
                )}
              </div>

              {/* Role filter buttons */}
              <div className="filter-pills">
                {['ALL', 'STUDENT', 'FACULTY', 'COORDINATOR'].map((role) => (
                  <button
                    key={role}
                    className={`filter-pill ${memberRoleFilter === role ? 'active' : ''}`}
                    onClick={() => handleRoleFilterChange(role)}
                  >
                    {role === 'ALL' ? 'All Records' : role}
                  </button>
                ))}
              </div>
            </div>

            {/* Organized Data Table (Requirement 2 & 6) */}
            {loading ? (
              <div className="loading-spinner">Loading records...</div>
            ) : members.length === 0 ? (
              <div className="empty-state">
                <p>No records found matching your search criteria.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th># ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Roll No / Employee ID</th>
                      <th>Branch</th>
                      <th>Marks (%)</th>
                      <th>Associated Club</th>
                      {(currentRole === 'FACULTY' || currentRole === 'COORDINATOR') && (
                        <th>Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td>{member.id}</td>
                        <td className="font-semibold">{member.name}</td>
                        <td>
                          <span className={`role-badge ${member.role.toLowerCase()}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="font-mono">{member.identifier}</td>
                        <td>{member.branch}</td>
                        <td>
                          <span className="marks-badge">
                            {member.marks !== null ? `${member.marks}%` : 'N/A'}
                          </span>
                        </td>
                        <td>{member.clubName || '—'}</td>
                        {(currentRole === 'FACULTY' || currentRole === 'COORDINATOR') && (
                          <td className="action-buttons">
                            <button
                              className="action-btn edit-btn"
                              title="Edit Record"
                              onClick={() => openEditMemberModal(member)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="action-btn delete-btn"
                              title="Delete Record"
                              onClick={() => handleDeleteMember(member.id, member.name)}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: CLUBS & LEADERSHIP ===================== */}
        {activeTab === 'clubs' && (
          <div className="section-container">
            <div className="section-header">
              <div>
                <h2>College Clubs & Leadership Roster</h2>
                <p className="section-desc">
                  Explore available clubs, faculty advisors, student coordinators, and join.
                </p>
              </div>
            </div>

            {/* Requirement 3: Display Faculty and Coordinator Details for Each Club */}
            <div className="clubs-grid">
              {clubs.map((club) => (
                <div key={club.id} className="club-card">
                  <div className="club-card-header">
                    <div>
                      <h3 className="club-title">{club.name}</h3>
                      <span className="category-tag">{club.category}</span>
                    </div>
                  </div>

                  <p className="club-description">{club.description}</p>

                  <div className="leadership-section">
                    <h4>Leadership & Mentorship</h4>

                    {/* Faculty Coordinator Details */}
                    <div className="leader-info-box faculty-box">
                      <div className="leader-role-tag">👨‍🏫 Faculty In-Charge</div>
                      <div className="leader-name">{club.facultyName}</div>
                      <div className="leader-meta">
                        <span>ID: <strong>{club.facultyEmpId}</strong></span>
                        <span>•</span>
                        <span>{club.facultyBranch}</span>
                      </div>
                    </div>

                    {/* Student Coordinator Details */}
                    <div className="leader-info-box coordinator-box">
                      <div className="leader-role-tag">⭐ Student Coordinator</div>
                      <div className="leader-name">{club.coordinatorName}</div>
                      <div className="leader-meta">
                        <span>Roll: <strong>{club.coordinatorRollNo}</strong></span>
                        <span>•</span>
                        <span>{club.coordinatorBranch}</span>
                      </div>
                    </div>
                  </div>

                  {/* Join Action for Students */}
                  <div className="club-card-footer">
                    <button
                      className="primary-btn full-width"
                      onClick={() => handleOpenJoinModal(club)}
                    >
                      📝 Request to Join Club
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: JOIN REQUESTS ===================== */}
        {activeTab === 'requests' && (
          <div className="section-container">
            <div className="section-header">
              <div>
                <h2>Club Membership Requests</h2>
                <p className="section-desc">
                  Track student join requests, verify credentials, and manage approvals.
                </p>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="empty-state">
                <p>No membership requests submitted yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th># ID</th>
                      <th>Student Name</th>
                      <th>Roll Number</th>
                      <th>Branch</th>
                      <th>Club Requested</th>
                      <th>Submission Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                      {(currentRole === 'FACULTY' || currentRole === 'COORDINATOR') && (
                        <th>Review Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.id}</td>
                        <td className="font-semibold">{req.studentName}</td>
                        <td className="font-mono">{req.studentRollNumber}</td>
                        <td>{req.studentBranch}</td>
                        <td>
                          <span className="club-badge">{req.clubName}</span>
                        </td>
                        <td>{req.requestDate}</td>
                        <td>
                          <span className={`status-badge status-${req.status.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="remarks-col">{req.remarks || '—'}</td>
                        {(currentRole === 'FACULTY' || currentRole === 'COORDINATOR') && (
                          <td className="action-buttons">
                            {req.status === 'PENDING' ? (
                              <>
                                <button
                                  className="action-btn accept-btn"
                                  onClick={() => handleUpdateRequestStatus(req.id, 'ACCEPTED')}
                                >
                                  ✓ Accept
                                </button>
                                <button
                                  className="action-btn reject-btn"
                                  onClick={() => handleUpdateRequestStatus(req.id, 'REJECTED')}
                                >
                                  ✕ Reject
                                </button>
                              </>
                            ) : (
                              <span className="reviewed-text">Reviewed</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 5: ANNOUNCEMENTS & ALERTS ===================== */}
        {activeTab === 'announcements' && (
          <div className="section-container">
            <div className="section-header">
              <div>
                <h2>Club Announcements & Campus Alerts</h2>
                <p className="section-desc">
                  Stay updated on upcoming club events, hackathons, and important circulars.
                </p>
              </div>

              {/* Authorized roles can broadcast announcements */}
              {(currentRole === 'FACULTY' || currentRole === 'COORDINATOR') && (
                <button
                  className="primary-btn"
                  onClick={() => setIsAnnouncementModalOpen(true)}
                >
                  📢 Broadcast Announcement
                </button>
              )}
            </div>

            {announcements.length === 0 ? (
              <div className="empty-state">
                <p>No active announcements or alerts at this moment.</p>
              </div>
            ) : (
              <div className="announcements-list">
                {announcements.map((item) => (
                  <div key={item.id} className={`announcement-card category-${item.category.toLowerCase()}`}>
                    <div className="announcement-header">
                      <div className="announcement-badges">
                        <span className={`category-badge badge-${item.category.toLowerCase()}`}>
                          {item.category}
                        </span>
                        <span className="announcement-club">{item.clubName}</span>
                      </div>
                      <span className="announcement-date">🕒 {item.postedDate}</span>
                    </div>

                    <h3 className="announcement-title">{item.title}</h3>
                    <p className="announcement-content">{item.content}</p>

                    <div className="announcement-footer">
                      <span className="posted-by">Posted by: <strong>{item.postedBy}</strong></span>
                      {(currentRole === 'FACULTY' || currentRole === 'COORDINATOR') && (
                        <button
                          className="delete-link"
                          onClick={() => handleDeleteAnnouncement(item.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ===================== MODAL: ADD / EDIT MEMBER (Requirement 1 & 6) ===================== */}
      {isMemberModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingMember ? '✏️ Edit Member Record' : '➕ Add Student / Faculty / Coordinator'}</h3>
              <button className="modal-close-btn" onClick={() => setIsMemberModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleMemberFormSubmit} className="modal-form">
              {/* Role Selection */}
              <div className="form-group">
                <label>Role *</label>
                <select
                  value={memberFormData.role}
                  onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                  className="form-control"
                  required
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty Member</option>
                  <option value="COORDINATOR">Club Coordinator</option>
                </select>
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={memberFormData.name}
                  onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              {/* Identifier: Roll Number or Employee ID */}
              <div className="form-group">
                <label>
                  {memberFormData.role === 'STUDENT' ? 'Roll Number *' : 'Employee ID *'}
                </label>
                <input
                  type="text"
                  placeholder={memberFormData.role === 'STUDENT' ? 'e.g. 23CS101' : 'e.g. EMP-CSE-101'}
                  value={memberFormData.identifier}
                  onChange={(e) => setMemberFormData({ ...memberFormData, identifier: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              {/* Branch */}
              <div className="form-group">
                <label>Branch / Department *</label>
                <select
                  value={memberFormData.branch}
                  onChange={(e) => setMemberFormData({ ...memberFormData, branch: e.target.value })}
                  className="form-control"
                  required
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Humanities & Arts">Humanities & Arts</option>
                </select>
              </div>

              {/* Marks (Requirement 1: Marks) */}
              <div className="form-group">
                <label>Marks / Academic Score (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g. 88.5"
                  value={memberFormData.marks}
                  onChange={(e) => setMemberFormData({ ...memberFormData, marks: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              {/* Associated Club (Optional) */}
              <div className="form-group">
                <label>Associated Club (Optional)</label>
                <select
                  value={memberFormData.clubId}
                  onChange={(e) => {
                    const selectedClub = clubs.find(c => c.id.toString() === e.target.value);
                    setMemberFormData({
                      ...memberFormData,
                      clubId: e.target.value,
                      clubName: selectedClub ? selectedClub.name : ''
                    });
                  }}
                  className="form-control"
                >
                  <option value="">None / Not Assigned</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setIsMemberModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingMember ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: JOIN CLUB REQUEST ===================== */}
      {isJoinModalOpen && selectedClubForJoin && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>📝 Join {selectedClubForJoin.name}</h3>
              <button className="modal-close-btn" onClick={() => setIsJoinModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleJoinFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Student Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Patel"
                  value={joinFormData.studentName}
                  onChange={(e) => setJoinFormData({ ...joinFormData, studentName: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Roll Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 23CS089"
                  value={joinFormData.studentRollNumber}
                  onChange={(e) => setJoinFormData({ ...joinFormData, studentRollNumber: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Branch *</label>
                <select
                  value={joinFormData.studentBranch}
                  onChange={(e) => setJoinFormData({ ...joinFormData, studentBranch: e.target.value })}
                  className="form-control"
                  required
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Biotechnology">Biotechnology</option>
                </select>
              </div>

              <div className="form-group">
                <label>Why do you want to join? (Remarks)</label>
                <textarea
                  rows="3"
                  placeholder="Describe your interests, past projects, or motivations..."
                  value={joinFormData.remarks}
                  onChange={(e) => setJoinFormData({ ...joinFormData, remarks: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setIsJoinModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: BROADCAST ANNOUNCEMENT ===================== */}
      {isAnnouncementModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>📢 Broadcast Club Notice / Alert</h3>
              <button className="modal-close-btn" onClick={() => setIsAnnouncementModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAnnouncementSubmit} className="modal-form">
              <div className="form-group">
                <label>Notice Type *</label>
                <select
                  value={announcementFormData.category}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, category: e.target.value })}
                  className="form-control"
                >
                  <option value="ANNOUNCEMENT">General Announcement</option>
                  <option value="EVENT">Upcoming Club Event / Workshop</option>
                  <option value="ALERT">Urgent Alert / Schedule Change</option>
                </select>
              </div>

              <div className="form-group">
                <label>Club Association</label>
                <select
                  value={announcementFormData.clubName}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, clubName: e.target.value })}
                  className="form-control"
                >
                  <option value="All Clubs">All Clubs / Campus Wide</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Intra-College Coding Contest 2026"
                  value={announcementFormData.title}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, title: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Message Content *</label>
                <textarea
                  rows="4"
                  placeholder="Provide all details including venue, timings, prerequisites, etc."
                  value={announcementFormData.content}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, content: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>
          <strong>ClubSphere</strong> — College Club Management System | EMA3151 Full Stack Development Practical Exam
        </p>
      </footer>
    </div>
  );
}

export default App;

