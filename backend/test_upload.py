import requests

# API base URL
BASE_URL = "http://127.0.0.1:5000"

# Login to get token
login_data = {
    "username": "almuatasam",
    "password": "TestPassword123"
}

response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
token = response.json()['access_token']
print(f"✓ Logged in successfully. Token: {token[:20]}...")

# Headers with authentication
headers = {
    "Authorization": f"Bearer {token}"
}

# Test 1: Create a dummy PDF file for testing
print("\n--- Creating test PDF file ---")
with open("test_pattern.pdf", "wb") as f:
    f.write(b"%PDF-1.4\nTest PDF content")
print("✓ Test PDF created: test_pattern.pdf")

# Test 2: Upload PDF pattern file
print("\n--- Uploading PDF pattern file ---")
with open("test_pattern.pdf", "rb") as f:
    files = {"file": ("test_pattern.pdf", f, "application/pdf")}
    response = requests.post(
        f"{BASE_URL}/api/upload/pattern-file",
        headers=headers,
        files=files
    )
    
if response.status_code == 201:
    print("✓ PDF uploaded successfully!")
    result = response.json()
    print(f"  Filename: {result['file']['filename']}")
    print(f"  Path: {result['file']['file_path']}")
    print(f"  Size: {result['file']['file_size']} bytes")
    pdf_path = result['file']['file_path']
else:
    print(f"✗ Upload failed: {response.json()}")

# Test 3: Create a dummy image for testing
print("\n--- Creating test image file ---")
from PIL import Image
img = Image.new('RGB', (800, 600), color='blue')
img.save("test_image.jpg")
print("✓ Test image created: test_image.jpg")

# Test 4: Upload image
print("\n--- Uploading pattern image ---")
with open("test_image.jpg", "rb") as f:
    files = {"file": ("test_image.jpg", f, "image/jpeg")}
    response = requests.post(
        f"{BASE_URL}/api/upload/pattern-image",
        headers=headers,
        files=files
    )
    
if response.status_code == 201:
    print("✓ Image uploaded successfully!")
    result = response.json()
    print(f"  Filename: {result['file']['filename']}")
    print(f"  Path: {result['file']['file_path']}")
    print(f"  Thumbnail: {result['file']['thumbnail_path']}")
    print(f"  Size: {result['file']['file_size']} bytes")
    image_path = result['file']['file_path']
else:
    print(f"✗ Upload failed: {response.json()}")

print("\n--- All tests completed! ---")