# InsightPlace Client Portal - Product Requirements Document

## Original Problem Statement
The user wants to add a secure client portal to their existing static website. The key product requirements are:
- A separate login page for clients
- Restricted access to a client portal where confidential reports (HTML files with associated figures/tables) can be viewed
- An admin panel for the site owner to manage the portal
- User accounts will be created manually by the admin
- All users within the same company will have access to the same information
- A database to store company info, user credentials, and login history
- A simple and secure file upload mechanism for a non-technical admin to upload reports
- Tracking of logins, failed login attempts, and file downloads
- 2FA is a "nice-to-have" if easy and free to implement

## Architecture

### Tech Stack
- **Frontend:** React (existing landing page + new portal components)
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Authentication:** JWT-based authentication with role-based access control
- **Hosting:** Vercel (frontend), Internal preview environment (backend)

### File Structure
```
/app
├── backend/
│   ├── routes/
│   │   ├── admin.py      # Admin CRUD APIs
│   │   ├── auth.py       # Login/logout/token APIs
│   │   └── client.py     # Client report access APIs
│   ├── auth.py           # JWT utilities
│   ├── database.py       # MongoDB connection
│   ├── models.py         # Pydantic models
│   ├── server.py         # FastAPI app
│   └── utils.py          # Helper functions
└── frontend/
    └── src/
        └── components/
            ├── auth/
            │   ├── AuthContext.js     # Auth state management
            │   ├── LoginPage.js       # Login form
            │   └── ProtectedRoute.js  # Route protection
            └── portal/
                ├── AdminPanel.js      # Full admin dashboard
                └── ClientPortal.js    # Client report viewer
```

## Features Implemented

### Authentication System
- [x] JWT-based login/logout
- [x] Role-based access (admin vs client)
- [x] Session persistence via localStorage
- [x] Protected routes
- [x] Smart redirect (admin -> /admin, client -> /portal)

### Admin Panel
- [x] Dashboard with stats (companies, users, reports, access logs)
- [x] Company management (list, create via modal)
- [x] User management (list, create via modal)
- [x] Report listing
- [x] **Report Upload Form** - Title, description, company selector, multi-file upload
- [x] Activity logs viewer

### Client Portal
- [x] Welcome page with company name
- [x] Reports list with view/download buttons
- [x] Report statistics (views, downloads)

### Tracking & Security
- [x] Login history tracking (user, IP, timestamp)
- [x] Activity logging for all admin actions
- [x] File download tracking
- [x] Password hashing with bcrypt

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login, returns JWT token
- `POST /api/auth/logout` - Logout

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/companies` - List companies
- `POST /api/admin/companies` - Create company
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `GET /api/admin/reports` - List all reports
- `POST /api/admin/reports/upload` - Upload report (multipart/form-data)
- `GET /api/admin/activity-logs` - Activity logs

### Client APIs
- `GET /api/client/reports` - Reports for client's company
- `GET /api/client/reports/{id}/view` - View report file
- `GET /api/client/reports/{id}/download` - Download report file

## Database Schema

### Companies
- id (UUID)
- name (string)
- description (string, optional)
- active (boolean)
- created_at, updated_at (datetime)

### Users
- id (UUID)
- email (string, unique)
- hashed_password (string)
- full_name (string)
- company_id (UUID, FK)
- role (enum: admin, client)
- active (boolean)
- last_login (datetime)
- created_at (datetime)

### Reports
- id (UUID)
- title (string)
- description (string, optional)
- company_id (UUID, FK)
- main_file (string, path)
- supporting_files (list of strings)
- file_size (int)
- uploaded_by (UUID, FK)
- status (enum: draft, published)
- view_count, download_count (int)
- created_at (datetime)

### Activity Logs
- id (UUID)
- user_id, user_email
- activity_type (login, logout, report_upload, etc.)
- description
- ip_address
- timestamp
- metadata (dict)

## Test Credentials
- **Admin:** admin@insightplace.com / admin123
- **Client:** carlos.mesa@palomavalencia.com / password123

## Backlog / Future Tasks

### P0 (Next Priority)
- [ ] Test actual file upload with real HTML report and verify it appears in client portal

### P1
- [ ] Password reset functionality
- [ ] Edit/delete companies and users
- [ ] Report preview in admin panel
- [ ] Better error messages in forms

### P2
- [ ] 2FA implementation
- [ ] Email notifications for new reports
- [ ] Bulk user import
- [ ] Report versioning
- [ ] Search and filter in admin tables

### P3
- [ ] Remove obsolete demo-admin.html
- [ ] Advanced analytics dashboard
- [ ] Export activity logs to CSV

## Changelog
- **2026-02-20:** Fixed frontend blank page issue by updating AuthContext to initialize state synchronously from localStorage
- **2026-02-20:** Implemented role-based redirect (admin -> /admin, client -> /portal)
- **2026-02-20:** Added functional modals for creating companies and users
- **2026-02-20:** Implemented complete upload form with multi-file support
- **2026-02-20:** Added data-testid attributes to login form
- **2026-02-20:** All tests passing (100% backend, 100% frontend)
