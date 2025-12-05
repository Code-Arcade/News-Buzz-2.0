document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    // Check credentials
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username] && users[username] === password) {
        // Set admin session
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUser', username);

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials! Please try again.');
    }
});
