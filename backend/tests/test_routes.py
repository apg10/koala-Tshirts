from app import auth, models
from app.main import app

def test_get_products_empty(client):
    """
    Test that the GET /api/products endpoint returns an empty list when no products are seeded.
    """
    response = client.get("/api/products")
    assert response.status_code == 200
    assert response.json() == []


def test_admin_products_purge_route(client):
    """
    Test that the static admin purge route is matched before the dynamic product-id route.
    """
    def override_admin():
        return models.User(
            id=1,
            email="admin@example.com",
            hashed_password="test",
            is_admin=True,
        )

    app.dependency_overrides[auth.get_current_admin] = override_admin
    try:
        response = client.delete("/api/admin/products/purge")
    finally:
        app.dependency_overrides.pop(auth.get_current_admin, None)

    assert response.status_code == 204
