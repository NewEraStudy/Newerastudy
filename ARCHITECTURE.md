# StudyMaster Technical Architecture

## Overview

StudyMaster is a client-side web application built with vanilla JavaScript, HTML5, and CSS3. It uses localStorage for data persistence, requiring no backend infrastructure.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Landing Page│  │  Dashboard   │  │   Modals     │ │
│  │  (index.html)│  │(dashboard.html)│ │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  Application Logic Layer                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   auth.js    │  │    app.js    │  │   Charts     │ │
│  │ (Auth Logic) │  │(Core Features)│ │  (Chart.js)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    Data Storage Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ LocalStorage │  │  User Data   │  │  App State   │ │
│  │   (Browser)  │  │    (JSON)    │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Core Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| HTML5 | Structure & Semantics | - |
| CSS3 | Styling & Animations | - |
| JavaScript (ES6+) | Application Logic | ES2020+ |
| Chart.js | Data Visualization | 4.x |
| Font Awesome | Icons | 6.4.0 |
| Google Fonts | Typography | - |

### Why Vanilla JavaScript?

- ✅ Zero dependencies = Faster load times
- ✅ Easy deployment (no build process)
- ✅ Maximum browser compatibility
- ✅ Easy to understand and contribute
- ✅ Complete control over code
- ✅ No framework lock-in

## Data Architecture

### User Data Structure

```javascript
{
  // User Profile
  "currentUser": {
    "id": "unique-id",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "hashed-password",
    "grade": "11",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "preferences": {
      "peakTime": "morning",
      "subjects": ["Math", "Physics"],
      "focusDuration": 25,
      "breakDuration": 5
    },
    "stats": {
      "streak": 7,
      "totalPomodoros": 42,
      "totalStudyTime": 1050,
      "lastActiveDate": "2024-01-08T00:00:00.000Z"
    }
  },

  // Study Data
  "userData_[userId]": {
    "schedule": [
      {
        "id": "schedule-1",
        "subject": "Mathematics",
        "date": "2024-01-08",
        "startTime": "14:00",
        "endTime": "15:30",
        "notes": "Chapter 5 exercises",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    
    "goals": [
      {
        "id": "goal-1",
        "title": "Ace Math Final",
        "description": "Score 90% or higher",
        "deadline": "2024-06-01",
        "priority": "high",
        "progress": 65,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    
    "tasks": [
      {
        "id": "task-1",
        "title": "Complete homework",
        "quadrant": "urgent-important",
        "completed": false,
        "createdAt": "2024-01-08T00:00:00.000Z"
      }
    ],
    
    "decks": [
      {
        "id": "deck-1",
        "name": "Vocabulary",
        "subject": "English",
        "cards": [
          {
            "id": "card-1",
            "front": "Ephemeral",
            "back": "Lasting for a very short time",
            "nextReview": "2024-01-09T00:00:00.000Z",
            "interval": 1
          }
        ],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    
    "pomodoroSessions": [
      {
        "id": "session-1",
        "date": "2024-01-08T14:30:00.000Z",
        "duration": 25,
        "type": "focus"
      }
    ],
    
    "reviews": [
      {
        "id": "review-1",
        "date": "2024-01-07T00:00:00.000Z",
        "wentWell": "Completed all tasks",
        "improvements": "Better time management",
        "productivityRating": 8,
        "nextWeekGoals": "Focus on Math and Physics"
      }
    ],
    
    "analytics": {
      "dailyStudyTime": [],
      "weeklyCompletionRate": [],
      "energyLevels": []
    }
  }
}
```

### Storage Strategy

- **Users List**: `localStorage.users` - Array of all registered users
- **Current User**: `localStorage.currentUser` - Currently logged in user
- **User Data**: `localStorage.userData_[userId]` - Individual user's study data
- **Theme**: `localStorage.theme` - UI theme preference (light/dark)

## Application Flow

### Authentication Flow

```
Landing Page (index.html)
    ↓
User clicks "Get Started"
    ↓
Registration Modal Opens
    ↓
User fills form and submits
    ↓
Validate input
    ↓
Create user object
    ↓
Store in localStorage
    ↓
Set as currentUser
    ↓
Redirect to dashboard.html
```

### Session Management

```
Dashboard loads
    ↓
Check localStorage for currentUser
    ↓
If not found → Redirect to login
    ↓
If found → Load user data
    ↓
Initialize UI with user's data
    ↓
Start tracking activity
```

### Data Persistence Flow

```
User performs action (e.g., adds goal)
    ↓
Update in-memory userData object
    ↓
Call saveUserData()
    ↓
Serialize to JSON
    ↓
Store in localStorage
    ↓
Update UI to reflect changes
```

## Key Components

### 1. Authentication System (auth.js)

**Responsibilities:**
- User registration
- User login
- Session management
- Initial data setup

**Key Functions:**
```javascript
handleLogin(email, password)
handleRegister(userData)
checkAuth()
initializeUserData(userId)
```

### 2. Dashboard Controller (app.js)

**Responsibilities:**
- Navigation management
- Data loading/saving
- UI rendering
- Event handling

**Key Functions:**
```javascript
init()
loadUserData()
saveUserData()
navigateToSection(section)
renderSection(section)
```

### 3. Feature Modules

Each feature has dedicated functions:

**Schedule Module:**
```javascript
renderSchedule()
handleScheduleSubmit()
formatTime()
```

