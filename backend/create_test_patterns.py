import requests

BASE_URL = "http://127.0.0.1:5000"

# Login as admin
login_data = {"username": "almuatasam", "password": "TestPassword123"}
response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
token = response.json()['access_token']
headers = {"Authorization": f"Bearer {token}"}

# Test patterns to create
test_patterns = [
    {
        "title": "Blue Summer Dress",
        "description": "A light and breezy dress perfect for warm weather and casual occasions",
        "category_id": 1,  # Dresses
        "difficulty_id": 2,  # Easy
        "pdf_file": "blue_summer_dress.pdf",
        "tags": ["casual", "summer", "blue", "dress"]
    },
    {
        "title": "Formal Evening Gown",
        "description": "Elegant formal dress for special occasions and evening events",
        "category_id": 1,  # Dresses
        "difficulty_id": 4,  # Advanced
        "pdf_file": "evening_gown.pdf",
        "tags": ["formal", "evening", "gown", "special occasion"]
    },
    {
        "title": "Casual T-Shirt",
        "description": "Simple everyday t-shirt pattern for comfortable daily wear",
        "category_id": 2,  # Tops
        "difficulty_id": 1,  # Beginner
        "pdf_file": "tshirt.pdf",
        "tags": ["casual", "shirt", "everyday", "basic"]
    },
    {
        "title": "Winter Coat",
        "description": "Warm and stylish coat for cold weather protection",
        "category_id": 4,  # Outerwear
        "difficulty_id": 5,  # Expert
        "pdf_file": "winter_coat.pdf",
        "tags": ["winter", "coat", "warm", "outerwear"]
    },
    {
        "title": "Cotton Blouse",
        "description": "Lightweight blouse suitable for work or casual settings",
        "category_id": 2,  # Tops
        "difficulty_id": 3,  # Intermediate
        "pdf_file": "cotton_blouse.pdf",
        "tags": ["blouse", "cotton", "work", "casual"]
    }
]

print("Creating test patterns...")
for pattern_data in test_patterns:
    # Create pattern
    response = requests.post(
        f"{BASE_URL}/api/patterns",
        headers=headers,
        json=pattern_data
    )
    
    if response.status_code == 201:
        pattern_id = response.json()['pattern']['id']
        print(f"✓ Created: {pattern_data['title']} (ID: {pattern_id})")
        
        # Approve pattern (as admin)
        approve_response = requests.post(
            f"{BASE_URL}/api/admin/patterns/{pattern_id}/approve",
            headers=headers
        )
        
        if approve_response.status_code == 200:
            print(f"  ✓ Approved")
        else:
            print(f"  ✗ Approval failed: {approve_response.json()}")
    else:
        print(f"✗ Failed to create {pattern_data['title']}: {response.json()}")

print("\n✓ All test patterns created and approved!")