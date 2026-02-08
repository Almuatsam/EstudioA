import requests

response = requests.get("http://127.0.0.1:5000/api/patterns/categories")
print("Categories endpoint works:", response.status_code == 200)

try:
    response = requests.get("http://127.0.0.1:5000/api/patterns/search?q=test")
    print("Search endpoint works:", response.status_code == 200)
    print("Response:", response.status_code)
except Exception as e:
    print("Search endpoint error:", e)