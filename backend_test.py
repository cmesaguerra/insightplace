#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for InsightPlace Client Portal
Tests authentication, admin endpoints, client endpoints, and database initialization
"""

import requests
import json
import os
from datetime import datetime
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_test_header(test_name):
    print(f"\n{Colors.BLUE}{Colors.BOLD}=== {test_name} ==={Colors.ENDC}")

def print_success(message):
    print(f"{Colors.GREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}❌ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.ENDC}")

class InsightPlaceAPITester:
    def __init__(self):
        self.admin_token = None
        self.client_token = None
        self.admin_user = None
        self.client_user = None
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }

    def make_request(self, method, endpoint, data=None, headers=None, token=None):
        """Make HTTP request with proper error handling"""
        url = f"{API_BASE}{endpoint}"
        
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method.upper() == 'POST':
                if isinstance(data, dict):
                    response = requests.post(url, json=data, headers=headers, timeout=10)
                else:
                    response = requests.post(url, data=data, headers=headers, timeout=10)
            elif method.upper() == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print_error(f"Request failed: {e}")
            return None

    def test_health_check(self):
        """Test basic health check endpoint"""
        print_test_header("Health Check")
        
        response = self.make_request('GET', '/health')
        if response and response.status_code == 200:
            data = response.json()
            if data.get('status') == 'healthy':
                print_success("Health check passed")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Health check failed: {data}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Health check endpoint failed: {response.status_code if response else 'No response'}")
            self.test_results['failed'] += 1
            return False

    def test_admin_login(self):
        """Test admin login with credentials: admin@insightplace.com / admin123"""
        print_test_header("Admin Login Test")
        
        login_data = {
            "email": "admin@insightplace.com",
            "password": "admin123"
        }
        
        response = self.make_request('POST', '/auth/login', login_data)
        if response and response.status_code == 200:
            data = response.json()
            if 'access_token' in data and 'user' in data:
                self.admin_token = data['access_token']
                self.admin_user = data['user']
                print_success(f"Admin login successful - User: {self.admin_user['email']}, Role: {self.admin_user['role']}")
                print_info(f"Company: {data.get('company', {}).get('name', 'Unknown')}")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Admin login response missing required fields: {data}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Admin login failed: {response.status_code if response else 'No response'}")
            if response:
                print_error(f"Response: {response.text}")
            self.test_results['failed'] += 1
            return False

    def test_demo_user_login(self):
        """Test demo user login with credentials: carlos.mesa@palomavalencia.com / password123"""
        print_test_header("Demo User Login Test")
        
        login_data = {
            "email": "carlos.mesa@palomavalencia.com",
            "password": "password123"
        }
        
        response = self.make_request('POST', '/auth/login', login_data)
        if response and response.status_code == 200:
            data = response.json()
            if 'access_token' in data and 'user' in data:
                self.client_token = data['access_token']
                self.client_user = data['user']
                print_success(f"Demo user login successful - User: {self.client_user['email']}, Role: {self.client_user['role']}")
                print_info(f"Company: {data.get('company', {}).get('name', 'Unknown')}")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Demo user login response missing required fields: {data}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Demo user login failed: {response.status_code if response else 'No response'}")
            if response:
                print_error(f"Response: {response.text}")
            self.test_results['failed'] += 1
            return False

    def test_invalid_login(self):
        """Test invalid login attempts"""
        print_test_header("Invalid Login Test")
        
        # Test with wrong password
        login_data = {
            "email": "admin@insightplace.com",
            "password": "wrongpassword"
        }
        
        response = self.make_request('POST', '/auth/login', login_data)
        if response and response.status_code == 401:
            print_success("Invalid password correctly rejected")
            self.test_results['passed'] += 1
        else:
            print_error(f"Invalid password should return 401, got: {response.status_code if response else 'No response'}")
            self.test_results['failed'] += 1
            return False
        
        # Test with non-existent user
        login_data = {
            "email": "nonexistent@example.com",
            "password": "password123"
        }
        
        response = self.make_request('POST', '/auth/login', login_data)
        if response and response.status_code == 401:
            print_success("Non-existent user correctly rejected")
            self.test_results['passed'] += 1
            return True
        else:
            print_error(f"Non-existent user should return 401, got: {response.status_code if response else 'No response'}")
            self.test_results['failed'] += 1
            return False

    def test_token_validation(self):
        """Test token validation with /auth/me endpoint"""
        print_test_header("Token Validation Test")
        
        if not self.admin_token:
            print_error("No admin token available for validation test")
            self.test_results['failed'] += 1
            return False
        
        response = self.make_request('GET', '/auth/me', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            if data.get('email') == 'admin@insightplace.com':
                print_success("Token validation successful")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Token validation returned wrong user: {data}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Token validation failed: {response.status_code if response else 'No response'}")
            self.test_results['failed'] += 1
            return False

    def test_admin_dashboard(self):
        """Test GET /api/admin/dashboard"""
        print_test_header("Admin Dashboard Test")
        
        if not self.admin_token:
            print_error("No admin token available for dashboard test")
            self.test_results['failed'] += 1
            return False
        
        response = self.make_request('GET', '/admin/dashboard', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            required_fields = ['total_companies', 'total_users', 'total_reports', 'total_access_logs', 'recent_activities']
            
            missing_fields = [field for field in required_fields if field not in data]
            if not missing_fields:
                print_success(f"Dashboard stats retrieved successfully")
                print_info(f"Companies: {data['total_companies']}, Users: {data['total_users']}, Reports: {data['total_reports']}")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Dashboard response missing fields: {missing_fields}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Admin dashboard failed: {response.status_code if response else 'No response'}")
            if response:
                print_error(f"Response: {response.text}")
            self.test_results['failed'] += 1
            return False

    def test_admin_companies(self):
        """Test GET /api/admin/companies"""
        print_test_header("Admin Companies Test")
        
        if not self.admin_token:
            print_error("No admin token available for companies test")
            self.test_results['failed'] += 1
            return False
        
        response = self.make_request('GET', '/admin/companies', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                company_names = [company.get('name') for company in data]
                print_success(f"Companies retrieved successfully: {len(data)} companies")
                print_info(f"Company names: {company_names}")
                
                # Check for expected companies
                expected_companies = ['InsightPlace Admin', 'Campaña Paloma Valencia']
                found_companies = [name for name in expected_companies if name in company_names]
                
                if len(found_companies) == len(expected_companies):
                    print_success("All expected companies found")
                else:
                    print_warning(f"Expected companies not all found. Found: {found_companies}")
                
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Companies response should be a list, got: {type(data)}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Admin companies failed: {response.status_code if response else 'No response'}")
            if response:
                print_error(f"Response: {response.text}")
            self.test_results['failed'] += 1
            return False

    def test_admin_users(self):
        """Test GET /api/admin/users"""
        print_test_header("Admin Users Test")
        
        if not self.admin_token:
            print_error("No admin token available for users test")
            self.test_results['failed'] += 1
            return False
        
        response = self.make_request('GET', '/admin/users', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                user_emails = [user.get('email') for user in data]
                print_success(f"Users retrieved successfully: {len(data)} users")
                print_info(f"User emails: {user_emails}")
                
                # Check for expected users
                expected_users = ['admin@insightplace.com', 'carlos.mesa@palomavalencia.com']
                found_users = [email for email in expected_users if email in user_emails]
                
                if len(found_users) == len(expected_users):
                    print_success("All expected users found")
                else:
                    print_warning(f"Expected users not all found. Found: {found_users}")
                
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Users response should be a list, got: {type(data)}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Admin users failed: {response.status_code if response else 'No response'}")
            if response:
                print_error(f"Response: {response.text}")
            self.test_results['failed'] += 1
            return False

    def test_admin_reports(self):
        """Test GET /api/admin/reports"""
        print_test_header("Admin Reports Test")
        
        if not self.admin_token:
            print_error("No admin token available for reports test")
            self.test_results['failed'] += 1
            return False
        
        response = self.make_request('GET', '/admin/reports', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success(f"Reports retrieved successfully: {len(data)} reports")
                if data:
                    print_info(f"Sample report titles: {[report.get('title') for report in data[:3]]}")
                else:
                    print_info("No reports found (this is normal for a fresh installation)")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Reports response should be a list, got: {type(data)}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Admin reports failed: {response.status_code if response else 'No response'}")
            if response:
                print_error(f"Response: {response.text}")
            self.test_results['failed'] += 1
            return False

    def test_admin_activity_logs(self):
        """Test GET /api/admin/activity-logs"""
        print_test_header("Admin Activity Logs Test")
        
        if not self.admin_token:
            print_error("No admin token available for activity logs test")
            self.test_results['failed'] += 1
            return False
        
        response = self.make_request('GET', '/admin/activity-logs', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success(f"Activity logs retrieved successfully: {len(data)} logs")
                if data:
                    recent_activities = [f"{log.get('activity_type')}: {log.get('description')}" for log in data[:3]]
                    print_info(f"Recent activities: {recent_activities}")
                else:
                    print_info("No activity logs found")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Activity logs response should be a list, got: {type(data)}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Admin activity logs failed: {response.status_code if response else 'No response'}")
            if response:
                print_error(f"Response: {response.text}")
            self.test_results['failed'] += 1
            return False

    def test_client_reports(self):
        """Test GET /api/client/reports (authenticated)"""
        print_test_header("Client Reports Test")
        
        if not self.client_token:
            print_error("No client token available for client reports test")
            self.test_results['failed'] += 1
            return False
        
        response = self.make_request('GET', '/client/reports', token=self.client_token)
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success(f"Client reports retrieved successfully: {len(data)} reports")
                if data:
                    print_info(f"Report titles: {[report.get('title') for report in data]}")
                else:
                    print_info("No reports found for this client (normal for fresh installation)")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Client reports response should be a list, got: {type(data)}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Client reports failed: {response.status_code if response else 'No response'}")
            if response:
                print_error(f"Response: {response.text}")
            self.test_results['failed'] += 1
            return False

    def test_client_company(self):
        """Test GET /api/client/company (authenticated)"""
        print_test_header("Client Company Test")
        
        if not self.client_token:
            print_error("No client token available for client company test")
            self.test_results['failed'] += 1
            return False
        
        response = self.make_request('GET', '/client/company', token=self.client_token)
        if response and response.status_code == 200:
            data = response.json()
            if 'name' in data and 'id' in data:
                print_success(f"Client company retrieved successfully: {data['name']}")
                print_info(f"Company ID: {data['id']}")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Client company response missing required fields: {data}")
                self.test_results['failed'] += 1
                return False
        else:
            print_error(f"Client company failed: {response.status_code if response else 'No response'}")
            if response:
                print_error(f"Response: {response.text}")
            self.test_results['failed'] += 1
            return False

    def test_unauthorized_access(self):
        """Test that endpoints properly reject unauthorized access"""
        print_test_header("Unauthorized Access Test")
        
        # Test admin endpoint without token
        response = self.make_request('GET', '/admin/dashboard')
        if response and response.status_code == 401:
            print_success("Admin endpoint correctly rejects unauthorized access")
            self.test_results['passed'] += 1
        else:
            print_error(f"Admin endpoint should return 401 for unauthorized access, got: {response.status_code if response else 'No response'}")
            self.test_results['failed'] += 1
            return False
        
        # Test client endpoint without token
        response = self.make_request('GET', '/client/reports')
        if response and response.status_code == 401:
            print_success("Client endpoint correctly rejects unauthorized access")
            self.test_results['passed'] += 1
            return True
        else:
            print_error(f"Client endpoint should return 401 for unauthorized access, got: {response.status_code if response else 'No response'}")
            self.test_results['failed'] += 1
            return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"{Colors.BOLD}InsightPlace Client Portal API Backend Testing{Colors.ENDC}")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Base: {API_BASE}")
        print("=" * 60)
        
        # Basic connectivity
        self.test_health_check()
        
        # Authentication tests
        self.test_admin_login()
        self.test_demo_user_login()
        self.test_invalid_login()
        self.test_token_validation()
        
        # Admin endpoint tests
        self.test_admin_dashboard()
        self.test_admin_companies()
        self.test_admin_users()
        self.test_admin_reports()
        self.test_admin_activity_logs()
        
        # Client endpoint tests
        self.test_client_reports()
        self.test_client_company()
        
        # Security tests
        self.test_unauthorized_access()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print(f"\n{Colors.BOLD}=== TEST SUMMARY ==={Colors.ENDC}")
        total_tests = self.test_results['passed'] + self.test_results['failed']
        
        if self.test_results['failed'] == 0:
            print(f"{Colors.GREEN}✅ All {total_tests} tests passed!{Colors.ENDC}")
        else:
            print(f"{Colors.RED}❌ {self.test_results['failed']} out of {total_tests} tests failed{Colors.ENDC}")
            print(f"{Colors.GREEN}✅ {self.test_results['passed']} tests passed{Colors.ENDC}")
        
        if self.test_results['errors']:
            print(f"\n{Colors.RED}Errors encountered:{Colors.ENDC}")
            for error in self.test_results['errors']:
                print(f"  - {error}")

if __name__ == "__main__":
    tester = InsightPlaceAPITester()
    tester.run_all_tests()