**Goals Module:**
```javascript
renderGoals(filter)
handleGoalSubmit()
updateGoalProgress(goalId)
completeGoal(goalId)
```

**Pomodoro Module:**
```javascript
toggleTimer()
resetPomodoroTimer()
timerComplete()
updateTimerDisplay()
```

**Analytics Module:**
```javascript
renderWeeklyStudyChart()
renderCompletionChart()
renderEnergyChart()
generateInsights()
```

### 4. UI Components

**Modal System:**
```javascript
openModal(modalId)
closeModal(modalId)
```

**Theme System:**
```javascript
setupTheme()
toggleTheme()
updateThemeIcon()
```

## Performance Optimizations

### 1. Lazy Rendering
- Only render active section
- Charts created on-demand
- Event listeners attached once

### 2. Data Caching
- Keep userData in memory
- Only read from localStorage on init
- Batch writes to localStorage

### 3. CSS Optimizations
- CSS custom properties for theming
- Hardware-accelerated animations
- Minimal repaints/reflows

### 4. Asset Optimization
- CDN for external libraries
- Minimal external dependencies
- Compressed/minified fonts

## Security Considerations

### Current Implementation

⚠️ **Important**: This is a client-side only app with basic security

- Passwords stored in plain text (localStorage)
- No encryption
- No authentication server
- Suitable for personal use only

### Recommendations for Production

If deploying to production with real users:

1. **Add Backend Authentication**
   - Use proper auth service (Firebase, Auth0)
   - Hash passwords (bcrypt)
   - Implement JWT tokens

2. **Encrypt Sensitive Data**
   - Use crypto libraries
   - Encrypt before storing

3. **Add HTTPS**
   - Always use HTTPS in production
   - Prevent man-in-the-middle attacks

4. **Implement CSRF Protection**
   - Add CSRF tokens
   - Validate requests

## Scalability Considerations

### Current Limitations

- **Storage**: 5-10MB localStorage limit
- **Performance**: Degrades with >1000 items
- **Sync**: No cross-device synchronization

### Scaling Path

**Phase 1: Enhanced Client**
- IndexedDB for larger storage
- Service Workers for offline support
- Web Workers for heavy computations

**Phase 2: Backend Integration**
- REST API for data sync
- Cloud storage (Firebase/Supabase)
- Real-time updates (WebSockets)

**Phase 3: Full Stack**
- User authentication service
- Database (PostgreSQL)
- API server (Node.js/Python)
- File storage (S3)

## Browser Compatibility

### Supported Browsers

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Recommended |
| Firefox | 88+ | Full support |
| Safari | 14+ | Limited notification support |
| Edge | 90+ | Full support |

### Required APIs

- localStorage
- JSON
- ES6+ (arrow functions, template literals, etc.)
- CSS Grid & Flexbox
- CSS Custom Properties

### Polyfills Needed

None! We use only widely-supported features.

## Testing Strategy

### Manual Testing Checklist

- [ ] Registration flow
- [ ] Login flow
- [ ] All CRUD operations
- [ ] Pomodoro timer functionality
- [ ] Chart rendering
- [ ] Theme switching
- [ ] Responsive design
- [ ] Dark mode
- [ ] Data persistence

### Browser Testing

- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop/mobile)
- [ ] Edge (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

## Deployment Architecture

### Static Hosting

```
CDN/Static Host (Netlify/Vercel/GitHub Pages)
    ↓
Serve HTML, CSS, JS files
    ↓
Browser loads and executes
    ↓
localStorage for persistence
```

### Future Backend Architecture

```
Client (Browser)
    ↓
REST API (Node.js/Express)
    ↓
Database (PostgreSQL)
    ↓
File Storage (S3)
    ↓
Cache (Redis)
```

## Error Handling

### Current Strategy

```javascript
try {
    // Operation
    localStorage.setItem(key, value);
} catch (error) {
    // Fallback
    console.error('Storage failed:', error);
    alert('Unable to save. Please try again.');
}
```

### Future Improvements

- Centralized error handling
- User-friendly error messages
- Error logging service
- Automatic retry logic

## Accessibility

### WCAG 2.1 Compliance

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast (AA)
- ⚠️ Screen reader testing needed

### Keyboard Shortcuts (Future)

- `Ctrl+N`: New goal
- `Ctrl+S`: Save
- `Space`: Start/pause timer
- `Esc`: Close modal

## Monitoring & Analytics

### Current State

No analytics tracking (privacy-first approach)

### Future Considerations

If adding analytics:
- Google Analytics (optional)
- Error tracking (Sentry)
- Performance monitoring
- User feedback system

## Version Control Strategy

### Branch Structure

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical fixes

### Release Process

1. Develop features in branches
2. Merge to `develop`
3. Test thoroughly
4. Create release branch
5. Merge to `main`
6. Tag version
7. Deploy

## API Documentation (Future)

When backend is added:

```javascript
// GET /api/users/:id
// Response
{
  "id": "user-123",
  "name": "John Doe",
  "stats": {...}
}

// POST /api/goals
// Request
{
  "title": "New Goal",
  "description": "...",
  "deadline": "2024-12-31"
}

// Response
{
  "id": "goal-456",
  "status": "created"
}
```

## Conclusion

StudyMaster's architecture prioritizes simplicity, performance, and ease of deployment. While currently a client-side only application, it's designed with extensibility in mind for future backend integration and enhanced features.

For questions or suggestions about the architecture, please open an issue on GitHub.
