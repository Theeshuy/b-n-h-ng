document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("product-list");
    const searchInput = document.getElementById("search");
    const sortSelect = document.getElementById("sort");
    const addProductForm = document.getElementById("add-product-form"); // Form thêm sản phẩm mới
    const clearCartButton = document.getElementById("clear-cart");
    const checkoutButton = document.getElementById("checkout");
    const viewCartButton = document.getElementById("view-cart"); // Nút mở giỏ hàng
    const closeCartButton = document.getElementById("close-cart"); // Nút đóng giỏ hàng
    const cartSection = document.getElementById("cart"); // Phần tử giỏ hàng

    let cart = [];
    let totalQuantity = 0;
    let totalPrice = 0;
    let products = []; // Khai báo biến products

    // Tải dữ liệu sản phẩm từ tệp JSON
    function loadProducts() {
        fetch('products.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                products = data;
                displayProducts(products);
            })
            .catch(error => {
                console.error('Error loading products:', error);
                alert('Không thể tải sản phẩm. Vui lòng kiểm tra console để biết thêm chi tiết.');
            });
    }

    // Hiển thị sản phẩm
    function displayProducts(products) {
        productList.innerHTML = ''; // Xóa các sản phẩm cũ trước khi hiển thị sản phẩm mới
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-card');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.src='fallback.jpg';">
                <h3>${product.name}</h3>
                <p>Giá: ${product.price.toLocaleString('vi-VN')} VNĐ</p>
                <div class="rating">
                    <span>Rating:</span>
                    ${'<span>⭐</span>'.repeat(product.rating)}
                </div>
                <p class="product-description" style="display:none">${product.description}</p>
                <button data-id="${product.id}" data-price="${product.price}">Thêm vào giỏ hàng</button>
                <button class="delete-product" data-id="${product.id}">Xóa sản phẩm</button>
            `;
            productList.appendChild(productDiv);

            // Thêm sự kiện cho sản phẩm để hiện/ẩn mô tả
            productDiv.addEventListener('click', function (e) {
                if (!e.target.matches("button")) {
                    const description = productDiv.querySelector('.product-description');
                    description.style.display = description.style.display === 'block' ? 'none' : 'block';
                }
            });

            // Thêm sự kiện cho nút "Thêm vào giỏ hàng"
            productDiv.querySelector('button[data-price]').addEventListener('click', function () {
                const productId = this.getAttribute('data-id');
                const price = parseInt(this.getAttribute('data-price'));
                const imgElement = productDiv.querySelector('img');
                addToCart(productId, price, imgElement); // Gọi thêm hiệu ứng "fly"
            });

            // Thêm sự kiện cho nút "Xóa sản phẩm"
            productDiv.querySelector('.delete-product').addEventListener('click', function (event) {
                event.stopPropagation(); // Ngăn không cho sự kiện mở mô tả sản phẩm
                const productId = this.getAttribute('data-id');
                deleteProduct(productId); // Xóa sản phẩm
            });
        });
    }

    // Thêm sản phẩm vào giỏ hàng
    function addToCart(productId, price, imgElement) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.productId === productId);
        if (cartItem) {
            cartItem.quantity += 1;
            cartItem.price += price;
        } else {
            cart.push({ productId, price, quantity: 1 });
        }

        totalQuantity += 1;
        totalPrice += price;
        updateCart();
        flyToCartEffect(imgElement); // Gọi lại hiệu ứng bay
    }

    // Xóa sản phẩm khỏi danh sách sản phẩm
    function deleteProduct(productId) {
        const confirmDelete = confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
        if (confirmDelete) {
            products = products.filter(product => product.id !== productId);
            displayProducts(products);
        }
    }

    // Cập nhật giỏ hàng
    function updateCart() {
        const cartItems = document.getElementById("cart-items");
        cartItems.innerHTML = ''; // Xóa các mục cũ
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <span>${product.name}</span> - ${item.quantity} x ${(item.price / item.quantity).toLocaleString('vi-VN')} VNĐ
                <button data-id="${item.productId}">Xóa</button>
            `;
            cartItems.appendChild(itemDiv);
        });

        document.getElementById("total-price").textContent = `${totalPrice.toLocaleString('vi-VN')} VNĐ`;
        document.getElementById("total-quantity").textContent = totalQuantity;

        // Thêm sự kiện cho nút "Xóa" trong giỏ hàng
        document.querySelectorAll('#cart-items button').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.productId === productId);
        if (itemIndex !== -1) {
            totalQuantity -= cart[itemIndex].quantity;
            totalPrice -= cart[itemIndex].price;
            cart.splice(itemIndex, 1);
            updateCart();
        }
    }

    // Xử lý thêm sản phẩm mới
    addProductForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById("new-product-name").value;
        const price = parseInt(document.getElementById("new-product-price").value);
        const image = document.getElementById("new-product-image").value;
        const description = document.getElementById("new-product-description").value;

        const newProduct = {
            id: (products.length + 1).toString(),
            name: name,
            price: price,
            rating: 5, // Bạn có thể thêm trường nhập đánh giá nếu muốn
            image: image,
            description: description
        };

        products.push(newProduct); // Thêm sản phẩm mới vào danh sách
        displayProducts(products); // Hiển thị lại sản phẩm với sản phẩm mới

        // Reset form sau khi thêm
        addProductForm.reset();
    });

    // Mở giỏ hàng khi nhấn nút "Xem giỏ hàng"
    viewCartButton.addEventListener('click', function () {
        cartSection.style.display = 'block';
    });

    // Đóng giỏ hàng khi nhấn nút "Đóng"
    closeCartButton.addEventListener('click', function () {
        cartSection.style.display = 'none';
    });

    // Xóa giỏ hàng
    clearCartButton.addEventListener('click', function () {
        cart = [];
        totalQuantity = 0;
        totalPrice = 0;
        updateCart();
    });

    // Thanh toán
    checkoutButton.addEventListener('click', function () {
        if (cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống.');
            return;
        }
        alert('Chức năng thanh toán chưa được triển khai.');
    });

    // Hiển thị sản phẩm lần đầu
    loadProducts();

    // Lọc và sắp xếp sản phẩm
    searchInput.addEventListener('input', filterProducts);
    sortSelect.addEventListener('change', filterProducts);

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const sortOrder = sortSelect.value;

        let filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );

        if (sortOrder === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortOrder === 'name-asc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'name-desc') {
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        }

        displayProducts(filteredProducts);
    }

    // Hiệu ứng bay vào giỏ hàng
    function flyToCartEffect(imgElement) {
        const flyingImage = imgElement.cloneNode(); // Nhân bản hình ảnh sản phẩm
        flyingImage.style.position = 'absolute';
        flyingImage.style.zIndex = '1000';
        flyingImage.style.width = '100px'; // Kích thước hình ảnh khi bay
        flyingImage.style.transition = 'all 0.5s ease';
        document.body.appendChild(flyingImage);

        const rect = imgElement.getBoundingClientRect();
        const cartRect = document.getElementById("cart").getBoundingClientRect();

        flyingImage.style.top = `${rect.top + window.scrollY}px`;
        flyingImage.style.left = `${rect.left + window.scrollX}px`;

        requestAnimationFrame(() => {
            flyingImage.style.top = `${cartRect.top + window.scrollY}px`;
            flyingImage.style.left = `${cartRect.left + window.scrollX}px`;
            flyingImage.style.width = '50px'; // Kích thước hình ảnh khi trong giỏ hàng
        });

        flyingImage.addEventListener('transitionend', () => {
            if (document.body.contains(flyingImage)) {
                document.body.removeChild(flyingImage);
            }
        });
    }
});
