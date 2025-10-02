#!/usr/bin/env python3
"""
Focused Testing for M.Pump Calc Fuel Rates Saving Functionality
Tests specifically the fuel rates API endpoints that the user reports as not working
"""

import asyncio
import httpx
import json
import os
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

# Get backend URL from environment
BACKEND_URL = "https://pumpcalc-mobile.preview.emergentagent.com/api"

# MongoDB connection for test data setup
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "test_database"

class FuelRatesTester:
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
            "_id": self.test_user_id,
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
    
    async def test_fuel_rates_get_unauthorized(self):
        """Test GET /api/fuel-rates without authentication"""
        try:
            response = await self.client.get(f"{BACKEND_URL}/fuel-rates")
            
            if response.status_code == 401:
                self.log_test("GET Fuel Rates - Unauthorized", True, "Correctly requires authentication")
            else:
                self.log_test("GET Fuel Rates - Unauthorized", False, 
                            f"Expected 401, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("GET Fuel Rates - Unauthorized", False, f"Request failed: {str(e)}")
    
    async def test_fuel_rates_post_unauthorized(self):
        """Test POST /api/fuel-rates without authentication"""
        try:
            test_data = {
                "date": "2025-10-01",
                "fuel_type": "Petrol",
                "rate": 102.50
            }
            response = await self.client.post(f"{BACKEND_URL}/fuel-rates", json=test_data)
            
            if response.status_code == 401:
                self.log_test("POST Fuel Rates - Unauthorized", True, "Correctly requires authentication")
            else:
                self.log_test("POST Fuel Rates - Unauthorized", False, 
                            f"Expected 401, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("POST Fuel Rates - Unauthorized", False, f"Request failed: {str(e)}")
    
    async def test_fuel_rates_get_empty(self):
        """Test GET /api/fuel-rates with authentication (empty database)"""
        try:
            headers = {"Authorization": f"Bearer {self.test_session_token}"}
            response = await self.client.get(f"{BACKEND_URL}/fuel-rates", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) == 0:
                    self.log_test("GET Fuel Rates - Empty", True, "Successfully returns empty array")
                else:
                    self.log_test("GET Fuel Rates - Empty", False, 
                                f"Expected empty array, got: {data}")
            else:
                self.log_test("GET Fuel Rates - Empty", False, 
                            f"Expected 200, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("GET Fuel Rates - Empty", False, f"Request failed: {str(e)}")
    
    async def test_fuel_rates_create_petrol(self):
        """Test creating fuel rate for Petrol at ₹102.50"""
        try:
            headers = {"Authorization": f"Bearer {self.test_session_token}"}
            test_data = {
                "date": "2025-10-01",
                "fuel_type": "Petrol",
                "rate": 102.50
            }
            
            response = await self.client.post(f"{BACKEND_URL}/fuel-rates", 
                                            headers=headers, json=test_data)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "id" in data:
                    self.log_test("Create Petrol Rate", True, 
                                f"Successfully created Petrol rate: {data['id']}")
                    return data["id"]
                else:
                    self.log_test("Create Petrol Rate", False, 
                                "Missing expected response fields", data)
            else:
                self.log_test("Create Petrol Rate", False, 
                            f"Expected 200, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Create Petrol Rate", False, f"Request failed: {str(e)}")
        
        return None
    
    async def test_fuel_rates_create_diesel(self):
        """Test creating fuel rate for Diesel at ₹89.75"""
        try:
            headers = {"Authorization": f"Bearer {self.test_session_token}"}
            test_data = {
                "date": "2025-10-01",
                "fuel_type": "Diesel",
                "rate": 89.75
            }
            
            response = await self.client.post(f"{BACKEND_URL}/fuel-rates", 
                                            headers=headers, json=test_data)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "id" in data:
                    self.log_test("Create Diesel Rate", True, 
                                f"Successfully created Diesel rate: {data['id']}")
                    return data["id"]
                else:
                    self.log_test("Create Diesel Rate", False, 
                                "Missing expected response fields", data)
            else:
                self.log_test("Create Diesel Rate", False, 
                            f"Expected 200, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Create Diesel Rate", False, f"Request failed: {str(e)}")
        
        return None
    
    async def test_fuel_rates_retrieve_all(self):
        """Test retrieving all fuel rates to verify they were saved"""
        try:
            headers = {"Authorization": f"Bearer {self.test_session_token}"}
            response = await self.client.get(f"{BACKEND_URL}/fuel-rates", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) >= 2:
                    # Check if we have both Petrol and Diesel rates
                    fuel_types = [rate["fuel_type"] for rate in data]
                    rates = {rate["fuel_type"]: rate["rate"] for rate in data}
                    
                    if "Petrol" in fuel_types and "Diesel" in fuel_types:
                        petrol_rate = rates.get("Petrol")
                        diesel_rate = rates.get("Diesel")
                        
                        if petrol_rate == 102.50 and diesel_rate == 89.75:
                            self.log_test("Retrieve All Rates", True, 
                                        f"Successfully retrieved both rates: Petrol=₹{petrol_rate}, Diesel=₹{diesel_rate}")
                        else:
                            self.log_test("Retrieve All Rates", False, 
                                        f"Rate values incorrect: Petrol=₹{petrol_rate}, Diesel=₹{diesel_rate}")
                    else:
                        self.log_test("Retrieve All Rates", False, 
                                    f"Missing fuel types. Found: {fuel_types}")
                else:
                    self.log_test("Retrieve All Rates", False, 
                                f"Expected at least 2 rates, got {len(data) if isinstance(data, list) else 'non-array'}")
            else:
                self.log_test("Retrieve All Rates", False, 
                            f"Expected 200, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Retrieve All Rates", False, f"Request failed: {str(e)}")
    
    async def test_fuel_rates_date_filtering(self):
        """Test retrieving fuel rates with date filtering"""
        try:
            headers = {"Authorization": f"Bearer {self.test_session_token}"}
            response = await self.client.get(f"{BACKEND_URL}/fuel-rates?date=2025-10-01", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    # All returned rates should be for the specified date
                    correct_dates = all(rate["date"] == "2025-10-01" for rate in data)
                    if correct_dates and len(data) > 0:
                        self.log_test("Date Filtering", True, 
                                    f"Successfully filtered {len(data)} rates for 2025-10-01")
                    elif len(data) == 0:
                        self.log_test("Date Filtering", False, 
                                    "No rates found for the specified date")
                    else:
                        self.log_test("Date Filtering", False, 
                                    "Date filtering returned incorrect dates")
                else:
                    self.log_test("Date Filtering", False, 
                                f"Expected array, got: {type(data)}")
            else:
                self.log_test("Date Filtering", False, 
                            f"Expected 200, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Date Filtering", False, f"Request failed: {str(e)}")
    
    async def test_invalid_data_handling(self):
        """Test error handling for invalid fuel rate data"""
        try:
            headers = {"Authorization": f"Bearer {self.test_session_token}"}
            
            # Test cases for invalid data
            invalid_test_cases = [
                ({}, "Empty data"),
                ({"date": "2025-10-01"}, "Missing fuel_type and rate"),
                ({"fuel_type": "Petrol"}, "Missing date and rate"),
                ({"rate": 102.50}, "Missing date and fuel_type"),
                ({"date": "invalid-date", "fuel_type": "Petrol", "rate": 102.50}, "Invalid date format"),
                ({"date": "2025-10-01", "fuel_type": "", "rate": 102.50}, "Empty fuel_type"),
                ({"date": "2025-10-01", "fuel_type": "Petrol", "rate": "invalid"}, "Invalid rate type"),
                ({"date": "2025-10-01", "fuel_type": "Petrol", "rate": -10.50}, "Negative rate"),
            ]
            
            for invalid_data, description in invalid_test_cases:
                response = await self.client.post(f"{BACKEND_URL}/fuel-rates", 
                                                headers=headers, json=invalid_data)
                
                # Should return error status (400, 422, or 500)
                if response.status_code in [400, 422, 500]:
                    self.log_test(f"Invalid Data - {description}", True, 
                                f"Correctly rejected with status {response.status_code}")
                else:
                    self.log_test(f"Invalid Data - {description}", False, 
                                f"Should have rejected invalid data, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Invalid Data Handling", False, f"Request failed: {str(e)}")
    
    async def test_data_format_validation(self):
        """Test that backend accepts the correct data format from frontend"""
        try:
            headers = {"Authorization": f"Bearer {self.test_session_token}"}
            
            # Test the exact format that frontend updateFuelRate function sends
            frontend_format_data = {
                "date": "2025-10-01",
                "fuel_type": "Petrol", 
                "rate": 102.50
            }
            
            response = await self.client.post(f"{BACKEND_URL}/fuel-rates", 
                                            headers=headers, json=frontend_format_data)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "id" in data:
                    # Now retrieve and verify the data format
                    get_response = await self.client.get(f"{BACKEND_URL}/fuel-rates?date=2025-10-01", 
                                                       headers=headers)
                    if get_response.status_code == 200:
                        retrieved_data = get_response.json()
                        if len(retrieved_data) > 0:
                            rate_record = retrieved_data[-1]  # Get the last created record
                            
                            # Verify all expected fields are present
                            expected_fields = ["id", "user_id", "date", "fuel_type", "rate", "created_at"]
                            has_all_fields = all(field in rate_record for field in expected_fields)
                            
                            # Verify data values match
                            data_matches = (
                                rate_record["date"] == "2025-10-01" and
                                rate_record["fuel_type"] == "Petrol" and
                                rate_record["rate"] == 102.50
                            )
                            
                            if has_all_fields and data_matches:
                                self.log_test("Data Format Validation", True, 
                                            "Backend correctly accepts and stores frontend data format")
                            else:
                                self.log_test("Data Format Validation", False, 
                                            f"Data format issues: fields={has_all_fields}, values={data_matches}")
                        else:
                            self.log_test("Data Format Validation", False, 
                                        "No data retrieved after creation")
                    else:
                        self.log_test("Data Format Validation", False, 
                                    f"Failed to retrieve created data: {get_response.status_code}")
                else:
                    self.log_test("Data Format Validation", False, 
                                "Invalid response format from POST", data)
            else:
                self.log_test("Data Format Validation", False, 
                            f"Failed to create rate: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Data Format Validation", False, f"Request failed: {str(e)}")
    
    async def test_offline_mode_compatibility(self):
        """Test fuel rates API without authentication (offline mode)"""
        try:
            # Test GET without auth
            response = await self.client.get(f"{BACKEND_URL}/fuel-rates")
            get_offline_works = response.status_code != 500  # Should return 401, not crash
            
            # Test POST without auth
            test_data = {
                "date": "2025-10-01",
                "fuel_type": "Petrol",
                "rate": 102.50
            }
            response = await self.client.post(f"{BACKEND_URL}/fuel-rates", json=test_data)
            post_offline_works = response.status_code != 500  # Should return 401, not crash
            
            if get_offline_works and post_offline_works:
                self.log_test("Offline Mode Compatibility", True, 
                            "API endpoints handle unauthenticated requests gracefully")
            else:
                self.log_test("Offline Mode Compatibility", False, 
                            "API endpoints crash when accessed without authentication")
                
        except Exception as e:
            self.log_test("Offline Mode Compatibility", False, f"Request failed: {str(e)}")
    
    async def run_fuel_rates_tests(self):
        """Run comprehensive fuel rates testing"""
        print("🚀 Starting M.Pump Calc Fuel Rates API Tests")
        print("=" * 60)
        
        # Setup
        if not await self.setup_test_user():
            print("❌ Failed to setup test environment")
            return
        
        try:
            print("\n🔒 Testing Authentication Requirements...")
            await self.test_fuel_rates_get_unauthorized()
            await self.test_fuel_rates_post_unauthorized()
            
            print("\n📋 Testing Fuel Rates CRUD Operations...")
            await self.test_fuel_rates_get_empty()
            
            print("\n💰 Testing Fuel Rate Creation (User's Specific Issue)...")
            await self.test_fuel_rates_create_petrol()
            await self.test_fuel_rates_create_diesel()
            
            print("\n📊 Testing Data Retrieval and Verification...")
            await self.test_fuel_rates_retrieve_all()
            await self.test_fuel_rates_date_filtering()
            
            print("\n🔍 Testing Data Format and Validation...")
            await self.test_data_format_validation()
            await self.test_invalid_data_handling()
            
            print("\n🌐 Testing Offline Mode Compatibility...")
            await self.test_offline_mode_compatibility()
            
        finally:
            # Cleanup
            await self.cleanup_test_data()
            await self.client.aclose()
            self.mongo_client.close()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 FUEL RATES TEST SUMMARY")
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
        
        print("\n🎯 SPECIFIC ISSUE ANALYSIS:")
        print("User reported: 'Not able to save price' in Rate tab")
        
        # Analyze results for the specific issue
        create_tests = [r for r in self.test_results if "Create" in r["test"]]
        retrieve_tests = [r for r in self.test_results if "Retrieve" in r["test"]]
        
        if all(t["success"] for t in create_tests) and all(t["success"] for t in retrieve_tests):
            print("✅ CONCLUSION: Fuel rates API is working correctly")
            print("   - Both Petrol and Diesel rates can be created")
            print("   - Created rates can be retrieved successfully")
            print("   - Issue may be in frontend Rate tab implementation")
        else:
            print("❌ CONCLUSION: Backend API has issues with fuel rates")
            print("   - Check failed tests above for specific problems")
        
        return passed_tests, failed_tests, self.test_results

async def main():
    """Main test runner"""
    tester = FuelRatesTester()
    passed, failed, results = await tester.run_fuel_rates_tests()
    
    return {
        "passed": passed,
        "failed": failed,
        "total": passed + failed,
        "success_rate": (passed / (passed + failed)) * 100 if (passed + failed) > 0 else 0,
        "results": results
    }

if __name__ == "__main__":
    asyncio.run(main())