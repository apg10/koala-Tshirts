from io import BytesIO

from app import auth, models
from app.main import app


def admin_product_form_data():
    return {
        "name": "Blocked Product",
        "description": "Blocked",
        "price": "10.00",
        "size": "M",
        "color": "Black",
        "category_id": "1",
    }


def admin_product_image_file():
    return {"image": ("test.png", BytesIO(b"fake image"), "image/png")}

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


def test_admin_product_create_unauthenticated(client):
    """
    Test that unauthenticated access to POST /api/admin/products returns 401.
    """
    response = client.post(
        "/api/admin/products",
        data=admin_product_form_data(),
        files=admin_product_image_file(),
    )
    assert response.status_code == 401


def test_admin_product_create_non_admin(client):
    """
    Test that an authenticated non-admin user gets 403 for POST /api/admin/products.
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
        response = client.post(
            "/api/admin/products",
            data=admin_product_form_data(),
            files=admin_product_image_file(),
        )
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 403


def test_admin_product_update_unauthenticated(client):
    """
    Test that unauthenticated access to PUT /api/admin/products/1 returns 401.
    """
    response = client.put(
        "/api/admin/products/1",
        data=admin_product_form_data(),
    )
    assert response.status_code == 401


def test_admin_product_update_non_admin(client):
    """
    Test that an authenticated non-admin user gets 403 for PUT /api/admin/products/1.
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
        response = client.put(
            "/api/admin/products/1",
            data=admin_product_form_data(),
        )
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 403


def test_admin_product_delete_unauthenticated(client):
    """
    Test that unauthenticated access to DELETE /api/admin/products/1 returns 401.
    """
    response = client.delete("/api/admin/products/1")
    assert response.status_code == 401


def test_admin_product_delete_non_admin(client):
    """
    Test that an authenticated non-admin user gets 403 for DELETE /api/admin/products/1.
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
        response = client.delete("/api/admin/products/1")
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 403


def test_admin_orders_all_unauthenticated(client):
    """
    Test that unauthenticated access to GET /api/orders/admin/all returns 401.
    """
    response = client.get("/api/orders/admin/all")
    assert response.status_code == 401


def test_admin_orders_all_non_admin(client):
    """
    Test that authenticated non-admin user gets 403 for GET /api/orders/admin/all.
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
        response = client.get("/api/orders/admin/all")
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 403


def test_admin_orders_all_admin(client, db_session):
    """
    Test that authenticated admin user gets 200 for GET /api/orders/admin/all.
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
        response = client.get("/api/orders/admin/all")
    finally:
        app.dependency_overrides.pop(auth.get_current_admin, None)

    assert response.status_code == 200
    assert response.json() == []


def test_admin_orders_all_returns_existing_orders(client, db_session):
    """
    Test that GET /api/orders/admin/all returns existing orders for admin users.
    """
    # Create a user
    user = models.User(
        email="test@example.com",
        hashed_password="test",
        is_admin=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Create a category
    category = models.Category(name="Test Category")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    # Create a product linked to that category
    product = models.Product(
        name="Test Product",
        description="Test Description",
        price=29.99,
        image="test.jpg",
        size="M",
        color="Black",
        stock=10,
        category_id=category.id,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    # Create one order linked to the user
    order = models.Order(
        user_id=user.id,
        total=29.99,
        status="pending",
        guest=False,
        shipping_name="Test Name",
        shipping_email="test@example.com",
        shipping_addr="Test Address"
    )
    db_session.add(order)
    db_session.commit()
    db_session.refresh(order)

    # Create one order item linked to that order and product
    order_item = models.OrderItem(
        order_id=order.id,
        product_id=product.id,
        qty=1,
        price=29.99
    )
    db_session.add(order_item)
    db_session.commit()
    db_session.refresh(order_item)

    # Override auth.get_current_admin with an admin user
    def override_admin():
        return models.User(
            id=1,
            email="admin@example.com",
            hashed_password="test",
            is_admin=True,
        )

    app.dependency_overrides[auth.get_current_admin] = override_admin
    try:
        response = client.get("/api/orders/admin/all")
    finally:
        app.dependency_overrides.pop(auth.get_current_admin, None)

    # Expect 200
    assert response.status_code == 200

    # Assert the response is a list
    assert isinstance(response.json(), list)

    # Assert at least one returned order has the created order id
    order_ids = [o["id"] for o in response.json()]
    assert order.id in order_ids

    # Assert that returned order has total, status, guest, and items fields
    returned_order = next((o for o in response.json() if o["id"] == order.id), None)
    assert returned_order is not None
    assert "total" in returned_order
    assert "status" in returned_order
    assert "guest" in returned_order
    assert "items" in returned_order

    # Assert the returned order has exactly one item for the created product
    assert len(returned_order["items"]) == 1
    assert returned_order["items"][0]["product"]["id"] == product.id


def test_order_detail_unauthenticated(client):
    """
    Test that unauthenticated access to GET /api/orders/{order_id} returns 401.
    """
    response = client.get("/api/orders/1")
    assert response.status_code == 401


def test_order_detail_non_owner(client, db_session):
    """
    Test that an authenticated non-owner user gets 404 for GET /api/orders/{order_id}.
    """
    # Create a user
    user = models.User(
        email="user@example.com",
        hashed_password="test",
        is_admin=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Create a product
    product = models.Product(
        name="Test Product",
        description="Test Product Description",
        price=29.99,
        image="test.jpg",
        size="M",
        color="Black",
        category_id=1,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    # Create an order for a different user
    order = models.Order(
        status="pending",
        total=29.99,
        guest=False,
    )
    db_session.add(order)
    db_session.commit()
    db_session.refresh(order)

    # Create one order item linked to that order and product
    order_item = models.OrderItem(
        order_id=order.id,
        product_id=product.id,
        qty=1,
        price=29.99
    )
    db_session.add(order_item)
    db_session.commit()
    db_session.refresh(order_item)

    # Override auth.get_current_user with the non-owner user
    def override_user():
        return user

    app.dependency_overrides[auth.get_current_user] = override_user
    try:
        response = client.get(f"/api/orders/{order.id}")
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 404


def test_order_detail_owner(client, db_session):
    """
    Test that an authenticated owner user gets 200 for GET /api/orders/{order_id}.
    """
    # Create a user
    user = models.User(
        email="owner@example.com",
        hashed_password="test",
        is_admin=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Create a product
    product = models.Product(
        name="Test Product",
        description="Test Product Description",
        price=29.99,
        image="test.jpg",
        size="M",
        color="Black",
        category_id=1,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    # Create an order for the user
    order = models.Order(
        user_id=user.id,
        status="pending",
        total=29.99,
        guest=False,
    )
    db_session.add(order)
    db_session.commit()
    db_session.refresh(order)

    # Create one order item linked to that order and product
    order_item = models.OrderItem(
        order_id=order.id,
        product_id=product.id,
        qty=1,
        price=29.99
    )
    db_session.add(order_item)
    db_session.commit()
    db_session.refresh(order_item)

    # Override auth.get_current_user with the owner user
    def override_user():
        return user

    app.dependency_overrides[auth.get_current_user] = override_user
    try:
        response = client.get(f"/api/orders/{order.id}")
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 200

    # Check the response structure
    data = response.json()
    assert "id" in data
    assert "status" in data
    assert "total" in data
    assert "items" in data
    assert len(data["items"]) == 1
    assert data["items"][0]["product"]["id"] == product.id
