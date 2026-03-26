# Test Get Basket (Empty)
curl -X GET "https://localhost:5001/api/basket?id=test-basket-1" -k

# Test Update Basket
curl -X POST "https://localhost:5001/api/basket" -H "Content-Type: application/json" -d '{
  "id": "test-basket-1",
  "items": [
    {
      "id": "00000000-0000-0000-0000-000000000001",
      "productName": "Test Product",
      "price": 10.0,
      "quantity": 1,
      "pictureUrl": "http://example.com/pic.jpg",
      "category": "Test"
    }
  ]
}' -k

# Test Get Basket (Updated)
curl -X GET "https://localhost:5001/api/basket?id=test-basket-1" -k

# Test Delete Basket
curl -X DELETE "https://localhost:5001/api/basket?id=test-basket-1" -k
