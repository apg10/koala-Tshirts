# tests/test_routes.py

def test_get_products_empty(client):
    """
    Test that the GET /products endpoint returns an empty list when no products are seeded.
    """
    response = client.get("/products")
    assert response.status_code == 200
    assert response.json() == []

