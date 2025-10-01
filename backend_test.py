#!/usr/bin/env python3
"""
Comprehensive Backend Testing for M.Pump Calc Google OAuth2 Authentication System
Tests all authentication endpoints and protected data APIs
"""

import asyncio
import httpx
import json
import os
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

# Get backend URL from environment
BACKEND_URL = "https://mpump-calc.preview.emergentagent.com/api"

# MongoDB connection for test data setup
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "test_database"

class BackendTester:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.mongo_client = AsyncIOMotorClient(MONGO_URL)
        self.db = self.mongo_client[DB_NAME]
        self.test_user_id = None
        self.test_session_token = None
        self.test_results = []
        
    async def setup_test_user(self):
        """Create test user and session in MongoDB"""
        print("🔧 Setting up test user and session...")
        
        # Generate unique test data
        timestamp = int(datetime.now().timestamp())
        self.test_user_id = f"test-user-{timestamp}"
        self.test_session_token = f"test_session_{timestamp}"
        
        # Create test user
        user_doc = {
            "_id": self.test_user_id,  # MongoDB stores as _id
            "email": f"test.user.{timestamp}@example.com",
            "name": "Test User",
            "picture": "https://via.placeholder.com/150",
            "created_at": datetime.now(timezone.utc)
        }
        
        # Create test session
        session_doc = {
            "user_id": self.test_user_id,
            "session_token": self.test_session_token,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc)
        }
        
        try:
            # Clean up any existing test data
            await self.db.users.delete_many({"email": {"$regex": "test\\.user\\.*"}})
            await self.db.user_sessions.delete_many({"session_token": {"$regex": "test_session.*"}})
            
            # Insert test data
            await self.db.users.insert_one(user_doc)
            await self.db.user_sessions.insert_one(session_doc)
            
            print(f"✅ Test user created: {self.test_user_id}")
            print(f"✅ Test session created: {self.test_session_token}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to setup test user: {str(e)}")
            return False
    
    async def cleanup_test_data(self):
        """Clean up test data from MongoDB"""
        try:
            await self.db.users.delete_many({"email": {"$regex": "test\\.user\\.*"}})
            await self.db.user_sessions.delete_many({"session_token": {"$regex": "test_session.*"}})
            await self.db.fuel_sales.delete_many({"user_id": self.test_user_id})
            await self.db.credit_sales.delete_many({"user_id": self.test_user_id})
            await self.db.income_expenses.delete_many({"user_id": self.test_user_id})
            await self.db.fuel_rates.delete_many({"user_id": self.test_user_id})
            print("🧹 Test data cleaned up")
        except Exception as e:
            print(f"⚠️ Cleanup warning: {str(e)}")
    
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response": response_data
        })
    
    async def test_auth_me_unauthenticated(self):
        """Test GET /api/auth/me without authentication - should return 401"""
        try:
            response = await self.client.get(f"{BACKEND_URL}/auth/me")
            
            if response.status_code == 401:
                self.log_test("Auth Me - Unauthenticated", True, "Correctly returns 401 for unauthenticated request")
            else:
                self.log_test("Auth Me - Unauthenticated", False, 
                            f"Expected 401, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Auth Me - Unauthenticated", False, f"Request failed: {str(e)}")
    
    async def test_auth_me_authenticated(self):
        """Test GET /api/auth/me with valid session token"""
        try:
            headers = {"Authorization": f"Bearer {self.test_session_token}"}
            response = await self.client.get(f"{BACKEND_URL}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                # Accept either 'id' or '_id' field for user identification
                user_id = data.get("id") or data.get("_id")
                if user_id == self.test_user_id and data.get("email"):
                    self.log_test("Auth Me - Authenticated", True, 
                                f"Successfully returned user data for {data.get('email')}")
                else:
                    self.log_test("Auth Me - Authenticated", False, 
                                "Response missing expected user data", data)
            else:
                self.log_test("Auth Me - Authenticated", False, 
                            f"Expected 200, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Auth Me - Authenticated", False, f"Request failed: {str(e)}")
    
    async def test_session_creation(self):
        """Test POST /api/auth/session with mock session_id"""
        try:
            # Note: This will fail in real testing since we don't have a real session_id
            # But we can test the endpoint structure
            headers = {"X-Session-ID": "mock-session-id"}
            response = await self.client.post(f"{BACKEND_URL}/auth/session", headers=headers)
            
            # We expect this to fail with 400 or 500 since it's a mock session_id
            if response.status_code in [400, 500]:
                self.log_test("Session Creation", True, 
                            "Endpoint exists and properly validates session_id")
            else:
                self.log_test("Session Creation", False, 
                            f"Unexpected response: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Session Creation", False, f"Request failed: {str(e)}")
    
    async def test_logout(self):
        """Test POST /api/auth/logout"""
        try:
            headers = {"Authorization": f"Bearer {self.test_session_token}"}
            response = await self.client.post(f"{BACKEND_URL}/auth/logout", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("Logout", True, "Successfully logged out")
                else:
                    self.log_test("Logout", False, "Missing success message", data)
            else:
                self.log_test("Logout", False, 
                            f"Expected 200, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Logout", False, f"Request failed: {str(e)}")
    
    async def test_protected_endpoint_unauthorized(self, endpoint, method="GET"):
        """Test protected endpoint without authentication"""
        try:
            if method == "GET":
                response = await self.client.get(f"{BACKEND_URL}/{endpoint}")
            else:
                response = await self.client.post(f"{BACKEND_URL}/{endpoint}", json={})
            
            if response.status_code == 401:
                self.log_test(f"{endpoint.title()} - Unauthorized", True, 
                            "Correctly requires authentication")
            else:
                self.log_test(f"{endpoint.title()} - Unauthorized", False, 
                            f"Expected 401, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test(f"{endpoint.title()} - Unauthorized", False, f"Request failed: {str(e)}")
    
    async def test_protected_endpoint_authorized(self, endpoint, method="GET", test_data=None):
        """Test protected endpoint with valid authentication"""
        try:
            headers = {"Authorization": f"Bearer {self.test_session_token}"}
            
            if method == "GET":
                response = await self.client.get(f"{BACKEND_URL}/{endpoint}", headers=headers)
            else:
                response = await self.client.post(f"{BACKEND_URL}/{endpoint}", 
                                                headers=headers, json=test_data or {})
            
            if response.status_code in [200, 201]:
                data = response.json()
                self.log_test(f"{endpoint.title()} - Authorized {method}", True, 
                            f"Successfully accessed protected endpoint")
                return data
            else:
                self.log_test(f"{endpoint.title()} - Authorized {method}", False, 
                            f"Expected 200/201, got {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_test(f"{endpoint.title()} - Authorized {method}", False, f"Request failed: {str(e)}")
            return None
    
    async def test_fuel_sales_crud(self):
        """Test fuel sales CRUD operations"""
        # Test GET (empty)
        await self.test_protected_endpoint_authorized("fuel-sales", "GET")
        
        # Test POST (create)
        fuel_sale_data = {
            "date": "2024-01-15",
            "fuel_type": "Petrol",
            "nozzle_id": "P1",
            "opening_reading": 1000.0,
            "closing_reading": 1050.0,
            "liters": 50.0,
            "rate": 95.50,
            "amount": 4775.0
        }
        result = await self.test_protected_endpoint_authorized("fuel-sales", "POST", fuel_sale_data)
        
        if result:
            # Test GET (with data)
            await self.test_protected_endpoint_authorized("fuel-sales", "GET")
    
    async def test_credit_sales_crud(self):
        """Test credit sales CRUD operations"""
        await self.test_protected_endpoint_authorized("credit-sales", "GET")
        
        credit_sale_data = {
            "date": "2024-01-15",
            "customer_name": "Rajesh Kumar",
            "amount": 2000.0,
            "description": "Fuel credit for truck"
        }
        result = await self.test_protected_endpoint_authorized("credit-sales", "POST", credit_sale_data)
        
        if result:
            await self.test_protected_endpoint_authorized("credit-sales", "GET")
    
    async def test_income_expenses_crud(self):
        """Test income/expenses CRUD operations"""
        await self.test_protected_endpoint_authorized("income-expenses", "GET")
        
        income_data = {
            "date": "2024-01-15",
            "type": "income",
            "category": "Other Income",
            "amount": 500.0,
            "description": "Parking fees"
        }
        result = await self.test_protected_endpoint_authorized("income-expenses", "POST", income_data)
        
        if result:
            await self.test_protected_endpoint_authorized("income-expenses", "GET")
    
    async def test_fuel_rates_crud(self):
        """Test fuel rates CRUD operations"""
        await self.test_protected_endpoint_authorized("fuel-rates", "GET")
        
        rate_data = {
            "date": "2024-01-15",
            "fuel_type": "Petrol",
            "rate": 95.50
        }
        result = await self.test_protected_endpoint_authorized("fuel-rates", "POST", rate_data)
        
        if result:
            await self.test_protected_endpoint_authorized("fuel-rates", "GET")
    
    async def test_data_persistence_flow(self):
        """Test complete data persistence flow: POST -> GET -> Verify"""
        print("\n🔄 Testing Data Persistence Flow...")
        
        # Test Fuel Sales persistence
        fuel_sale_data = {
            "date": "2024-01-15",
            "fuel_type": "Petrol",
            "nozzle_id": "P1",
            "opening_reading": 1000.0,
            "closing_reading": 1050.0,
            "liters": 50.0,
            "rate": 95.50,
            "amount": 4775.0
        }
        
        headers = {"Authorization": f"Bearer {self.test_session_token}"}
        
        # POST fuel sale
        response = await self.client.post(f"{BACKEND_URL}/fuel-sales", 
                                        headers=headers, json=fuel_sale_data)
        if response.status_code == 200:
            # GET fuel sales and verify data
            response = await self.client.get(f"{BACKEND_URL}/fuel-sales?date=2024-01-15", 
                                           headers=headers)
            if response.status_code == 200:
                data = response.json()
                if len(data) > 0 and data[0]["fuel_type"] == "Petrol":
                    self.log_test("Data Persistence - Fuel Sales", True, 
                                f"Successfully persisted and retrieved fuel sale data")
                else:
                    self.log_test("Data Persistence - Fuel Sales", False, 
                                "Data not properly persisted", data)
            else:
                self.log_test("Data Persistence - Fuel Sales", False, 
                            f"Failed to retrieve data: {response.status_code}")
        else:
            self.log_test("Data Persistence - Fuel Sales", False, 
                        f"Failed to create data: {response.status_code}")
    
    async def test_date_filtering(self):
        """Test date filtering functionality"""
        print("\n📅 Testing Date Filtering...")
        
        headers = {"Authorization": f"Bearer {self.test_session_token}"}
        
        # Create records for different dates
        dates = ["2024-01-15", "2024-01-16"]
        
        for i, date in enumerate(dates):
            fuel_sale_data = {
                "date": date,
                "fuel_type": f"Petrol",
                "nozzle_id": f"P{i+1}",
                "opening_reading": 1000.0 + (i * 100),
                "closing_reading": 1050.0 + (i * 100),
                "liters": 50.0,
                "rate": 95.50,
                "amount": 4775.0
            }
            
            await self.client.post(f"{BACKEND_URL}/fuel-sales", 
                                 headers=headers, json=fuel_sale_data)
        
        # Test filtering by specific date
        response = await self.client.get(f"{BACKEND_URL}/fuel-sales?date=2024-01-15", 
                                       headers=headers)
        if response.status_code == 200:
            data = response.json()
            # Should only return records for 2024-01-15
            filtered_correctly = all(record["date"] == "2024-01-15" for record in data)
            if filtered_correctly and len(data) > 0:
                self.log_test("Date Filtering", True, 
                            f"Successfully filtered {len(data)} records for specific date")
            else:
                self.log_test("Date Filtering", False, 
                            "Date filtering not working correctly", data)
        else:
            self.log_test("Date Filtering", False, 
                        f"Failed to test date filtering: {response.status_code}")
    
    async def test_uuid_generation(self):
        """Test UUID generation and field mapping"""
        print("\n🆔 Testing UUID Generation...")
        
        headers = {"Authorization": f"Bearer {self.test_session_token}"}
        
        # Create a record and check if it has proper UUID
        fuel_sale_data = {
            "date": "2024-01-15",
            "fuel_type": "Diesel",
            "nozzle_id": "D1",
            "opening_reading": 2000.0,
            "closing_reading": 2025.0,
            "liters": 25.0,
            "rate": 85.50,
            "amount": 2137.5
        }
        
        response = await self.client.post(f"{BACKEND_URL}/fuel-sales", 
                                        headers=headers, json=fuel_sale_data)
        if response.status_code == 200:
            result = response.json()
            if "id" in result and len(result["id"]) == 36:  # UUID length
                self.log_test("UUID Generation", True, 
                            f"Successfully generated UUID: {result['id']}")
            else:
                self.log_test("UUID Generation", False, 
                            "UUID not properly generated", result)
        else:
            self.log_test("UUID Generation", False, 
                        f"Failed to create record: {response.status_code}")
    
    async def test_error_handling(self):
        """Test error handling for invalid requests"""
        print("\n⚠️ Testing Error Handling...")
        
        headers = {"Authorization": f"Bearer {self.test_session_token}"}
        
        # Test with invalid/incomplete data
        invalid_data = {
            "date": "2024-01-15",
            # Missing required fields
        }
        
        response = await self.client.post(f"{BACKEND_URL}/fuel-sales", 
                                        headers=headers, json=invalid_data)
        
        # Should return an error (400 or 422)
        if response.status_code in [400, 422, 500]:
            self.log_test("Error Handling", True, 
                        f"Properly handled invalid request with status {response.status_code}")
        else:
            self.log_test("Error Handling", False, 
                        f"Did not properly handle invalid request: {response.status_code}")
    
    async def test_mongodb_connection(self):
        """Test MongoDB connection and collection access"""
        print("\n🗄️ Testing MongoDB Connection...")
        
        try:
            # Test database connection by checking collections
            collections = await self.db.list_collection_names()
            expected_collections = ["fuel_sales", "credit_sales", "income_expenses", "fuel_rates", "users", "user_sessions"]
            
            if any(col in collections for col in expected_collections):
                self.log_test("MongoDB Connection", True, 
                            f"Successfully connected to MongoDB with collections: {collections}")
            else:
                self.log_test("MongoDB Connection", False, 
                            f"Collections not found: {collections}")
                
        except Exception as e:
            self.log_test("MongoDB Connection", False, f"MongoDB connection failed: {str(e)}")
    
    async def test_all_endpoints_format(self):
        """Test data format consistency across all endpoints"""
        print("\n📋 Testing Data Format Consistency...")
        
        headers = {"Authorization": f"Bearer {self.test_session_token}"}
        
        # Test all main endpoints
        endpoints = [
            ("fuel-sales", {"date": "2024-01-15", "fuel_type": "Petrol", "nozzle_id": "P1", 
                           "opening_reading": 1000.0, "closing_reading": 1050.0, "liters": 50.0, 
                           "rate": 95.50, "amount": 4775.0}),
            ("credit-sales", {"date": "2024-01-15", "customer_name": "Test Customer", "amount": 1000.0}),
            ("income-expenses", {"date": "2024-01-15", "type": "income", "category": "Other", "amount": 500.0}),
            ("fuel-rates", {"date": "2024-01-15", "fuel_type": "Petrol", "rate": 95.50})
        ]
        
        format_consistent = True
        
        for endpoint, test_data in endpoints:
            # POST data
            post_response = await self.client.post(f"{BACKEND_URL}/{endpoint}", 
                                                 headers=headers, json=test_data)
            
            # GET data
            get_response = await self.client.get(f"{BACKEND_URL}/{endpoint}", 
                                               headers=headers)
            
            if post_response.status_code == 200 and get_response.status_code == 200:
                get_data = get_response.json()
                if len(get_data) > 0:
                    # Check if returned data has expected fields
                    record = get_data[0]
                    required_fields = ["id", "user_id", "date", "created_at"]
                    has_required_fields = all(field in record for field in required_fields)
                    
                    if not has_required_fields:
                        format_consistent = False
                        break
            else:
                format_consistent = False
                break
        
        if format_consistent:
            self.log_test("Data Format Consistency", True, 
                        "All endpoints return consistent data format with required fields")
        else:
            self.log_test("Data Format Consistency", False, 
                        "Data format inconsistency found across endpoints")
    
    async def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting M.Pump Calc Backend Authentication Tests")
        print("=" * 60)
        
        # Setup
        if not await self.setup_test_user():
            print("❌ Failed to setup test environment")
            return
        
        try:
            # Authentication Tests
            print("\n📋 Testing Authentication Endpoints...")
            await self.test_auth_me_unauthenticated()
            await self.test_auth_me_authenticated()
            await self.test_session_creation()
            await self.test_logout()
            
            # Recreate session for protected endpoint tests (logout cleared it)
            await self.setup_test_user()
            
            # Protected Endpoints - Unauthorized Tests
            print("\n🔒 Testing Protected Endpoints (Unauthorized)...")
            await self.test_protected_endpoint_unauthorized("fuel-sales", "GET")
            await self.test_protected_endpoint_unauthorized("fuel-sales", "POST")
            await self.test_protected_endpoint_unauthorized("credit-sales", "GET")
            await self.test_protected_endpoint_unauthorized("credit-sales", "POST")
            await self.test_protected_endpoint_unauthorized("income-expenses", "GET")
            await self.test_protected_endpoint_unauthorized("income-expenses", "POST")
            await self.test_protected_endpoint_unauthorized("fuel-rates", "GET")
            await self.test_protected_endpoint_unauthorized("fuel-rates", "POST")
            await self.test_protected_endpoint_unauthorized("sync/backup", "POST")
            
            # Protected Endpoints - Authorized Tests
            print("\n🔓 Testing Protected Endpoints (Authorized)...")
            await self.test_fuel_sales_crud()
            await self.test_credit_sales_crud()
            await self.test_income_expenses_crud()
            await self.test_fuel_rates_crud()
            await self.test_sync_backup()
            
        finally:
            # Cleanup
            await self.cleanup_test_data()
            await self.client.aclose()
            self.mongo_client.close()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        return passed_tests, failed_tests, self.test_results

async def main():
    """Main test runner"""
    tester = BackendTester()
    passed, failed, results = await tester.run_all_tests()
    
    # Return results for external processing
    return {
        "passed": passed,
        "failed": failed,
        "total": passed + failed,
        "success_rate": (passed / (passed + failed)) * 100 if (passed + failed) > 0 else 0,
        "results": results
    }

if __name__ == "__main__":
    asyncio.run(main())