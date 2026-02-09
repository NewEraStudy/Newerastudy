// Authentication and Landing Page Logic
(function() {
    'use strict';

    // DOM Elements
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginFormElement = document.getElementById('loginFormElement');
    const registerFormElement = document.getElementById('registerFormElement');
    
    // Buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const heroGetStarted = document.getElementById('heroGetStarted');
    const closeModal = document.getElementById('closeModal');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    // Initialize
    function init() {
        checkAuth();
        attachEventListeners();
        animateOnScroll();
    }

    // Check if user is already logged in
    function checkAuth() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            window.location.href = 'dashboard.html';
        }
    }

    // Attach Event Listeners
    function attachEventListeners() {
        // Open modal buttons
        loginBtn?.addEventListener('click', () => showModal('login'));
        registerBtn?.addEventListener('click', () => showModal('register'));
        heroGetStarted?.addEventListener('click', () => showModal('register'));

        // Close modal
        closeModal?.addEventListener('click', hideModal);
        authModal?.addEventListener('click', (e) => {
            if (e.target === authModal) hideModal();
        });

        // Switch between login and register
        switchToRegister?.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterForm();
        });

        switchToLogin?.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });

        // Form submissions
        loginFormElement?.addEventListener('submit', handleLogin);
        registerFormElement?.addEventListener('submit', handleRegister);

        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Show Modal
    function showModal(type) {
        authModal.classList.add('active');
        if (type === 'login') {
            showLoginForm();
        } else {
            showRegisterForm();
        }
    }

    // Hide Modal
    function hideModal() {
        authModal.classList.remove('active');
    }

    // Show Login Form
    function showLoginForm() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    }

    // Show Register Form
    function showRegisterForm() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }

    // Handle Login
    function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Get stored users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Set current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password. Please try again.');
        }
    }

    // Handle Register
    function handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const grade = document.getElementById('registerGrade').value;

        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            alert('Email already registered. Please login instead.');
            showLoginForm();
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            grade,
            createdAt: new Date().toISOString(),
            preferences: {
                peakTime: 'morning',
                subjects: [],
                focusDuration: 25,
                breakDuration: 5
            },
            stats: {
                streak: 0,
                totalPomodoros: 0,
                totalStudyTime: 0,
                lastActiveDate: new Date().toISOString()
            }
        };

        // Add to users array
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Set as current user
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // Initialize user data structures
        initializeUserData(newUser.id);

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }

    // Initialize User Data
    function initializeUserData(userId) {
        const initialData = {
            schedule: [],
            goals: [
                {
                    id: 'goal-1',
                    title: 'Complete Math Homework',
                    description: 'Finish chapters 5-7 exercises',
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    priority: 'high',
                    progress: 30,
                    status: 'active',
                    createdAt: new Date().toISOString()
                }
            ],
            tasks: [],
            decks: [
                {
                    id: 'deck-1',
                    name: 'Math Formulas',
                    subject: 'Mathematics',
                    cards: [
                        {
                            id: 'card-1',
                            front: 'Pythagorean Theorem',
                            back: 'a² + b² = c²',
                            nextReview: new Date().toISOString(),
                            interval: 1
                        }
                    ],
                    createdAt: new Date().toISOString()
                }
            ],
            pomodoroSessions: [],
            reviews: [],
            analytics: {
                dailyStudyTime: [],
                weeklyCompletionRate: [],
                energyLevels: []
            }
        };

        localStorage.setItem(`userData_${userId}`, JSON.stringify(initialData));
    }

    // Animate on Scroll
    function animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-card, .benefit-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.5s ease';
            observer.observe(el);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
