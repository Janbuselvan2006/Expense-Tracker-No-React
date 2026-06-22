document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-product-btn');
    const productsTable = document.getElementById('products-table');
    const tbody = productsTable.querySelector('tbody') || productsTable;
    
    // We will store products here
    let products = [];
    
    // Fetch products from database
    async function loadProducts() {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                // Check if table missing error
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                products = data;
                renderProducts();
            } else {
                console.error('Failed to load products');
            }
        } catch (err) {
            console.error(err);
        }
    }
    
    function renderProducts() {
        // Clear current rows except header
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            if (!row.querySelector('th')) {
                row.remove();
            }
        });
        
        products.forEach((product, index) => {
            const newRow = document.createElement('tr');
            newRow.dataset.id = product.id;
            newRow.innerHTML = `
               <td>${index + 1}</td>
               <td>${product.name}</td>
               <td>$${product.price}</td>
               <td>$${product.oldPrice || ''}</td>
               <td>${product.category || ''}</td>
               <td>
                   <span class="Active">${product.isActive ? 'Active' : 'Inactive'}</span>
               </td>
               <td>
                   <button class='edit' data-id='${product.id}'>Edit</button>
                   <button class='delete' data-id='${product.id}'>Delete</button>
               </td>
            `;
            tbody.appendChild(newRow);
        });
    }

    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const oldprice = document.getElementById('product-old-price').value;
        const category = document.getElementById('product-category').value;
        const qty = document.getElementById('product-qty').value;
        const description = document.getElementById('product-desc').value;

        if (!name || !price) {
            alert('pls fill atleast name and price');
            return;
        }

        const productData = { name, price, oldPrice: oldprice, category, qty, description };
        
        try {
            // Save to database
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            
            if (response.ok) {
                const newProduct = await response.json();
                products.push(newProduct);
                renderProducts();
                
                // Clear inputs
                document.getElementById('product-name').value = '';
                document.getElementById('product-price').value = '';
                document.getElementById('product-old-price').value = '';
                document.getElementById('product-qty').value = '';
                document.getElementById('product-category').selectedIndex = 0;
                document.getElementById('product-desc').value = '';
            } else {
                alert('Error saving product');
            }
        } catch (err) {
            console.error(err);
            alert('Network error saving product');
        }
    });

    productsTable.addEventListener('click', async (e) => {
        // Delete Button
        if (e.target.classList.contains('delete')) {
            const id = e.target.dataset.id;
            if (!id) return;
            
            try {
                const response = await fetch('/api/products?id=' + id, { method: 'DELETE' });
                if (response.ok) {
                    products = products.filter(p => p.id != id);
                    renderProducts();
                } else {
                    alert('Error deleting product');
                }
            } catch (err) {
                console.error(err);
                alert('Network error deleting product');
            }
        }

        // Edit Button (For now, delete old and populate inputs to simulate update)
        if (e.target.classList.contains('edit')) {
            const id = e.target.dataset.id;
            const product = products.find(p => p.id == id);
            if (product) {
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-old-price').value = product.oldPrice || '';
                document.getElementById('product-category').value = product.category || 'Select Category';
                document.getElementById('product-qty').value = product.qty || '';
                document.getElementById('product-desc').value = product.description || '';
                
                // Delete from DB so it acts as an update upon save
                await fetch('/api/products?id=' + id, { method: 'DELETE' });
                products = products.filter(p => p.id != id);
                renderProducts();
            }
        }
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = tbody.querySelectorAll('tr');
            
            rows.forEach(row => {
                if (row.querySelector('th')) return;
                
                const productNameCell = row.querySelectorAll('td')[1];
                if (productNameCell) {
                    const productName = productNameCell.innerText.toLowerCase();
                    if (productName.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // Initialize by loading products from database
    loadProducts();
});