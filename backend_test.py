import requests
import sys
import json
from datetime import datetime

class BackendAPITester:
    def __init__(self, base_url="https://bug-fix-depot.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_status_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            print(f"   Status Code: {response.status_code}")
            
            # Try to parse JSON response
            try:
                response_data = response.json()
                print(f"   Response: {json.dumps(response_data, indent=2)}")
            except:
                print(f"   Response Text: {response.text[:200]}...")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - {name}")
                return True, response_data if 'response_data' in locals() else {}
            else:
                print(f"❌ FAILED - {name} - Expected {expected_status}, got {response.status_code}")
                return False, {}

        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED - {name} - Network Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ FAILED - {name} - Error: {str(e)}")
            return False, {}

    def test_hello_world(self):
        """Test the root endpoint"""
        success, response = self.run_test(
            "Hello World API",
            "GET",
            "api/",
            200
        )
        if success and response.get('message') == 'Hello World':
            print("   ✓ Correct message returned")
            return True
        elif success:
            print("   ⚠️  API responded but message might be different")
            return True
        return False

    def test_create_status_check(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        
        success, response = self.run_test(
            "Create Status Check",
            "POST",
            "api/status",
            200,  # Based on the code, it should return 200, not 201
            data=test_data
        )
        
        if success and 'id' in response:
            self.created_status_ids.append(response['id'])
            print(f"   ✓ Status check created with ID: {response['id']}")
            print(f"   ✓ Client name: {response.get('client_name')}")
            print(f"   ✓ Timestamp: {response.get('timestamp')}")
            return response['id']
        return None

    def test_get_status_checks(self):
        """Test retrieving all status checks"""
        success, response = self.run_test(
            "Get All Status Checks",
            "GET",
            "api/status",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   ✓ Retrieved {len(response)} status checks")
            if len(response) > 0:
                print(f"   ✓ Sample status check: {response[0]}")
            return True
        return False

    def test_database_persistence(self):
        """Test that data persists in database"""
        print(f"\n🔍 Testing Database Persistence...")
        
        # Create a status check
        status_id = self.test_create_status_check()
        if not status_id:
            print("❌ Could not create status check for persistence test")
            return False
            
        # Retrieve all status checks and verify our created one exists
        success, response = self.run_test(
            "Verify Persistence",
            "GET", 
            "api/status",
            200
        )
        
        if success and isinstance(response, list):
            found_status = None
            for status in response:
                if status.get('id') == status_id:
                    found_status = status
                    break
                    
            if found_status:
                print(f"   ✓ Status check persisted in database")
                print(f"   ✓ Found status: {found_status}")
                return True
            else:
                print(f"   ❌ Status check with ID {status_id} not found in database")
                return False
        return False

    def test_cors_headers(self):
        """Test CORS configuration"""
        print(f"\n🔍 Testing CORS Headers...")
        
        try:
            response = requests.options(f"{self.base_url}/api/", timeout=10)
            print(f"   Status Code: {response.status_code}")
            
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
            }
            
            print(f"   CORS Headers: {json.dumps(cors_headers, indent=2)}")
            
            if cors_headers['Access-Control-Allow-Origin']:
                print("   ✓ CORS headers present")
                return True
            else:
                print("   ⚠️  CORS headers might not be properly configured")
                return False
                
        except Exception as e:
            print(f"   ❌ CORS test failed: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("🚀 STARTING BACKEND API TESTS")
        print("=" * 60)
        
        # Test basic connectivity
        print(f"Testing backend at: {self.base_url}")
        
        # Run individual tests
        tests = [
            self.test_hello_world,
            self.test_create_status_check,
            self.test_get_status_checks,
            self.test_database_persistence,
            self.test_cors_headers
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ Test {test.__name__} failed with exception: {str(e)}")
                self.tests_run += 1
        
        # Print final results
        print("\n" + "=" * 60)
        print("📊 BACKEND TEST RESULTS")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%" if self.tests_run > 0 else "No tests run")
        
        if self.created_status_ids:
            print(f"Created Status IDs: {self.created_status_ids}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = BackendAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())