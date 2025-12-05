// Global variables
const articlesContainer = document.getElementById('articlesContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Initialize UI enhancements
function initUI() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }
        });
    }

    // Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.8)';
                header.style.boxShadow = 'none';
            }
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fetch articles from local storage
function getArticles() {
    const articlesJSON = localStorage.getItem('articles');
    return articlesJSON ? JSON.parse(articlesJSON) : [];
}

// Display articles in the container
function displayArticles(articles) {
    if (!articlesContainer) return;

    if (articles.length === 0) {
        articlesContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No articles found. Be the first to publish one!</p>';
        return;
    }

    articlesContainer.innerHTML = articles.map(article => `
        <div class="article-card" onclick="window.location.href='article.html?id=${article.id}'">
            <img src="${article.imageUrl}" alt="${article.title}" class="article-image" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
            <div class="article-content">
                <span class="article-category">${article.category}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-description">${article.description.substring(0, 100)}...</p>
                <a href="article.html?id=${article.id}" class="read-more">Read More</a>
            </div>
        </div>
    `).join('');
}

// Filter articles based on search and category
function filterArticles() {
    if (!searchInput || !categoryFilter) return;

    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const articles = getArticles().filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm) ||
            article.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === '' || article.category === category;
        return matchesSearch && matchesCategory;
    });

    displayArticles(articles);
}

// Load articles on page load
function loadArticles() {
    const articles = getArticles();
    displayArticles(articles);
}

// Authentication functionality
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
                alert('Login successful!');
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

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

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

function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Initialize with sample articles if none exist
function initializeSampleArticles() {
    if (localStorage.getItem('articles') === null) {
        const sampleArticles = [
            {
                id: 1,
                title: "Welcome to News Buzz!",
                description: "This is a sample article to demonstrate how articles will appear on News Buzz. You can publish, edit, and delete articles using the admin dashboard. Stay tuned for more exciting content!",
                category: "Technology",
                imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop"
            },
            {
                id: 2,
                title: "How to Use the Admin Dashboard",
                description: "Learn how to manage News Buzz using the admin dashboard. You can add new articles, edit existing ones, and delete articles you no longer need. The interface is intuitive and user-friendly.",
                category: "Technology",
                imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
            },
            {
                id: 3,
                title: "Latest Sports Updates",
                description: "Stay updated with the latest sports news from around the world. From football to basketball, we cover it all with in-depth analysis and expert commentary.",
                category: "Sports",
                imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop"
            }
        ];
        localStorage.setItem('articles', JSON.stringify(sampleArticles));
    }

    // Initialize with a default admin user
    if (localStorage.getItem('users') === null) {
        const users = {
            "admin": "admin123"
        };
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeSampleArticles();
    initUI();
    loadArticles();
    initAuth();

    // Add event listeners for search and filter
    if (searchInput) {
        searchInput.addEventListener('input', filterArticles);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterArticles);
    }
});

console.log('News Buzz initialized successfully!');
