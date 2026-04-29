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


def test_my_orders_unauthenticated(client):
    """
    Test that unauthenticated access to GET /api/orders/ returns 401.
    """
    response = client.get("/api/orders/")
    assert response.status_code == 401


def test_my_orders_empty(client, db_session):
    """
    Test that an authenticated user with no orders gets 200 and [] for GET /api/orders/.
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

    # Override auth.get_current_user with the user
    def override_user():
        return user

    app.dependency_overrides[auth.get_current_user] = override_user
    try:
        response = client.get("/api/orders/")
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 200
    assert response.json() == []


def test_my_orders_with_multiple_orders(client, db_session):
    """
    Test that an authenticated user with one owned order and one other user's order
    gets 200 and only the owned order for GET /api/orders/.
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

    # Create another user
    other_user = models.User(
        email="other@example.com",
        hashed_password="test",
        is_admin=False,
    )
    db_session.add(other_user)
    db_session.commit()
    db_session.refresh(other_user)

    # Create a category
    category = models.Category(name="Test Category")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    # Create a product
    product = models.Product(
        name="Test Product",
        description="Test Product Description",
        price=29.99,
        image="test.jpg",
        size="M",
        color="Black",
        category_id=category.id,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    # Create an order for the user (owned order)
    owned_order = models.Order(
        user_id=user.id,
        status="pending",
        total=29.99,
        guest=False,
    )
    db_session.add(owned_order)
    db_session.commit()
    db_session.refresh(owned_order)

    # Create an order for the other user (unowned order)
    other_order = models.Order(
        user_id=other_user.id,
        status="pending",
        total=29.99,
        guest=False,
    )
    db_session.add(other_order)
    db_session.commit()
    db_session.refresh(other_order)

    # Create order items for both orders
    owned_order_item = models.OrderItem(
        order_id=owned_order.id,
        product_id=product.id,
        qty=1,
        price=29.99
    )
    db_session.add(owned_order_item)
    db_session.commit()
    db_session.refresh(owned_order_item)

    other_order_item = models.OrderItem(
        order_id=other_order.id,
        product_id=product.id,
        qty=1,
        price=29.99
    )
    db_session.add(other_order_item)
    db_session.commit()
    db_session.refresh(other_order_item)

    # Override auth.get_current_user with the user
    def override_user():
        return user

    app.dependency_overrides[auth.get_current_user] = override_user
    try:
        response = client.get("/api/orders/")
    finally:
        app.dependency_overrides.pop(auth.get_current_user, None)

    assert response.status_code == 200

    # Should only return the owned order
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == owned_order.id
    assert data[0]["total"] == 29.99
    assert data[0]["status"] == "pending"
    assert len(data[0]["items"]) == 1
    assert data[0]["items"][0]["id"] == owned_order_item.id
    assert data[0]["items"][0]["product"]["id"] == product.id
    assert data[0]["items"][0]["product"]["name"] == product.name
    assert data[0]["items"][0]["product"]["description"] == product.description
    assert data[0]["items"][0]["product"]["price"] == product.price
    assert data[0]["items"][0]["product"]["image"] == product.image
    assert data[0]["items"][0]["product"]["size"] == product.size
    assert data[0]["items"][0]["product"]["color"] == product.color
    assert data[0]["items"][0]["product"]["stock"] == product.stock
    assert data[0]["items"][0]["product"]["category_id"] == product.category_id
    assert data[0]["items"][0]["qty"] == 1
    assert data[0]["items"][0]["price"] == 29.99


def test_checkout_authenticated_creates_order(client, db_session, monkeypatch):
    """
    Test that authenticated checkout creates an order from the current user's cart.
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

    # Create a category
    category = models.Category(
        name="Test Category",
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    # Create a product
    product = models.Product(
        name="Test Product",
        description="Test Product Description",
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

    # Create a cart for the user
    cart = models.Cart(
        user_id=user.id,
        status="active",
    )
    db_session.add(cart)
    db_session.commit()
    db_session.refresh(cart)

    # Create a cart item
    cart_item = models.CartItem(
        cart_id=cart.id,
        product_id=product.id,
        qty=2,
    )
    db_session.add(cart_item)
    db_session.commit()
    db_session.refresh(cart_item)

    # Mock Stripe PaymentIntent.create
    captured_args = {}
    def mock_create(*args, **kwargs):
        captured_args.update(kwargs)
        return type('obj', (), {'id': 'pi_test', 'client_secret': 'pi_test_secret'})()
    
    monkeypatch.setattr("app.routes.orders.stripe.PaymentIntent.create", mock_create)

    # Override auth.optional_user with the user
    def override_user():
        return user

    app.dependency_overrides[auth.optional_user] = override_user
    try:
        # For authenticated checkout, we can send empty body since the cart is used
        response = client.post("/api/orders/checkout", json={})
        assert response.status_code == 201
    finally:
        app.dependency_overrides.pop(auth.optional_user, None)

    # Verify the response
    data = response.json()
    assert data["order_id"] is not None
    assert data["total"] == 65.98  # 29.99 * 2 = 59.98 subtotal, 59.98 * 0.1 = 6.00 tax, 59.98 + 6.00 = 65.98
    assert data["client_secret"] == "pi_test_secret"

    # Verify Stripe was called with correct args
    assert captured_args["amount"] == 6598  # 65.98 * 100 = 6598 cents
    assert captured_args["currency"] == "usd"
    assert "order_id" in captured_args["metadata"]
    assert captured_args["metadata"]["guest"] == "False"
    db_session.refresh(cart)
    assert cart.status == "active"
    assert len(cart.items) == 1

def test_checkout_authenticated_empty_cart(client, db_session):
    """
    Test that authenticated checkout rejects empty cart.
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

    # Create a cart for the user (but don't add items)
    cart = models.Cart(
        user_id=user.id,
        status="active",
    )
    db_session.add(cart)
    db_session.commit()
    db_session.refresh(cart)

    # Override auth.optional_user with the user
    def override_user():
        return user

    app.dependency_overrides[auth.optional_user] = override_user
    try:
        # For authenticated checkout with empty cart, should return 400
        response = client.post("/api/orders/checkout", json={})
        assert response.status_code == 400
    finally:
        app.dependency_overrides.pop(auth.optional_user, None)


def test_checkout_authenticated_rounds_stripe_amount_to_nearest_cent(client, db_session, monkeypatch):
    """Checkout uses Decimal half-up rounding when converting totals to Stripe cents."""
    user = models.User(
        email="rounding@example.com",
        hashed_password="test",
        is_admin=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    category = models.Category(name="Rounding Category")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    product = models.Product(
        name="Rounding Product",
        description="Rounding Product Description",
        price=0.05,
        image="rounding.jpg",
        size="M",
        color="Black",
        stock=10,
        category_id=category.id,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    cart = models.Cart(user_id=user.id, status="active")
    db_session.add(cart)
    db_session.commit()
    db_session.refresh(cart)

    cart_item = models.CartItem(cart_id=cart.id, product_id=product.id, qty=1)
    db_session.add(cart_item)
    db_session.commit()

    captured_args = {}

    def mock_create(*args, **kwargs):
        captured_args.update(kwargs)
        return type("obj", (), {"id": "pi_rounding", "client_secret": "pi_rounding_secret"})()

    monkeypatch.setattr("app.routes.orders.stripe.PaymentIntent.create", mock_create)

    def override_user():
        return user

    app.dependency_overrides[auth.optional_user] = override_user
    try:
        response = client.post("/api/orders/checkout", json={})
        assert response.status_code == 201
    finally:
        app.dependency_overrides.pop(auth.optional_user, None)

    data = response.json()
    assert data["total"] == 0.06
    assert captured_args["amount"] == 6


def test_checkout_guest_requires_items_and_shipping(client, db_session):
    """
    Test that guest checkout requires items and shipping.
    """
    # No auth override for guest mode
    response = client.post("/api/orders/checkout", json={})
    assert response.status_code == 400


def test_stripe_webhook_payment_intent_succeeded_with_order_id(client, db_session, monkeypatch):
    """
    Test that webhook with payment_intent.succeeded event marks existing order as paid using order_id from metadata.
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

    # Create a category
    category = models.Category(
        name="Test Category",
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    # Create a product
    product = models.Product(
        name="Test Product",
        description="Test Product Description",
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

    # Create an order with pending status and stripe_pi_id
    order = models.Order(
        user_id=user.id,
        status="pending",
        stripe_pi_id="pi_test",
        guest=False,
        shipping_name="Test Name",
        shipping_email="test@example.com",
        shipping_addr="Test Address"
    )
    db_session.add(order)
    db_session.commit()
    db_session.refresh(order)

    # Mock stripe.Webhook.construct_event to return a payment_intent.succeeded event
    captured_event = {}
    def mock_construct_event(*args, **kwargs):
        captured_event.update({
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_test",
                    "metadata": {
                        "order_id": str(order.id),
                        "guest": "False"
                    }
                }
            }
        })
        return captured_event
    
    monkeypatch.setattr("app.routes.checkout.stripe.Webhook.construct_event", mock_construct_event)

    # Send webhook request
    response = client.post("/api/checkout/webhook", 
                          headers={"stripe-signature": "valid-signature"})
    assert response.status_code == 200

    # Verify order was updated
    db_session.refresh(order)
    assert order.status == "paid"
    assert order.stripe_status == "succeeded"


def test_stripe_webhook_payment_intent_succeeded_fallback_to_stripe_pi_id(client, db_session, monkeypatch):
    """
    Test that webhook with payment_intent.succeeded event falls back to stripe_pi_id when metadata order_id is missing.
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

    # Create a category
    category = models.Category(
        name="Test Category",
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    # Create a product
    product = models.Product(
        name="Test Product",
        description="Test Product Description",
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

    # Create an order with pending status and stripe_pi_id
    order = models.Order(
        user_id=user.id,
        status="pending",
        stripe_pi_id="pi_test",
        guest=False,
        shipping_name="Test Name",
        shipping_email="test@example.com",
        shipping_addr="Test Address"
    )
    db_session.add(order)
    db_session.commit()
    db_session.refresh(order)

    # Mock stripe.Webhook.construct_event to return a payment_intent.succeeded event without order_id in metadata
    captured_event = {}
    def mock_construct_event(*args, **kwargs):
        captured_event.update({
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_test",
                    "metadata": {
                        "guest": "False"
                    }
                }
            }
        })
        return captured_event
    
    monkeypatch.setattr("app.routes.checkout.stripe.Webhook.construct_event", mock_construct_event)

    # Send webhook request
    response = client.post("/api/checkout/webhook", 
                          headers={"stripe-signature": "valid-signature"})
    assert response.status_code == 200

    # Verify order was updated
    db_session.refresh(order)
    assert order.status == "paid"
    assert order.stripe_status == "succeeded"


def test_stripe_webhook_invalid_signature_returns_400(client, db_session, monkeypatch):
    """
    Test that invalid webhook signature still returns 400.
    """
    # Mock stripe.Webhook.construct_event to raise SignatureVerificationError
    def mock_construct_event(*args, **kwargs):
        raise ValueError("Invalid signature")
    
    monkeypatch.setattr("app.routes.checkout.stripe.Webhook.construct_event", mock_construct_event)

    # Send webhook request with invalid signature
    response = client.post("/api/checkout/webhook", 
                          headers={"stripe-signature": "invalid-signature"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid payload or signature"}


def test_stripe_webhook_payment_intent_succeeded_decrements_product_stock(client, db_session, monkeypatch):
    """
    Test that webhook with payment_intent.succeeded decrements product stock.
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

    # Create a category
    category = models.Category(
        name="Test Category",
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    # Create a product with stock=10
    product = models.Product(
        name="Test Product",
        description="Test Product Description",
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

    # Create an order with pending status and stripe_pi_id
    order = models.Order(
        user_id=user.id,
        status="pending",
        stripe_pi_id="pi_stock",
        guest=False,
        shipping_name="Test Name",
        shipping_email="test@example.com",
        shipping_addr="Test Address"
    )
    db_session.add(order)
    db_session.commit()
    db_session.refresh(order)

    # Create an order item with qty=3 for the product
    order_item = models.OrderItem(
        order_id=order.id,
        product_id=product.id,
        qty=3,
        price=29.99
    )
    db_session.add(order_item)
    db_session.commit()
    db_session.refresh(order_item)

    # Mock stripe.Webhook.construct_event to return a payment_intent.succeeded event
    captured_event = {}
    def mock_construct_event(*args, **kwargs):
        captured_event.update({
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_stock",
                    "metadata": {
                        "order_id": str(order.id),
                        "guest": "False"
                    }
                }
            }
        })
        return captured_event
    
    monkeypatch.setattr("app.routes.checkout.stripe.Webhook.construct_event", mock_construct_event)

    # Send webhook request
    response = client.post("/api/checkout/webhook", 
                          headers={"stripe-signature": "valid-signature"})
    assert response.status_code == 200

    # Verify product stock was decremented and order was updated
    db_session.refresh(product)
    db_session.refresh(order)
    assert product.stock == 7  # 10 - 3 = 7
    assert order.status == "paid"


def test_stripe_webhook_payment_intent_succeeded_clears_authenticated_cart(client, db_session, monkeypatch):
    """
    Test that payment_intent.succeeded clears the authenticated user's cart after payment succeeds.
    """
    user = models.User(
        email="cartclear@example.com",
        hashed_password="test",
        is_admin=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    category = models.Category(name="Cart Clear Category")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    product = models.Product(
        name="Cart Clear Product",
        description="Test Product Description",
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

    cart = models.Cart(user_id=user.id, status="active")
    db_session.add(cart)
    db_session.commit()
    db_session.refresh(cart)

    cart_item = models.CartItem(
        cart_id=cart.id,
        product_id=product.id,
        qty=2,
    )
    db_session.add(cart_item)
    db_session.commit()
    db_session.refresh(cart_item)

    order = models.Order(
        user_id=user.id,
        status="pending",
        stripe_pi_id="pi_cart_clear",
        guest=False,
        shipping_name="Test Name",
        shipping_email="test@example.com",
        shipping_addr="Test Address",
    )
    db_session.add(order)
    db_session.commit()
    db_session.refresh(order)

    order_item = models.OrderItem(
        order_id=order.id,
        product_id=product.id,
        qty=2,
        price=29.99,
    )
    db_session.add(order_item)
    db_session.commit()
    db_session.refresh(order_item)

    def mock_construct_event(*args, **kwargs):
        return {
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_cart_clear",
                    "metadata": {
                        "order_id": str(order.id),
                        "guest": "False",
                    },
                }
            },
        }

    monkeypatch.setattr("app.routes.checkout.stripe.Webhook.construct_event", mock_construct_event)

    response = client.post("/api/checkout/webhook", headers={"stripe-signature": "valid-signature"})
    assert response.status_code == 200

    db_session.refresh(order)
    db_session.refresh(cart)
    assert order.status == "paid"
    assert cart.status == "closed"
    assert db_session.query(models.CartItem).filter_by(cart_id=cart.id).count() == 0


def test_stripe_webhook_payment_intent_succeeded_idempotent_no_stock_change(client, db_session, monkeypatch):
    """
    Test that webhook is idempotent and does not decrement stock twice.
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

    # Create a category
    category = models.Category(
        name="Test Category",
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    # Create a product with stock=10
    product = models.Product(
        name="Test Product",
        description="Test Product Description",
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

    # Create an order that is already paid
    order = models.Order(
        user_id=user.id,
        status="paid",
        stripe_status="succeeded",
        stripe_pi_id="pi_paid",
        guest=False,
        shipping_name="Test Name",
        shipping_email="test@example.com",
        shipping_addr="Test Address"
    )
    db_session.add(order)
    db_session.commit()
    db_session.refresh(order)

    # Create an order item with qty=3 for the product
    order_item = models.OrderItem(
        order_id=order.id,
        product_id=product.id,
        qty=3,
        price=29.99
    )
    db_session.add(order_item)
    db_session.commit()
    db_session.refresh(order_item)

    # Mock stripe.Webhook.construct_event to return a payment_intent.succeeded event
    captured_event = {}
    def mock_construct_event(*args, **kwargs):
        captured_event.update({
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_paid",
                    "metadata": {
                        "order_id": str(order.id),
                        "guest": "False"
                    }
                }
            }
        })
        return captured_event
    
    monkeypatch.setattr("app.routes.checkout.stripe.Webhook.construct_event", mock_construct_event)

    # Send webhook request
    response = client.post("/api/checkout/webhook", 
                          headers={"stripe-signature": "valid-signature"})
    assert response.status_code == 200

    # Verify product stock was NOT decremented (idempotent) and order status remains paid
    db_session.refresh(product)
    db_session.refresh(order)
    assert product.stock == 10  # Should remain 10, not changed
    assert order.status == "paid"


def test_stripe_webhook_payment_intent_succeeded_no_negative_stock(client, db_session, monkeypatch):
    """
    Test that webhook does not make stock negative.
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

    # Create a category
    category = models.Category(
        name="Test Category",
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    # Create a product with stock=2
    product = models.Product(
        name="Test Product",
        description="Test Product Description",
        price=29.99,
        image="test.jpg",
        size="M",
        color="Black",
        stock=2,
        category_id=category.id,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    # Create an order with pending status and stripe_pi_id
    order = models.Order(
        user_id=user.id,
        status="pending",
        stripe_pi_id="pi_negative",
        guest=False,
        shipping_name="Test Name",
        shipping_email="test@example.com",
        shipping_addr="Test Address"
    )
    db_session.add(order)
    db_session.commit()
    db_session.refresh(order)

    # Create an order item with qty=5 for the product (more than stock)
    order_item = models.OrderItem(
        order_id=order.id,
        product_id=product.id,
        qty=5,
        price=29.99
    )
    db_session.add(order_item)
    db_session.commit()
    db_session.refresh(order_item)

    # Mock stripe.Webhook.construct_event to return a payment_intent.succeeded event
    captured_event = {}
    def mock_construct_event(*args, **kwargs):
        captured_event.update({
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_negative",
                    "metadata": {
                        "order_id": str(order.id),
                        "guest": "False"
                    }
                }
            }
        })
        return captured_event
    
    monkeypatch.setattr("app.routes.checkout.stripe.Webhook.construct_event", mock_construct_event)

    # Send webhook request
    response = client.post("/api/checkout/webhook", 
                          headers={"stripe-signature": "valid-signature"})
    assert response.status_code == 200

    # Verify product stock was set to 0 (not negative) and order was updated
    db_session.refresh(product)
    db_session.refresh(order)
    assert product.stock == 0  # Should be 0, not -3
    assert order.status == "paid"


def test_checkout_authenticated_insufficient_stock(client, db_session, monkeypatch):
    """
    Test that authenticated checkout rejects insufficient stock.
    """
    # Create user and cart with items
    user = models.User(
        email="user@example.com",
        hashed_password="test",
        is_admin=False,
    )
    db_session.add(user)
    db_session.commit()
    
    # Create a product with stock=1
    product = models.Product(
        name="Test Product",
        description="Test description",
        price=10.00,
        size="M",
        color="Black",
        category_id=1,
        stock=1,
    )
    db_session.add(product)
    db_session.commit()
    
    # Create cart with item qty=2 (exceeds stock)
    cart = models.Cart(
        user_id=user.id,
        status="open",
    )
    db_session.add(cart)
    db_session.commit()
    
    cart_item = models.CartItem(
        cart_id=cart.id,
        product_id=product.id,
        qty=2
    )
    db_session.add(cart_item)
    db_session.commit()
    
    stripe_create_called = False
    
    def mock_create(*args, **kwargs):
        nonlocal stripe_create_called
        stripe_create_called = True
        raise AssertionError("Stripe should not be called when stock is insufficient")
    
    monkeypatch.setattr("app.routes.orders.stripe.PaymentIntent.create", mock_create)
    
    def override_user():
        return user

    app.dependency_overrides[auth.optional_user] = override_user
    try:
        response = client.post("/api/orders/checkout", json={})
    finally:
        app.dependency_overrides.pop(auth.optional_user, None)
    
    # Verify stock validation failed
    assert response.status_code == 400
    assert "Insufficient stock" in response.json()["detail"]
    
    assert stripe_create_called is False
    
    # Verify no order was created for this user
    orders = db_session.query(models.Order).filter_by(user_id=user.id).all()
    assert len(orders) == 0


def test_checkout_guest_insufficient_stock(client, db_session, monkeypatch):
    """
    Test that guest checkout rejects insufficient stock.
    """
    # Create a product with stock=1
    product = models.Product(
        name="Test Product",
        description="Test description",
        price=10.00,
        size="M",
        color="Black",
        category_id=1,
        stock=1,
    )
    db_session.add(product)
    db_session.commit()
    
    existing_order_count = db_session.query(models.Order).count()
    stripe_create_called = False
    
    def mock_create(*args, **kwargs):
        nonlocal stripe_create_called
        stripe_create_called = True
        raise AssertionError("Stripe should not be called when stock is insufficient")
    
    monkeypatch.setattr("app.routes.orders.stripe.PaymentIntent.create", mock_create)
    
    # Attempt guest checkout with insufficient stock (item qty=2)
    response = client.post("/api/orders/checkout", json={
        "items": [
            {
                "product_id": product.id,
                "qty": 2
            }
        ],
        "shipping": {
            "name": "Test User",
            "email": "test@example.com",
            "address": "123 Test St"
        }
    })
    
    # Verify stock validation failed
    assert response.status_code == 400
    assert "Insufficient stock" in response.json()["detail"]
    
    assert stripe_create_called is False
    assert db_session.query(models.Order).count() == existing_order_count


def test_checkout_guest_summary_empty_body_returns_400(client):
    response = client.post("/api/checkout/summary", json={})

    assert response.status_code == 400
    assert "Items are required" in response.json()["detail"]


def test_checkout_guest_summary_valid_item_returns_totals(client, db_session):
    category = models.Category(name="Summary Category")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    product = models.Product(
        name="Summary Product",
        description="Summary test product",
        price=20.00,
        image="summary.jpg",
        size="M",
        color="Black",
        stock=10,
        category_id=category.id,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    response = client.post("/api/checkout/summary", json={
        "items": [{"product_id": product.id, "qty": 2}],
        "shipping": {
            "name": "Guest User",
            "email": "guest@example.com",
            "address": "123 Guest St",
        },
    })

    assert response.status_code == 200
    data = response.json()
    assert data["subtotal"] == 40.00
    assert data["tax"] == 4.00
    assert data["total"] == 44.00
    assert data["items"] == [
        {
            "product_id": product.id,
            "name": "Summary Product",
            "price": 20.00,
            "quantity": 2,
            "total": 40.00,
        }
    ]


def test_checkout_guest_summary_uses_database_price(client, db_session):
    category = models.Category(name="Price Source Category")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    product = models.Product(
        name="Database Price Product",
        description="Price source test product",
        price=35.00,
        image="price.jpg",
        size="L",
        color="White",
        stock=10,
        category_id=category.id,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    response = client.post("/api/checkout/summary", json={
        "items": [{"product_id": product.id, "qty": 2, "price": 0.01}],
        "shipping": {
            "name": "Guest User",
            "email": "guest@example.com",
            "address": "123 Guest St",
        },
    })

    assert response.status_code == 200
    data = response.json()
    assert data["subtotal"] == 70.00
    assert data["tax"] == 7.00
    assert data["total"] == 77.00
    assert data["items"][0]["price"] == 35.00
    assert data["items"][0]["total"] == 70.00


def test_checkout_guest_summary_missing_product_returns_404(client):
    response = client.post("/api/checkout/summary", json={
        "items": [{"product_id": 999999, "qty": 1}],
        "shipping": {
            "name": "Guest User",
            "email": "guest@example.com",
            "address": "123 Guest St",
        },
    })

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
