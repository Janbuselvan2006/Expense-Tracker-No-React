document.addEventListener('DOMContentLoaded', () => {
    //Button Actions
    const saveBtn = document.getElementById('save-product-btn');
    const productsTable = document.getElementById('products-table');

    //Product S.no starts from 1
    let productCount = 0;

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();

        //Get data from source
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const oldprice = document.getElementById('product-old-price').value;
        const category = document.getElementById('product-category').value;

        //Alerts
        if (!name || !price) {
            alert('pls fill atleast name and price');
            return;
        }

        productCount++;

        //New empty row starts
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
   <td>${productCount}</td>
   <td>${name}</td>
   <td>$${price}</td>
   <td>$${oldprice}</td>
   <td>${category}</td>
<td>
<span class="Active">Active</span>
</td>
   <td>
       <button class='edit'>Edit</button>
       <button class='delete'>Delete</button>
   </td>
`;

        //Append new row into the table
        const tbody = productsTable.querySelector('tbody') || productsTable;
        tbody.appendChild(newRow);

        //Empty all fields after save

        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
        document.getElementById('product-old-price').value = '';
        document.getElementById('product-qty').value = '';
        document.getElementById('product-category').selectedIndex = 0;
        document.getElementById('product-desc').value = '';

    });

    //Delegation added
    productsTable.addEventListener('click', (e) => {
        // Delete Button
        if (e.target.classList.contains('delete')) {
            const row = e.target.closest('tr');
            if (row) row.remove();
        }

        // Edit Button
        if (e.target.classList.contains('edit')) {
            const row = e.target.closest('tr');
            if (row) {
                const cells = row.querySelectorAll('td');
                
                // Populate the inputs with the data from the row
                document.getElementById('product-name').value = cells[1].innerText;
                document.getElementById('product-price').value = cells[2].innerText.replace('$', '');
                document.getElementById('product-old-price').value = cells[3].innerText.replace('$', '');
                document.getElementById('product-category').value = cells[4].innerText;
                
                // Remove the row so it can be "saved" again as an update
                row.remove();
            }
        }
    });
});