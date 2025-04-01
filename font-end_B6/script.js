const apiUrl = 'http://localhost:5006/api/products'; // Thay bằng 'https://' nếu backend dùng HTTPS

// Hàm lấy và hiển thị danh sách sản phẩm
async function fetchProducts() {
    const productList = document.getElementById('productList');

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status} - ${response.statusText}`);
        }

        const products = await response.json();
        productList.innerHTML = '';

        if (!products || products.length === 0) {
            productList.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">Không có sản phẩm nào.</td>
                </tr>
            `;
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id || 'N/A'}</td>
                <td>${product.name || 'Không có tên'}</td>
                <td>${(product.price || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="viewProduct(${product.id})" data-bs-toggle="modal" data-bs-target="#viewProductModal">Xem</button>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})" data-bs-toggle="modal" data-bs-target="#editProductModal">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Xóa</button>
                </td>
            `;
            productList.appendChild(row);
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        productList.innerHTML = `
            <tr>
                <td colspan="4" class="text-center error-message">
                    Có lỗi xảy ra: ${error.message}. Vui lòng kiểm tra console để biết chi tiết.
                </td>
            </tr>
        `;
    }
}

// Hàm xem chi tiết sản phẩm
async function viewProduct(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        const product = await response.json();
        document.getElementById('viewProductId').textContent = product.id || 'N/A';
        document.getElementById('viewProductName').textContent = product.name || 'Không có tên';
        document.getElementById('viewProductPrice').textContent = (product.price || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } catch (error) {
        console.error('Lỗi khi xem sản phẩm:', error);
        alert('Không thể xem sản phẩm: ' + error.message);
    }
}

// Hàm sửa sản phẩm (điền dữ liệu vào modal)
async function editProduct(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        const product = await response.json();
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name || '';
        document.getElementById('editProductPrice').value = product.price || 0;
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu sản phẩm để sửa:', error);
        alert('Không thể tải dữ liệu sản phẩm: ' + error.message);
    }
}

// Xử lý sửa sản phẩm từ biểu mẫu
document.getElementById('editProductForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const price = parseFloat(document.getElementById('editProductPrice').value);

    const updatedProduct = { id: parseInt(id), name, price };

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });

        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        alert('Sửa sản phẩm thành công!');
        bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
        fetchProducts(); // Tải lại danh sách
    } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
        alert('Không thể sửa sản phẩm: ' + error.message);
    }
});

// Hàm xóa sản phẩm
async function deleteProduct(id) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            alert('Xóa sản phẩm thành công!');
            fetchProducts(); // Tải lại danh sách
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            alert('Không thể xóa sản phẩm: ' + error.message);
        }
    }
}

// Xử lý thêm sản phẩm từ biểu mẫu
document.getElementById('addProductForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('addProductName').value;
    const price = parseFloat(document.getElementById('addProductPrice').value);

    const newProduct = { name, price };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        alert('Thêm sản phẩm thành công!');
        document.getElementById('addProductForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
        fetchProducts(); // Tải lại danh sách
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        alert('Không thể thêm sản phẩm: ' + error.message);
    }
});

// Gọi hàm khi trang tải xong
document.addEventListener('DOMContentLoaded', fetchProducts);