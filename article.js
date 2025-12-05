// Get article ID from URL
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('id');

// Get articles from localStorage
function getArticles() {
    const articlesJSON = localStorage.getItem('articles');
    return articlesJSON ? JSON.parse(articlesJSON) : [];
}

// Get comments from localStorage
function getComments() {
    const commentsJSON = localStorage.getItem('comments');
    return commentsJSON ? JSON.parse(commentsJSON) : [];
}

// Save comments to localStorage
function saveComments(comments) {
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Load article detail
function loadArticleDetail(id) {
    const articles = getArticles();
    const article = articles.find(a => a.id == id);

    const mainContainer = document.querySelector('main .container');

    if (!article) {
        mainContainer.innerHTML = `
            <div class="article-detail">
                <p style="text-align: center; color: var(--text-muted);">Article not found.</p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="index.html" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to Home</a>
                </div>
            </div>
        `;
        return;
    }

    mainContainer.innerHTML = `
        <article class="article-detail">
            <img src="${article.imageUrl}" alt="${article.title}" class="article-detail-image" onerror="this.src='https://placehold.co/1200x500?text=No+Image'">
            <span class="article-detail-category">${article.category}</span>
            <h1 class="article-detail-title">${article.title}</h1>
            <p class="article-detail-description">${article.description}</p>
            <a href="index.html" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to Home</a>
        </article>
        
        <section class="comments-section">
            <h3><i class="fa-solid fa-comments"></i> Comments</h3>
            <div id="commentsAuthSection"></div>
            <div id="commentsContainer"></div>
        </section>
    `;

    loadComments(id);
}

// Load comments for article
function loadComments(articleId) {
    const commentsAuthSection = document.getElementById('commentsAuthSection');
    const currentUser = getCurrentUser();

    if (currentUser) {
        // Show comment form
        commentsAuthSection.innerHTML = `
            <form id="commentForm" class="comment-form">
                <div class="form-group">
                    <p style="margin-bottom: 10px;">Posting as: <strong style="color: var(--primary-color);">${currentUser}</strong> 
                    <button type="button" class="logout-btn" id="commentLogoutBtn" style="margin-left: 10px; padding: 5px 10px; font-size: 0.85rem;">Logout</button></p>
                </div>
                <div class="form-group">
                    <textarea id="commentText" placeholder="Add a comment..." required style="min-height: 100px;"></textarea>
                </div>
                <button type="submit" class="submit-btn">
                    <i class="fa-solid fa-paper-plane"></i> Post Comment
                </button>
            </form>
        `;

        // Add event listener for comment form
        document.getElementById('commentForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const text = document.getElementById('commentText').value;

            if (text) {
                addComment(articleId, currentUser, text);
                document.getElementById('commentText').value = '';
            }
        });

        // Add logout functionality
        document.getElementById('commentLogoutBtn').addEventListener('click', function () {
            logoutUser();
            loadComments(articleId);
        });
    } else {
        // Show login message
        commentsAuthSection.innerHTML = `
            <div class="login-message">
                <p><i class="fa-solid fa-lock"></i> Please login to post a comment</p>
                <button class="login-btn-main login-btn">Login / Sign Up</button>
            </div>
        `;

        // Add event listener for login button
        document.querySelector('.login-message .login-btn').addEventListener('click', function () {
            document.getElementById('authModal').style.display = 'block';
        });
    }

    displayComments(articleId);
}

// Display comments
function displayComments(articleId) {
    const commentsContainer = document.getElementById('commentsContainer');
    const comments = getComments().filter(c => c.articleId == articleId);

    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 20px;">No comments yet. Be the first to comment!</p>';
        return;
    }

    commentsContainer.innerHTML = comments.map(comment => {
        const date = new Date(comment.date);
        const formattedDate = date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author"><i class="fa-solid fa-user"></i> ${comment.name}</span>
                    <span class="comment-date">${formattedDate}</span>
                </div>
                <p class="comment-text">${comment.text}</p>
            </div>
        `;
    }).join('');
}

// Add comment
function addComment(articleId, name, text) {
    const comments = getComments();
    const newComment = {
        id: Date.now(),
        articleId: parseInt(articleId),
        name: name,
        text: text,
        date: new Date().toISOString()
    };

    comments.push(newComment);
    saveComments(comments);
    displayComments(articleId);
}

// Get current user
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Login user
function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username] && users[username] === password) {
        localStorage.setItem('currentUser', username);
        return true;
    } else {
        alert('Invalid username or password');
        return false;
    }
}

// Signup user
function signupUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username]) {
        alert('Username already exists');
        return false;
    }

    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

// Initialize auth modal
function initAuth() {
    const authModal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    const loginBtns = document.querySelectorAll('.login-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (!authModal) return;

    // Open modal
    loginBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            authModal.style.display = 'block';
        });
    });

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab') === 'login' ? 'loginTab' : 'signupTab';
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Handle login
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            if (loginUser(username, password)) {
                authModal.style.display = 'none';
                loginForm.reset();
                loadComments(articleId);
            }
        });
    }

    // Handle signup
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (signupUser(username, password)) {
                alert('Account created successfully! Please login.');
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.querySelector('.tab-btn[data-tab="login"]').classList.add('active');
                document.getElementById('loginTab').classList.add('active');
                signupForm.reset();
            }
        });
    }
}

// Initialize page
if (articleId) {
    loadArticleDetail(articleId);
    initAuth();
} else {
    window.location.href = 'index.html';
}

console.log('Article page initialized successfully!');
