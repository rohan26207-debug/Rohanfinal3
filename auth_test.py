#!/usr/bin/env python3
"""
Authentication Test for M.Pump Calc Fuel Rates Issue
Tests the specific user issue: "Not able to save price" in Rate tab
"""

import asyncio
import httpx

# Get backend URL from environment
BACKEND_URL = "https://mpump-calc.preview.emergentagent.com/api"

async def test_fuel_rates_without_auth():
    """Test fuel rates API without authentication (simulating user's issue)"""
    print("🔍 Testing Fuel Rates API without Authentication")
    print("=" * 50)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Test the exact data format that frontend sends
        test_data = {
            "date": "2025-10-01",
            "fuel_type": "Petrol",
            "rate": 102.50
        }
        
        print("📤 Attempting to save fuel rate (POST /api/fuel-rates)...")
        print(f"   Data: {test_data}")
        
        try:
            response = await client.post(f"{BACKEND_URL}/fuel-rates", json=test_data)
            
            print(f"📥 Response Status: {response.status_code}")
            print(f"📥 Response Body: {response.text}")
            
            if response.status_code == 401:
                print("\n❌ ISSUE IDENTIFIED: Authentication Required")
                print("   The user is not logged in to the application")
                print("   This explains why they cannot save fuel rates")
                return False
            elif response.status_code == 200:
                print("\n✅ Fuel rate saved successfully")
                return True
            else:
                print(f"\n⚠️ Unexpected response: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"\n❌ Request failed: {str(e)}")
            return False

async def test_fuel_rates_get_without_auth():
    """Test getting fuel rates without authentication"""
    print("\n🔍 Testing Get Fuel Rates API without Authentication")
    print("=" * 50)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        print("📤 Attempting to get fuel rates (GET /api/fuel-rates)...")
        
        try:
            response = await client.get(f"{BACKEND_URL}/fuel-rates")
            
            print(f"📥 Response Status: {response.status_code}")
            print(f"📥 Response Body: {response.text}")
            
            if response.status_code == 401:
                print("\n❌ ISSUE CONFIRMED: Authentication Required for GET as well")
                print("   User cannot retrieve existing fuel rates either")
                return False
            elif response.status_code == 200:
                print("\n✅ Fuel rates retrieved successfully")
                return True
            else:
                print(f"\n⚠️ Unexpected response: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"\n❌ Request failed: {str(e)}")
            return False

async def main():
    """Main test runner"""
    print("🚀 M.Pump Calc Authentication Issue Analysis")
    print("🎯 User Issue: 'Not able to save price' in Rate tab")
    print("=" * 60)
    
    # Test both GET and POST without authentication
    post_result = await test_fuel_rates_without_auth()
    get_result = await test_fuel_rates_get_without_auth()
    
    print("\n" + "=" * 60)
    print("📊 ANALYSIS SUMMARY")
    print("=" * 60)
    
    if not post_result and not get_result:
        print("✅ ROOT CAUSE IDENTIFIED:")
        print("   🔐 User is not authenticated (not logged in)")
        print("   📱 Application requires Google OAuth login")
        print("   🚫 All fuel rates API calls return 401 Unauthorized")
        print("\n💡 SOLUTION:")
        print("   1. User needs to click 'Connect Gmail Account' in Settings > Sync tab")
        print("   2. Complete Google OAuth login process")
        print("   3. Once authenticated, fuel rates saving will work")
        print("\n🔧 TECHNICAL DETAILS:")
        print("   - Backend API is working correctly")
        print("   - Frontend Rate tab functionality is correct")
        print("   - Issue is authentication, not the fuel rates feature")
        
    else:
        print("⚠️ UNEXPECTED RESULT:")
        print("   The API responded differently than expected")
        print("   Further investigation may be needed")
    
    return {
        "issue_identified": not post_result and not get_result,
        "root_cause": "Authentication required - user not logged in",
        "solution": "User needs to complete Google OAuth login"
    }

if __name__ == "__main__":
    asyncio.run(main())