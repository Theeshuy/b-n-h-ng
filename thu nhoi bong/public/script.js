document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById("product-list");
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Giá: ${product.price} VNĐ</p>
                    <button onclick="addToCart('${product.id}')">Thêm vào giỏ hàng</button>
                `;
                productList.appendChild(productDiv);
            });
        });
});

function addToCart(productId) {
    alert('Sản phẩm ' + productId + ' đã được thêm vào giỏ hàng!');
}
