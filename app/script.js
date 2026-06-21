document.addEventListener('DOMContentLoaded', () => {

    const saveBtn = document.getElementById('save-product-btn');
    const productsTable = document.getElementById('products-table');

    let productCount = 0;

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const oldprice = document.getElementById('product-old-price').value;
        const category = document.getElementById('product-category').value;
    })

    if (!name || !price) {
        alert('pls fill atleast name and price');
        return;
    }

    productCount++;

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
   <td>${productCount}</td>
   <td>$${name}</td>
   <td>$${price}</td>
   <td>${oldprice}</td>
   <td>${category}</td>
<td>
<span class="Active">
    Active
    </span>
</td>
   <td>
       <button class='edit'>Edit</button>
       <button class='delete'>Delete</button>
   </td>
`;

    const tbody = productsTable.querySelector('tbody') || productsTable;
    tbody.appendChild(newRow);

    document.getElementById('prodcut-name').value = '';
    document.getElementById('prodcut-price').value = '';
    document.getElementById('prodcut-old-price').value = '';
    document.getElementById('prodcut-qty').value = '';
    document.getElementById('prodcut-category').selectedIndex = 0;
    document.getElementById('prodcut-desc').value = '';

});