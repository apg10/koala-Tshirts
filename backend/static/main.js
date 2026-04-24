// Simple frontend script to load products and render them.
const API = '/products/';

async function fetchProducts() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error(`Error fetching products: ${res.status}`);
        const data = await res.json();
        renderProducts(data);
    } catch (err) {
        console.error(err);
        const container = document.getElementById('products');
        container.innerHTML = '<p>Could not load products.</p>';
    }
}

function renderProducts(products) {
    const container = document.getElementById('products');
    container.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const img = document.createElement('img');
        img.src = p.image;
        img.alt = p.name;
        const title = document.createElement('h3');
        title.textContent = p.name;
        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `$${Number(p.price).toFixed(2)}`;
        const button = document.createElement('button');
        button.textContent = 'Add to Cart';
        card.append(img, title, price, button);
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', fetchProducts);

