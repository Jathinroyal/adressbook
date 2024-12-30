// Example for fetchContacts
async function fetchContacts() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching contacts:', error.message);
        alert('Failed to fetch contacts. Please check the server connection.');
        return [];
    }
}
