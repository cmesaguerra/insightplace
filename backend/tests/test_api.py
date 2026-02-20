"""
Backend API Tests for InsightPlace Client Portal
Tests cover: Auth, Admin Panel, Client Portal APIs
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://access-control-178.preview.emergentagent.com').rstrip('/')

# Test Credentials
ADMIN_EMAIL = "admin@insightplace.com"
ADMIN_PASSWORD = "admin123"
CLIENT_EMAIL = "carlos.mesa@palomavalencia.com"
CLIENT_PASSWORD = "password123"


class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_health_check(self):
        """API health check should return healthy"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ Health check passed")

    def test_root_endpoint(self):
        """Root API endpoint should be accessible"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print("✓ Root API endpoint passed")


class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Admin should login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "access_token" in data
        assert "user" in data
        assert "company" in data
        
        # Verify user data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "admin"
        
        print(f"✓ Admin login successful, token received")
        return data["access_token"]

    def test_admin_login_wrong_password(self):
        """Admin login with wrong password should fail"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Admin login with wrong password correctly rejected")

    def test_admin_login_wrong_email(self):
        """Admin login with non-existent email should fail"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 401
        print("✓ Admin login with non-existent email correctly rejected")


class TestClientAuth:
    """Client authentication tests"""
    
    def test_client_login_success(self):
        """Client should login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "access_token" in data
        assert "user" in data
        assert "company" in data
        
        # Verify user data
        assert data["user"]["email"] == CLIENT_EMAIL
        assert data["user"]["role"] == "client"
        
        # Verify company data
        assert data["company"]["name"] == "Campaña Paloma Valencia"
        
        print(f"✓ Client login successful, company: {data['company']['name']}")
        return data["access_token"]

    def test_client_login_wrong_password(self):
        """Client login with wrong password should fail"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Client login with wrong password correctly rejected")


class TestAdminDashboard:
    """Admin dashboard and stats tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login as admin before each test"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            self.token = response.json()["access_token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            pytest.skip("Admin authentication failed")
    
    def test_get_dashboard_stats(self):
        """Admin should access dashboard stats"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "total_companies" in data
        assert "total_users" in data
        assert "total_reports" in data
        assert "total_access_logs" in data
        assert "recent_activities" in data
        
        # Verify data types
        assert isinstance(data["total_companies"], int)
        assert isinstance(data["total_users"], int)
        assert isinstance(data["total_reports"], int)
        assert isinstance(data["recent_activities"], list)
        
        print(f"✓ Dashboard stats: {data['total_companies']} companies, {data['total_users']} users, {data['total_reports']} reports")

    def test_get_companies(self):
        """Admin should get list of companies"""
        response = requests.get(f"{BASE_URL}/api/admin/companies", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 2  # At least admin and paloma valencia companies
        
        # Verify company structure
        for company in data:
            assert "id" in company
            assert "name" in company
            assert "active" in company
            assert "created_at" in company
        
        print(f"✓ Got {len(data)} companies")

    def test_get_users(self):
        """Admin should get list of users"""
        response = requests.get(f"{BASE_URL}/api/admin/users", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 2  # At least admin and demo client
        
        # Verify user structure
        for user in data:
            assert "id" in user
            assert "email" in user
            assert "full_name" in user
            assert "role" in user
            assert "active" in user
        
        print(f"✓ Got {len(data)} users")

    def test_get_reports(self):
        """Admin should get list of reports"""
        response = requests.get(f"{BASE_URL}/api/admin/reports", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} reports")

    def test_get_activity_logs(self):
        """Admin should get activity logs"""
        response = requests.get(f"{BASE_URL}/api/admin/activity-logs", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        
        # Verify log structure if logs exist
        if len(data) > 0:
            log = data[0]
            assert "id" in log
            assert "activity_type" in log
            assert "description" in log
            assert "timestamp" in log
        
        print(f"✓ Got {len(data)} activity logs")


class TestAdminCompanyManagement:
    """Admin company management tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login as admin before each test"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            self.token = response.json()["access_token"]
            self.headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
        else:
            pytest.skip("Admin authentication failed")
    
    def test_create_company(self):
        """Admin should create a new company"""
        import uuid
        test_company_name = f"TEST_Company_{uuid.uuid4().hex[:8]}"
        
        response = requests.post(
            f"{BASE_URL}/api/admin/companies",
            headers=self.headers,
            json={
                "name": test_company_name,
                "description": "Test company created by API tests"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["name"] == test_company_name
        assert data["description"] == "Test company created by API tests"
        assert data["active"] == True
        assert "id" in data
        
        # Verify by getting companies list
        get_response = requests.get(f"{BASE_URL}/api/admin/companies", headers=self.headers)
        companies = get_response.json()
        company_names = [c["name"] for c in companies]
        assert test_company_name in company_names
        
        print(f"✓ Created and verified company: {test_company_name}")

    def test_create_duplicate_company_fails(self):
        """Creating duplicate company should fail"""
        response = requests.post(
            f"{BASE_URL}/api/admin/companies",
            headers=self.headers,
            json={
                "name": "InsightPlace Admin",  # Already exists
                "description": "Duplicate test"
            }
        )
        
        assert response.status_code == 400
        print("✓ Duplicate company creation correctly rejected")


class TestAdminUserManagement:
    """Admin user management tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login as admin and get a company ID"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            self.token = response.json()["access_token"]
            self.headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
            
            # Get a company to assign users to
            companies_response = requests.get(f"{BASE_URL}/api/admin/companies", headers=self.headers)
            companies = companies_response.json()
            self.company_id = next((c["id"] for c in companies if c["name"] == "Campaña Paloma Valencia"), None)
        else:
            pytest.skip("Admin authentication failed")
    
    def test_create_user(self):
        """Admin should create a new user"""
        import uuid
        test_email = f"TEST_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(
            f"{BASE_URL}/api/admin/users",
            headers=self.headers,
            json={
                "email": test_email,
                "full_name": "Test User",
                "password": "testpass123",
                "company_id": self.company_id,
                "role": "client"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["email"] == test_email
        assert data["full_name"] == "Test User"
        assert data["role"] == "client"
        assert data["company_id"] == self.company_id
        assert data["active"] == True
        
        # Verify by getting users list
        get_response = requests.get(f"{BASE_URL}/api/admin/users", headers=self.headers)
        users = get_response.json()
        user_emails = [u["email"] for u in users]
        assert test_email in user_emails
        
        print(f"✓ Created and verified user: {test_email}")

    def test_create_duplicate_user_fails(self):
        """Creating duplicate user should fail"""
        response = requests.post(
            f"{BASE_URL}/api/admin/users",
            headers=self.headers,
            json={
                "email": CLIENT_EMAIL,  # Already exists
                "full_name": "Duplicate User",
                "password": "testpass123",
                "company_id": self.company_id,
                "role": "client"
            }
        )
        
        assert response.status_code == 400
        print("✓ Duplicate user creation correctly rejected")


class TestAdminAccessControl:
    """Admin access control tests"""
    
    def test_admin_endpoints_require_auth(self):
        """Admin endpoints should require authentication"""
        endpoints = [
            "/api/admin/dashboard",
            "/api/admin/companies",
            "/api/admin/users",
            "/api/admin/reports",
            "/api/admin/activity-logs"
        ]
        
        for endpoint in endpoints:
            response = requests.get(f"{BASE_URL}{endpoint}")
            assert response.status_code in [401, 403], f"Endpoint {endpoint} should require auth"
        
        print("✓ All admin endpoints require authentication")

    def test_client_cannot_access_admin_endpoints(self):
        """Client users should not access admin endpoints"""
        # Login as client
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        client_token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {client_token}"}
        
        # Try accessing admin endpoints
        endpoints = [
            "/api/admin/dashboard",
            "/api/admin/companies",
            "/api/admin/users"
        ]
        
        for endpoint in endpoints:
            response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
            assert response.status_code == 403, f"Client should not access {endpoint}"
        
        print("✓ Client correctly denied access to admin endpoints")


class TestClientPortal:
    """Client portal tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login as client before each test"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        if response.status_code == 200:
            data = response.json()
            self.token = data["access_token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
            self.company = data["company"]
        else:
            pytest.skip("Client authentication failed")
    
    def test_get_client_reports(self):
        """Client should access their reports"""
        response = requests.get(f"{BASE_URL}/api/client/reports", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        print(f"✓ Client has access to {len(data)} reports")

    def test_get_company_info(self):
        """Client should access their company info"""
        response = requests.get(f"{BASE_URL}/api/client/company", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert data["name"] == "Campaña Paloma Valencia"
        assert "id" in data
        assert data["active"] == True
        
        print(f"✓ Client company info: {data['name']}")


class TestLogout:
    """Logout tests"""
    
    def test_logout_success(self):
        """Logout should succeed and be logged"""
        # First login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Then logout
        response = requests.post(f"{BASE_URL}/api/auth/logout", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Successfully logged out"
        
        print("✓ Logout successful")


class TestCurrentUser:
    """Current user info tests"""
    
    def test_get_current_user_admin(self):
        """Get current user info for admin"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        
        print(f"✓ Current user info: {data['email']} ({data['role']})")

    def test_get_current_user_client(self):
        """Get current user info for client"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        assert data["email"] == CLIENT_EMAIL
        assert data["role"] == "client"
        
        print(f"✓ Current user info: {data['email']} ({data['role']})")
