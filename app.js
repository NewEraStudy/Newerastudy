// StudyMaster Dashboard - Main Application Logic
(function() {
    'use strict';

    // ===========================
    // Global State
    // ===========================
    let currentUser = null;
    let userData = null;
    let currentSection = 'dashboard';
    let pomodoroTimer = null;
    let pomodoroTimeLeft = 25 * 60;
    let isTimerRunning = false;
    let isPomodoroBreak = false;

    // ===========================
    // Initialization
    // ===========================
    function init() {
        if (!checkAuthentication()) {
            return;
        }
        loadUserData();
        setupEventListeners();
        setupTheme();
        renderDashboard();
        updateAllStats();
    }

    // Check Authentication
    function checkAuthentication() {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) {
            window.location.href = 'index.html';
            return false;
        }
        currentUser = JSON.parse(userStr);
        updateUserProfile();
        return true;
    }

    // Load User Data
    function loadUserData() {
        const dataStr = localStorage.getItem(`userData_${currentUser.id}`);
        if (dataStr) {
            userData = JSON.parse(dataStr);
        } else {
            // Initialize new user data
            userData = {
                schedule: [],
                goals: [],
                tasks: [],
                decks: [],
                pomodoroSessions: [],
                reviews: [],
                analytics: {
                    dailyStudyTime: [],
                    weeklyCompletionRate: [],
                    energyLevels: []
                }
            };
            saveUserData();
        }
    }

    // Save User Data
    function saveUserData() {
        localStorage.setItem(`userData_${currentUser.id}`, JSON.stringify(userData));
    }

    // Update User Profile Display
    function updateUserProfile() {
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const welcomeName = document.getElementById('welcomeName');
        
        if (userName) userName.textContent = currentUser.name;
        if (welcomeName) welcomeName.textContent = currentUser.name.split(' ')[0];
        
        if (userAvatar) {
            const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.textContent = initials;
        }
        
        updateStreak();
    }

    // Update Streak
    function updateStreak() {
        const streakElement = document.getElementById('streakCount');
        if (streakElement) {
            const streak = calculateStreak();
            streakElement.textContent = streak;
            currentUser.stats.streak = streak;
        }
    }

    // Calculate Streak
    function calculateStreak() {
        const sessions = userData.pomodoroSessions || [];
        if (sessions.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const hasSession = sessions.some(s => s.date.startsWith(dateStr));
            
            if (!hasSession) break;
            
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }

        return streak;
    }

    // ===========================
    // Event Listeners
    // ===========================
    function setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                navigateToSection(section);
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                navigateToSection(section);
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal;
                closeModal(modalId);
            });
        });

        // Schedule
        setupScheduleListeners();

        // Goals
        setupGoalsListeners();

        // Tasks (Matrix)
        setupTasksListeners();

        // Pomodoro
        setupPomodoroListeners();

        // Flashcards
        setupFlashcardsListeners();

        // Review
        setupReviewListeners();
    }

    // Navigate to Section
    function navigateToSection(section) {
        currentSection = section;
        
        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });

        // Show section
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${section}Section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            const titles = {
                dashboard: 'Dashboard',
                schedule: 'Study Schedule',
                goals: 'Goals',
                matrix: 'Task Matrix',
                pomodoro: 'Pomodoro Timer',
                flashcards: 'Flashcards',
                analytics: 'Analytics',
                review: 'Weekly Review'
            };
            pageTitle.textContent = titles[section] || section;
        }

        // Render section content
        renderSection(section);
    }

    // Render Section
    function renderSection(section) {
        switch(section) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'schedule':
                renderSchedule();
                break;
            case 'goals':
                renderGoals();
                break;
            case 'matrix':
                renderMatrix();
                break;
            case 'pomodoro':
                renderPomodoro();
                break;
            case 'flashcards':
                renderFlashcards();
                break;
            case 'analytics':
                renderAnalytics();
                break;
            case 'review':
                renderReview();
                break;
        }
    }

    // ===========================
    // Dashboard
    // ===========================
    function renderDashboard() {
        renderTodaySchedule();
        renderActiveGoals();
        updateDashboardStats();
        updateDailyQuote();
    }

    // Render Today's Schedule
    function renderTodaySchedule() {
        const container = document.getElementById('todaySchedule');
        if (!container) return;

        const today = new Date().toISOString().split('T')[0];
        const todaySchedule = userData.schedule.filter(item => 
            item.date === today
        ).sort((a, b) => a.startTime.localeCompare(b.startTime));

        if (todaySchedule.length === 0) {
            container.innerHTML = '<p class="text-muted">No scheduled study blocks for today.</p>';
            return;
        }

        container.innerHTML = todaySchedule.map(item => `
            <div class="schedule-item">
                <div class="schedule-time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>
                <div class="schedule-subject">${escapeHtml(item.subject)}</div>
            </div>
        `).join('');
    }

    // Render Active Goals
    function renderActiveGoals() {
        const container = document.getElementById('activeGoals');
        if (!container) return;

        const activeGoals = userData.goals.filter(g => g.status === 'active').slice(0, 3);

        if (activeGoals.length === 0) {
            container.innerHTML = '<p class="text-muted">No active goals. Create one to get started!</p>';
            return;
        }

        container.innerHTML = activeGoals.map(goal => `
            <div class="goal-item-preview">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong>${escapeHtml(goal.title)}</strong>
                    <span style="font-size: 0.875rem; color: var(--text-muted);">${goal.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${goal.progress}%"></div>
                </div>
            </div>
        `).join('');
    }

    // Update Dashboard Stats
    function updateDashboardStats() {
        // Pomodoro count today
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = userData.pomodoroSessions.filter(s => 
            s.date.startsWith(today)
        );
        const pomodoroCount = document.getElementById('pomodoroCount');
        if (pomodoroCount) pomodoroCount.textContent = todaySessions.length;

        // Tasks completed today
        const completedToday = userData.tasks.filter(t => 
            t.completed && t.completedDate && t.completedDate.startsWith(today)
        );
        const tasksCompleted = document.getElementById('tasksCompleted');
        if (tasksCompleted) tasksCompleted.textContent = completedToday.length;

        // Energy level
        const energyLevel = document.getElementById('energyLevel');
        if (energyLevel) {
            const latestEnergy = userData.analytics.energyLevels[userData.analytics.energyLevels.length - 1];
            energyLevel.textContent = latestEnergy ? latestEnergy.level : 'High';
        }
    }

    // Update Daily Quote
    function updateDailyQuote() {
        const quotes = [
            "Success is the sum of small efforts repeated day in and day out.",
            "The secret of getting ahead is getting started.",
            "Don't watch the clock; do what it does. Keep going.",
            "Study while others are sleeping; work while others are loafing.",
            "The expert in anything was once a beginner.",
            "Education is the passport to the future.",
            "The beautiful thing about learning is that no one can take it away from you.",
            "Success doesn't come from what you do occasionally, it comes from what you do consistently."
        ];

        const quoteElement = document.getElementById('dailyQuote');
        if (quoteElement) {
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
            quoteElement.textContent = quotes[dayOfYear % quotes.length];
        }
    }

    // ===========================
    // Schedule Section
    // ===========================
    function setupScheduleListeners() {
        const addScheduleBtn = document.getElementById('addScheduleBtn');
        const scheduleForm = document.getElementById('scheduleForm');

        if (addScheduleBtn) {
            addScheduleBtn.addEventListener('click', () => {
                openModal('scheduleModal');
            });
        }

        if (scheduleForm) {
            scheduleForm.addEventListener('submit', handleScheduleSubmit);
        }
    }

    function renderSchedule() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        calendarGrid.innerHTML = days.map((day, index) => {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + index);
            const dateStr = currentDay.toISOString().split('T')[0];
            
            const daySchedule = userData.schedule.filter(item => item.date === dateStr)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return `
                <div class="day-column">
                    <div class="day-header">
                        ${day}
                        <br>
                        <span style="font-size: 0.875rem; font-weight: normal;">${currentDay.getMonth() + 1}/${currentDay.getDate()}</span>
                    </div>
                    ${daySchedule.map(item => `
                        <div class="schedule-item">
                            <div class="schedule-time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>
                            <div class="schedule-subject">${escapeHtml(item.subject)}</div>
                            ${item.notes ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${escapeHtml(item.notes)}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }).join('');
    }

    function handleScheduleSubmit(e) {
        e.preventDefault();
        
        const subject = document.getElementById('scheduleSubject').value;
        const date = document.getElementById('scheduleDate').value;
        const startTime = document.getElementById('scheduleStart').value;
        const endTime = document.getElementById('scheduleEnd').value;
        const notes = document.getElementById('scheduleNotes').value;

        const scheduleItem = {
            id: Date.now().toString(),
            subject,
            date,
            startTime,
            endTime,
            notes,
            createdAt: new Date().toISOString()
        };

        userData.schedule.push(scheduleItem);
        saveUserData();

        e.target.reset();
        closeModal('scheduleModal');
        renderSchedule();
        renderTodaySchedule();
    }

    // ===========================
    // Goals Section
    // ===========================
    function setupGoalsListeners() {
        const addGoalBtn = document.getElementById('addGoalBtn');
        const goalForm = document.getElementById('goalForm');
        const filterBtns = document.querySelectorAll('.goals-filter .filter-btn');

        if (addGoalBtn) {
            addGoalBtn.addEventListener('click', () => {
                openModal('goalModal');
            });
        }

        if (goalForm) {
            goalForm.addEventListener('submit', handleGoalSubmit);
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderGoals(btn.dataset.filter);
            });
        });
    }

    function renderGoals(filter = 'all') {
        const container = document.getElementById('goalsList');
        if (!container) return;

        let goals = userData.goals;
        
        if (filter === 'active') {
            goals = goals.filter(g => g.status === 'active');
        } else if (filter === 'completed') {
            goals = goals.filter(g => g.status === 'completed');
        }

        if (goals.length === 0) {
            container.innerHTML = '<p class="text-muted">No goals found.</p>';
            return;
        }

        container.innerHTML = goals.map(goal => `
            <div class="goal-item">
                <div class="goal-header">
                    <h4 class="goal-title">${escapeHtml(goal.title)}</h4>
                    <span class="goal-priority ${goal.priority}">${goal.priority}</span>
                </div>
                <p class="goal-description">${escapeHtml(goal.description)}</p>
                <div class="goal-progress">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-size: 0.875rem;">Progress</span>
                        <span style="font-size: 0.875rem; font-weight: 600;">${goal.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${goal.progress}%"></div>
                    </div>
                </div>
                <div class="goal-footer">
                    <span>Due: ${formatDate(goal.deadline)}</span>
                    <div>
                        <button class="btn-link" onclick="window.studyMaster.updateGoalProgress('${goal.id}')">
                            Update Progress
                        </button>
                        ${goal.status !== 'completed' ? `
                            <button class="btn-link" onclick="window.studyMaster.completeGoal('${goal.id}')">
                                Mark Complete
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function handleGoalSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('goalTitle').value;
        const description = document.getElementById('goalDescription').value;
        const deadline = document.getElementById('goalDeadline').value;
        const priority = document.getElementById('goalPriority').value;

        const goal = {
            id: Date.now().toString(),
            title,
            description,
            deadline,
            priority,
            progress: 0,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        userData.goals.push(goal);
        saveUserData();

        e.target.reset();
        closeModal('goalModal');
        renderGoals();
        renderActiveGoals();
    }

    // Update Goal Progress
    window.studyMaster = window.studyMaster || {};
    window.studyMaster.updateGoalProgress = function(goalId) {
        const goal = userData.goals.find(g => g.id === goalId);
        if (!goal) return;

        const newProgress = prompt(`Update progress for "${goal.title}" (0-100):`, goal.progress);
        if (newProgress !== null) {
            const progress = Math.max(0, Math.min(100, parseInt(newProgress) || 0));
            goal.progress = progress;
            
            if (progress === 100) {
                goal.status = 'completed';
            }
            
            saveUserData();
            renderGoals();
            renderActiveGoals();
        }
    };

    window.studyMaster.completeGoal = function(goalId) {
        const goal = userData.goals.find(g => g.id === goalId);
        if (!goal) return;

        goal.progress = 100;
        goal.status = 'completed';
        goal.completedAt = new Date().toISOString();
        
        saveUserData();
        renderGoals();
        renderActiveGoals();
    };

    // ===========================
    // Tasks (Eisenhower Matrix)
    // ===========================
    function setupTasksListeners() {
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskForm = document.getElementById('taskForm');

        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                openModal('taskModal');
            });
        }

        if (taskForm) {
            taskForm.addEventListener('submit', handleTaskSubmit);
        }
    }

    function renderMatrix() {
        const quadrants = ['urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important'];
        
        quadrants.forEach(quadrant => {
            const container = document.querySelector(`.task-list[data-quadrant="${quadrant}"]`);
            if (!container) return;

            const tasks = userData.tasks.filter(t => t.quadrant === quadrant && !t.completed);

            if (tasks.length === 0) {
                container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.875rem; padding: 8px;">No tasks</p>';
                return;
            }

            container.innerHTML = tasks.map(task => `
                <div class="task-item">
                    <span>${escapeHtml(task.title)}</span>
                    <button class="task-delete" onclick="window.studyMaster.deleteTask('${task.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        });
    }

    function handleTaskSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const quadrant = document.getElementById('taskQuadrant').value;

        const task = {
            id: Date.now().toString(),
            title,
            quadrant,
            completed: false,
            createdAt: new Date().toISOString()
        };

        userData.tasks.push(task);
        saveUserData();

        e.target.reset();
        closeModal('taskModal');
        renderMatrix();
    }

    window.studyMaster.deleteTask = function(taskId) {
        const taskIndex = userData.tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            userData.tasks[taskIndex].completed = true;
            userData.tasks[taskIndex].completedDate = new Date().toISOString();
            saveUserData();
            renderMatrix();
            updateDashboardStats();
        }
    };

    // ===========================
    // Pomodoro Timer
    // ===========================
    function setupPomodoroListeners() {
        const startTimer = document.getElementById('startTimer');
        const resetTimer = document.getElementById('resetTimer');
        const focusDuration = document.getElementById('focusDuration');
        const breakDuration = document.getElementById('breakDuration');

        if (startTimer) {
            startTimer.addEventListener('click', toggleTimer);
        }

        if (resetTimer) {
            resetTimer.addEventListener('click', resetPomodoroTimer);
        }

        if (focusDuration) {
            focusDuration.addEventListener('change', (e) => {
                if (!isTimerRunning) {
                    pomodoroTimeLeft = parseInt(e.target.value) * 60;
                    updateTimerDisplay();
                }
            });
        }
    }

    function renderPomodoro() {
        updatePomodoroStats();
        renderRecentSessions();
    }

    function toggleTimer() {
        const startBtn = document.getElementById('startTimer');
        
        if (isTimerRunning) {
            // Pause timer
            clearInterval(pomodoroTimer);
            isTimerRunning = false;
            startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        } else {
            // Start timer
            isTimerRunning = true;
            startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            
            pomodoroTimer = setInterval(() => {
                pomodoroTimeLeft--;
                updateTimerDisplay();
                
                if (pomodoroTimeLeft <= 0) {
                    timerComplete();
                }
            }, 1000);
        }
    }

    function resetPomodoroTimer() {
        clearInterval(pomodoroTimer);
        isTimerRunning = false;
        isPomodoroBreak = false;
        
        const focusDuration = parseInt(document.getElementById('focusDuration').value);
        pomodoroTimeLeft = focusDuration * 60;
        
        const startBtn = document.getElementById('startTimer');
        if (startBtn) {
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        }
        
        const label = document.getElementById('timerLabel');
        if (label) {
            label.textContent = 'Focus Time';
        }
        
        updateTimerDisplay();
    }

    function timerComplete() {
        clearInterval(pomodoroTimer);
        isTimerRunning = false;
        
        // Play notification sound (optional - would need audio file)
        if (window.Notification && Notification.permission === 'granted') {
            new Notification('Pomodoro Complete!', {
                body: isPomodoroBreak ? 'Break time is over!' : 'Time for a break!',
                icon: '/favicon.ico'
            });
        }
        
        if (!isPomodoroBreak) {
            // Session complete - save it
            const session = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                duration: parseInt(document.getElementById('focusDuration').value),
                type: 'focus'
            };
            
            userData.pomodoroSessions.push(session);
            saveUserData();
            updatePomodoroStats();
            renderRecentSessions();
            updateStreak();
            
            // Start break
            isPomodoroBreak = true;
            pomodoroTimeLeft = parseInt(document.getElementById('breakDuration').value) * 60;
            
            const label = document.getElementById('timerLabel');
            if (label) label.textContent = 'Break Time';
            
            const startBtn = document.getElementById('startTimer');
            if (startBtn) startBtn.innerHTML = '<i class="fas fa-play"></i> Start Break';
        } else {
            // Break complete
            resetPomodoroTimer();
        }
        
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(pomodoroTimeLeft / 60);
        const seconds = pomodoroTimeLeft % 60;
        
        const minutesEl = document.getElementById('timerMinutes');
        const secondsEl = document.getElementById('timerSeconds');
        
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        // Update progress ring
        const focusDuration = parseInt(document.getElementById('focusDuration').value) * 60;
        const breakDuration = parseInt(document.getElementById('breakDuration').value) * 60;
        const totalTime = isPomodoroBreak ? breakDuration : focusDuration;
        const progress = (totalTime - pomodoroTimeLeft) / totalTime;
        
        const ring = document.getElementById('timerRing');
        if (ring) {
            const circumference = 2 * Math.PI * 140;
            const offset = circumference * (1 - progress);
            ring.style.strokeDasharray = `${circumference} ${circumference}`;
            ring.style.strokeDashoffset = offset;
        }
    }

    function updatePomodoroStats() {
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = userData.pomodoroSessions.filter(s => s.date.startsWith(today));
        
        const todayCount = document.getElementById('todaySessions');
        if (todayCount) todayCount.textContent = todaySessions.length;
        
        // This week
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekSessions = userData.pomodoroSessions.filter(s => 
            new Date(s.date) >= weekStart
        );
        
        const weekCount = document.getElementById('weekSessions');
        if (weekCount) weekCount.textContent = weekSessions.length;
        
        // Streak
        const streakEl = document.getElementById('sessionStreak');
        if (streakEl) streakEl.textContent = calculateStreak();
    }

    function renderRecentSessions() {
        const container = document.getElementById('recentSessionsList');
        if (!container) return;

        const recentSessions = userData.pomodoroSessions.slice(-5).reverse();

        if (recentSessions.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.875rem;">No sessions yet</p>';
            return;
        }

        container.innerHTML = recentSessions.map(session => {
            const date = new Date(session.date);
            return `
                <div class="session-log">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: 500;">${session.duration} min session</span>
                        <span style="font-size: 0.875rem; color: var(--text-muted);">
                            ${date.toLocaleDateString()}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===========================
    // Flashcards
    // ===========================
    function setupFlashcardsListeners() {
        const addDeckBtn = document.getElementById('addDeckBtn');
        const deckForm = document.getElementById('deckForm');

        if (addDeckBtn) {
            addDeckBtn.addEventListener('click', () => {
                openModal('deckModal');
            });
        }

        if (deckForm) {
            deckForm.addEventListener('submit', handleDeckSubmit);
        }
    }

    function renderFlashcards() {
        const container = document.getElementById('decksList');
        if (!container) return;

        if (userData.decks.length === 0) {
            container.innerHTML = '<p class="text-muted">No decks created yet. Create your first deck!</p>';
            return;
        }

        container.innerHTML = userData.decks.map(deck => `
            <div class="deck-card" onclick="window.studyMaster.studyDeck('${deck.id}')">
                <h4 class="deck-name">${escapeHtml(deck.name)}</h4>
                <p class="deck-subject">${escapeHtml(deck.subject)}</p>
                <div class="deck-stats">
                    <span>${deck.cards ? deck.cards.length : 0} cards</span>
                    <span><i class="fas fa-calendar"></i> Study</span>
                </div>
            </div>
        `).join('');
    }

    function handleDeckSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('deckName').value;
        const subject = document.getElementById('deckSubject').value;

        const deck = {
            id: Date.now().toString(),
            name,
            subject,
            cards: [],
            createdAt: new Date().toISOString()
        };

        userData.decks.push(deck);
        saveUserData();

        e.target.reset();
        closeModal('deckModal');
        renderFlashcards();
    }

    window.studyMaster.studyDeck = function(deckId) {
        alert('Flashcard study mode will be implemented in the full version. For now, you can manage your decks here!');
        // In a full implementation, this would open a flashcard study interface
    };

    // ===========================
    // Analytics
    // ===========================
    function renderAnalytics() {
        renderWeeklyStudyChart();
        renderCompletionChart();
        renderEnergyChart();
        renderInsights();
    }

    function renderWeeklyStudyChart() {
        const canvas = document.getElementById('weeklyStudyChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Get last 7 days
        const days = [];
        const studyTimes = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            const daySessions = userData.pomodoroSessions.filter(s => 
                s.date.startsWith(dateStr)
            );
            const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
            studyTimes.push(totalMinutes);
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Study Time (minutes)',
                    data: studyTimes,
                    backgroundColor: 'rgba(37, 99, 235, 0.5)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function renderCompletionChart() {
        const canvas = document.getElementById('completionChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        const totalTasks = userData.tasks.length;
        const completedTasks = userData.tasks.filter(t => t.completed).length;
        const activeTasks = totalTasks - completedTasks;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Active'],
                datasets: [{
                    data: [completedTasks, activeTasks],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    function renderEnergyChart() {
        const canvas = document.getElementById('energyChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Simulated energy levels (in real app, user would log these)
        const hours = ['6am', '9am', '12pm', '3pm', '6pm', '9pm'];
        const energyLevels = [7, 8, 6, 5, 7, 4];

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Energy Level',
                    data: energyLevels,
                    borderColor: 'rgba(6, 182, 212, 1)',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }

    function renderInsights() {
        const container = document.getElementById('insightsList');
        if (!container) return;

        const insights = generateInsights();

        container.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <i class="fas ${insight.icon}"></i>
                <span>${insight.text}</span>
            </div>
        `).join('');
    }

    function generateInsights() {
        const insights = [];
        
        // Based on sessions
        const todaySessions = userData.pomodoroSessions.filter(s => 
            s.date.startsWith(new Date().toISOString().split('T')[0])
        );
        
        if (todaySessions.length >= 4) {
            insights.push({
                icon: 'fa-fire',
                text: 'Great focus today! You\'ve completed ' + todaySessions.length + ' Pomodoro sessions.'
            });
        } else if (todaySessions.length === 0) {
            insights.push({
                icon: 'fa-lightbulb',
                text: 'Start your first Pomodoro session today to build momentum!'
            });
        }
        
        // Based on goals
        const activeGoals = userData.goals.filter(g => g.status === 'active');
        if (activeGoals.length === 0) {
            insights.push({
                icon: 'fa-bullseye',
                text: 'Set some SMART goals to give your study sessions direction.'
            });
        }
        
        // Based on streak
        const streak = calculateStreak();
        if (streak >= 7) {
            insights.push({
                icon: 'fa-trophy',
                text: 'Amazing! You have a ' + streak + ' day study streak!'
            });
        }
        
        // Time-based suggestions
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            insights.push({
                icon: 'fa-sun',
                text: 'Morning is a great time for difficult subjects. Your focus is at its peak!'
            });
        }
        
        if (insights.length === 0) {
            insights.push({
                icon: 'fa-chart-line',
                text: 'Keep up the great work! Consistency is key to success.'
            });
        }
        
        return insights;
    }

    // ===========================
    // Weekly Review
    // ===========================
    function setupReviewListeners() {
        const reviewForm = document.getElementById('weeklyReviewForm');
        const productivityRating = document.getElementById('productivityRating');
        const productivityValue = document.getElementById('productivityValue');

        if (productivityRating && productivityValue) {
            productivityRating.addEventListener('input', (e) => {
                productivityValue.textContent = e.target.value;
            });
        }

        if (reviewForm) {
            reviewForm.addEventListener('submit', handleReviewSubmit);
        }
    }

    function renderReview() {
        renderPastReviews();
    }

    function handleReviewSubmit(e) {
        e.preventDefault();
        
        const wentWell = document.getElementById('wentWell').value;
        const improvements = document.getElementById('improvements').value;
        const productivityRating = document.getElementById('productivityRating').value;
        const nextWeekGoals = document.getElementById('nextWeekGoals').value;

        const review = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            wentWell,
            improvements,
            productivityRating: parseInt(productivityRating),
            nextWeekGoals
        };

        userData.reviews.push(review);
        saveUserData();

        e.target.reset();
        document.getElementById('productivityValue').textContent = '7';
        
        alert('Review saved! Use these insights to improve next week.');
        renderPastReviews();
    }

    function renderPastReviews() {
        const container = document.getElementById('pastReviewsList');
        if (!container) return;

        const reviews = userData.reviews.slice(-5).reverse();

        if (reviews.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.875rem;">No past reviews</p>';
            return;
        }

        container.innerHTML = reviews.map(review => {
            const date = new Date(review.date);
            return `
                <div class="review-entry">
                    <div class="review-date">${date.toLocaleDateString()}</div>
                    <div style="font-weight: 600; margin-bottom: 4px;">
                        Productivity: ${review.productivityRating}/10
                    </div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">
                        ${escapeHtml(review.wentWell.substring(0, 100))}${review.wentWell.length > 100 ? '...' : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===========================
    // Theme Management
    // ===========================
    function setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    // ===========================
    // Modal Management
    // ===========================
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // ===========================
    // Utility Functions
    // ===========================
    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    }

    function updateAllStats() {
        updateDashboardStats();
        updateStreak();
    }

    // ===========================
    // Initialize App
    // ===========================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Request notification permission
    if (window.Notification && Notification.permission === 'default') {
        Notification.requestPermission();
    }
})();
    
