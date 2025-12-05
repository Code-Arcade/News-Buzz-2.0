// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if admin is logged in
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Display admin username
    const adminUser = localStorage.getItem('adminUser') || 'Admin';
    const adminUserElement = document.getElementById('adminUser');
    if (adminUserElement) {
        adminUserElement.textContent = adminUser;
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminUser');
                window.location.href = 'login.html';
            }
        });
    }

    // Cancel edit button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }

    // Handle form submission
    const articleForm = document.getElementById('articleForm');
    if (articleForm) {
        articleForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const articleId = document.getElementById('articleId').value;
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const category = document.getElementById('category').value;
            const imageUrl = document.getElementById('imageUrl').value;

            const articles = getArticles();

            if (articleId) {
                // Update existing article
                const index = articles.findIndex(a => a.id == articleId);
                if (index !== -1) {
                    articles[index] = {
                        id: parseInt(articleId),
                        title,
                        description,
                        category,
                        imageUrl
                    };
                }
            } else {
                // Create new article
                const newArticle = {
                    id: Date.now(),
                    title,
                    description,
                    category,
                    imageUrl
                };
                articles.push(newArticle);
            }

            saveArticles(articles);
            resetForm();
            loadArticlesTable();
            updateStats();

            alert(articleId ? 'Article updated successfully!' : 'Article published successfully!');
        });
    }

    // Initialize dashboard
    updateStats();
    loadArticlesTable();
});

// Get articles from localStorage
function getArticles() {
    const articlesJSON = localStorage.getItem('articles');
    return articlesJSON ? JSON.parse(articlesJSON) : [];
}

// Save articles to localStorage
function saveArticles(articles) {
    localStorage.setItem('articles', JSON.stringify(articles));
}

// Update statistics
function updateStats() {
    const articles = getArticles();
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    const totalArticlesEl = document.getElementById('totalArticles');
    const totalUsersEl = document.getElementById('totalUsers');

    if (totalArticlesEl) totalArticlesEl.textContent = articles.length;
    if (totalUsersEl) totalUsersEl.textContent = Object.keys(users).length;
}

// Load articles into table
function loadArticlesTable() {
    const articles = getArticles();
    const tableBody = document.getElementById('articlesTableBody');

    if (!tableBody) return;

    if (articles.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No articles found. Create your first article!</td></tr>';
        return;
    }

    tableBody.innerHTML = articles.map(article => `
        <tr>
            <td>
                <strong>${article.title}</strong><br>
                <small style="color: var(--text-muted);">${article.description.substring(0, 60)}...</small>
            </td>
            <td><span class="badge">${article.category}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editArticle(${article.id})">
                        <i class="fa-solid fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteArticle(${article.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Edit article
function editArticle(id) {
    const articles = getArticles();
    const article = articles.find(a => a.id == id);

    if (article) {
        document.getElementById('articleId').value = article.id;
        document.getElementById('title').value = article.title;
        document.getElementById('description').value = article.description;
        document.getElementById('category').value = article.category;
        document.getElementById('imageUrl').value = article.imageUrl;

        document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-edit"></i> Edit Article';
        document.querySelector('.submit-btn').innerHTML = '<i class="fa-solid fa-save"></i> Update Article';
        document.getElementById('cancelBtn').style.display = 'inline-flex';

        // Scroll to form
        document.getElementById('articleForm').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete article
function deleteArticle(id) {
    if (confirm('Are you sure you want to delete this article?')) {
        const articles = getArticles();
        const filteredArticles = articles.filter(a => a.id != id);
        saveArticles(filteredArticles);
        loadArticlesTable();
        updateStats();
        alert('Article deleted successfully!');
    }
}

// Reset form
function resetForm() {
    const articleForm = document.getElementById('articleForm');
    const articleId = document.getElementById('articleId');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.querySelector('.submit-btn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (articleForm) articleForm.reset();
    if (articleId) articleId.value = '';
    if (formTitle) formTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Publish New Article';
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publish Article';
    if (cancelBtn) cancelBtn.style.display = 'none';
}

console.log('Admin dashboard initialized successfully!');
