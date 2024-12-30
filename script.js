const apiBaseURL = 'http://localhost:8080/api/contacts';

// Function to add or update a contact
function addContact(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const contact = { name, email, phone };
    const editId = localStorage.getItem('editContactId');

    if (editId) {
        // Update existing contact
        fetch(`${apiBaseURL}/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        })
        .then(response => response.json())
        .then(data => {
            alert('Contact updated successfully!');
            localStorage.removeItem('editContactId');
            window.location.href = 'viewContact.html';
        })
        .catch(error => console.error('Error:', error));
    } else {
        // Add new contact
        fetch(apiBaseURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        })
        .then(response => response.json())
        .then(data => {
            alert('Contact added successfully!');
            window.location.href = 'viewContact.html';
        })
        .catch(error => console.error('Error:', error));
    }
}

// Function to edit contact
function editContact(id) {
    fetch(`${apiBaseURL}/${id}`)
        .then(response => response.json())
        .then(contact => {
            localStorage.setItem('editContactId', id);
            localStorage.setItem('editContactData', JSON.stringify(contact));
            window.location.href = 'addContact.html';
        })
        .catch(error => console.error('Error:', error));
}

// Function to populate form with edit data
function populateEditForm() {
    const editData = localStorage.getItem('editContactData');
    if (editData) {
        const contact = JSON.parse(editData);
        document.getElementById('name').value = contact.name;
        document.getElementById('email').value = contact.email;
        document.getElementById('phone').value = contact.phone;
        document.querySelector('.submit-btn').textContent = 'Update';
    }
}

// Function to load all contacts
function loadContacts() {
    fetch(apiBaseURL)
        .then(response => response.json())
        .then(contacts => {
            const tableBody = document.getElementById('contactTableBody');
            tableBody.innerHTML = '';
            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.phone}</td>
                    <td>
                        <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Function to delete a contact
function deleteContact(id) {
    fetch(`${apiBaseURL}/${id}`, { method: 'DELETE' })
        .then(() => {
            alert('Contact deleted successfully!');
            loadContacts();
        })
        .catch(error => console.error('Error:', error));
}

// Function to search contacts
function searchContacts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#contactTableBody tr');
    rows.forEach(row => {
        const name = row.querySelector('td').textContent.toLowerCase();
        row.style.display = name.includes(query) ? '' : 'none';
    });
}

// Modified window.onload to handle both cases
window.onload = function() {
    if (window.location.pathname.includes('viewContact.html')) {
        loadContacts();
    } else if (window.location.pathname.includes('addContact.html')) {
        populateEditForm();
    }
}
