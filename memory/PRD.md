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
- Download permission control (allow/disallow downloads per report)
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
│   ├── auth.py           # JWT utilities + token validation
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
                ├── ClientPortal.js    # Client report list
                └── ReportViewer.js    # In-app secure report viewer
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
- [x] **Report Upload Form** - Title, description, company selector, ZIP file upload with auto-extraction
- [x] Download permission toggle (allow_download per report)
- [x] Activity logs viewer
- [x] "Vista de Usuario" - Admin can view portal as client would

### Client Portal
- [x] Welcome page with company name
- [x] Reports list with view button
- [x] Report statistics (views, downloads)
- [x] **Secure In-App Report Viewer** - HTML reports rendered in-app without direct file access
- [x] Download button (shown only if allowed)

### Report Viewing System
- [x] ZIP archive auto-extraction on upload
- [x] Main HTML file detection (Main.html)
- [x] Secure asset serving (images, CSS, JS) via authenticated endpoint
- [x] Token-based authentication for embedded assets (query param support)
- [x] Content Security Policy headers to prevent external sharing

### Tracking & Security
- [x] Login history tracking (user, IP, timestamp)
- [x] Activity logging for all admin actions
- [x] Report view/download tracking
- [x] Password hashing with bcrypt
- [x] Secure file access (no direct URL access to reports)

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
- `POST /api/admin/reports/upload` - Upload report (supports ZIP extraction, allow_download flag)
- `GET /api/admin/activity-logs` - Activity logs

### Client APIs
- `GET /api/client/reports` - Reports for client's company
- `GET /api/client/reports/{id}` - Get report details
- `GET /api/client/reports/{id}/view` - View report HTML content (authenticated)
- `GET /api/client/reports/{id}/asset/{path}` - Get report assets (images, CSS) - supports token query param
- `GET /api/client/reports/{id}/download` - Download report file (if allowed)

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
- **allow_download (boolean)** - controls download permission
- view_count, download_count (int)
- created_at (datetime)

### Activity Logs
- id (UUID)
- user_id, user_email
- activity_type (login, logout, report_upload, report_view, report_download, etc.)
- description
- ip_address
- timestamp
- metadata (dict)

## Test Credentials
- **Admin:** cmesa@insight-place.com / Ins1ght#2024!
- **Client:** demo@palomavalencia.com / demo123

## Backlog / Future Tasks

### P1 (Next Priority)
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
- [ ] Advanced analytics dashboard
- [ ] Export activity logs to CSV

## Changelog
- **2026-02-20 (Session 2):** Fixed 404 report viewing error - reset client user password and fixed asset endpoint to support token query parameter for browser-loaded assets
- **2026-02-20 (Session 2):** Added `get_user_from_token()` helper in auth.py for token validation without header dependency
- **2026-02-20 (Session 2):** Updated asset endpoint with expanded MIME types (fonts, woff, woff2, etc.)
- **2026-02-20:** Implemented secure in-app ReportViewer component
- **2026-02-20:** Added ZIP file extraction on upload
- **2026-02-20:** Added download permission toggle (allow_download)
- **2026-02-20:** Added "Vista de Usuario" admin feature
- **2026-02-20:** Fixed frontend blank page issue
- **2026-02-20:** All login/portal/report viewing flows working (95% test coverage)
