from app import auth, models
from app.main import app

def test_get_products_empty(client):
    """
    Test that the GET /api/products endpoint returns an empty list when no products are seeded.
    """
    response = client.get("/api/products")
    assert response.status_code == 200
    assert response.json() == []


def test_get_categories_empty(client):
    """
    Test that the GET /api/categories endpoint returns an empty list when no categories are seeded.
    """
    response = client.get("/api/categories/")
    assert response.status_code == 200
    assert response.json() == []


def test_category_create_unauthenticated(client):
    """
    Test that unauthenticated access to POST /api/categories returns 401.
    """
    response = client.post("/api/categories/", json={"name": "Blocked"})
    assert response.status_code == 401


def test_category_create_non_admin(client):
    """
    Test that an authenticated non-admin user gets 403 for POST /api/categories.
    """
    def override_user():
        return models.User(
            id=2,
            email="user@example.com",
            hashed_password="test",
            is_admin=False,
        )

    app.dependency_overrides[auth.get_current_user] = override_user
    try:
        response = client.post("/api/categories/", json={"name": "Blocked"})
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 403


def test_category_create_admin(client):
    """
    Test that an admin user can create a category with POST /api/categories.
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
        response = client.post("/api/categories/", json={"name": "Admin Category"})
    finally:
        app.dependency_overrides.pop(auth.get_current_admin, None)

    assert response.status_code == 200
    assert response.json()["name"] == "Admin Category"


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


def test_admin_products_purge_unauthenticated(client):
    """
    Test that unauthenticated access to DELETE /api/admin/products/purge returns 401.
    """
    response = client.delete("/api/admin/products/purge")
    assert response.status_code == 401


def test_admin_products_purge_non_admin(client):
    """
    Test that an authenticated non-admin user gets 403 for DELETE /api/admin/products/purge.
    """
    def override_user():
        return models.User(
            id=2,
            email="user@example.com",
            hashed_password="test",
            is_admin=False,
        )

    app.dependency_overrides[auth.get_current_user] = override_user
    try:
        response = client.delete("/api/admin/products/purge")
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 403


def test_category_update_unauthenticated(client):
    """
    Test that unauthenticated access to PUT /api/categories/1 returns 401.
    """
    response = client.put("/api/categories/1", json={"name": "Updated"})
    assert response.status_code == 401


def test_category_delete_unauthenticated(client):
    """
    Test that unauthenticated access to DELETE /api/categories/1 returns 401.
    """
    response = client.delete("/api/categories/1")
    assert response.status_code == 401


def test_category_update_non_admin(client):
    """
    Test that an authenticated non-admin user gets 403 for PUT /api/categories/1.
    """
    def override_user():
        return models.User(
            id=2,
            email="user@example.com",
            hashed_password="test",
            is_admin=False,
        )

    app.dependency_overrides[auth.get_current_user] = override_user
    try:
        response = client.put("/api/categories/1", json={"name": "Updated"})
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 403


def test_category_delete_non_admin(client):
    """
    Test that an authenticated non-admin user gets 403 for DELETE /api/categories/1.
    """
    def override_user():
        return models.User(
            id=2,
            email="user@example.com",
            hashed_password="test",
            is_admin=False,
        )

    app.dependency_overrides[auth.get_current_user] = override_user
    try:
        response = client.delete("/api/categories/1")
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 403


def test_category_update_admin(client, db_session):
    """
    Test that an admin user can update a category with PUT /api/categories/{category_id}.
    """
    # Create a category first
    category = models.Category(name="Original Category")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    def override_admin():
        return models.User(
            id=1,
            email="admin@example.com",
            hashed_password="test",
            is_admin=True,
        )

    app.dependency_overrides[auth.get_current_admin] = override_admin
    try:
        response = client.put(f"/api/categories/{category.id}", json={"name": "Updated Category"})
    finally:
        app.dependency_overrides.pop(auth.get_current_admin, None)

    assert response.status_code == 200
    assert response.json()["name"] == "Updated Category"


def test_category_delete_admin(client, db_session):
    """
    Test that an admin user can delete a category with DELETE /api/categories/{category_id}.
    """
    # Create a category first
    category = models.Category(name="Category to Delete")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    def override_admin():
        return models.User(
            id=1,
            email="admin@example.com",
            hashed_password="test",
            is_admin=True,
        )

    app.dependency_overrides[auth.get_current_admin] = override_admin
    try:
        response = client.delete(f"/api/categories/{category.id}")
    finally:
        app.dependency_overrides.pop(auth.get_current_admin, None)

    assert response.status_code == 204
