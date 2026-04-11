# Code Arena - Competitive Programming Platform

A full-featured competitive programming platform with real-time leaderboards, submission tracking, and social features.

## 🚀 Features

### Phase 1: Contest System
- **ICPC Scoring**: Accurate penalty calculations and ranking
- **Submission Tracking**: Detailed verdict with test results
- **Real-time Leaderboard**: Live updates with WebSocket

### Phase 2: Results Syncing
- **Verdict Synchronization**: WebSocket + polling fallback
- **Cross-view Updates**: Consistent state across all components
- **Concurrent Handling**: Support for multiple simultaneous submissions

### Phase 3: User Management
- **User Profiles**: Detailed statistics and history
- **Submission Analytics**: Tracking and visualization
- **Leaderboard Position**: Global ranking and percentile

### Phase 4: Search & Discovery
- **Advanced Search**: Multi-filter problem searching
- **Saved Collections**: Organize bookmarked problems
- **Search History**: Quick access to recent queries
- **Smart Autocomplete**: Intelligent suggestions
- **Filter Presets**: Save and reuse filter combinations
- **Analytics**: View trending searches and stats

### Phase 5: Email System
- **Notification Preferences**: Customize email settings
- **Email Frequency**: Immediate, daily, or weekly options
- **Digest Emails**: Customizable weekly summaries
- **Multi-trigger**: Contest, submission, discussion, and follow emails
- **Email Templates**: Admin-customizable templates
- **Analytics**: Track email performance and engagement

### Phase 6: Social Features
- **Follow System**: Follow other programmers
- **Followers Leaderboard**: See top followed users
- **Activity Feeds**: View followed users' activities
- **User Discovery**: Search and find users by skill level
- **Recommendations**: Get personalized follow suggestions
- **Social Stats**: Track follower growth

## 📦 Architecture

### Frontend
```
Framework: Next.js 14 with App Router
Language: TypeScript (strict mode)
Styling: Tailwind CSS
State: React Context + Custom Hooks
Testing: Playwright (E2E) + Jest (Unit)
```

### Components
- **Search**: 5 components for advanced search
- **Email**: 3 components for notification management
- **Social**: 6 components for social features
- **Contests**: 6+ components for contest arena
- **Profile**: 7 components for user profiles
- **Submissions**: 6 components for submission tracking
- **Discussions**: 3 components for forum

### Pages
- `/app/search/advanced` - Advanced search dashboard
- `/settings/email` - Email preferences
- `/discover/users` - User discovery
- `/feed/following` - Activity feed

## 🧪 Testing

### E2E Tests (130+)
- Advanced Search: 50 tests
- Email System: 40 tests
- Social Follow: 40 tests

### Unit Tests (40+)
- Search Components: 12 tests
- Email Components: 15 tests
- Social Components: 12+ tests

### Coverage
- Overall: 85%+
- Components: 90%+
- Pages: 80%+

## 🛠️ Development

### Setup
```bash
npm install
npm run dev
```

### Testing
```bash
# E2E tests
npm run test:e2e

# Unit tests
npm run test

# All tests
npm run test:all
```

### Building
```bash
npm run build
npm start
```

## 📚 Documentation

- `DEPLOYMENT_GUIDE.md` - Production deployment steps
- `LOCAL_DEVELOPMENT.md` - Local development setup
- `ENV_VARIABLES_TEMPLATE.md` - Required environment variables
- `NEONDB_SETUP.md` - Database configuration
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment verification

## 🔧 Configuration

### Environment Variables
Copy `.env.production.example` to `.env.production` and configure:
```bash
NEXT_PUBLIC_API_URL=https://api.codearena.com
NEXT_PUBLIC_JUDGE0_API_URL=https://judge0-api.com
GEMINI_API_KEY=your-key-here
```

### Deployment
- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Render**: `render.yaml`
- **Vercel**: `vercel.json`

## 📁 Project Structure

```
code-arena-frontend/
├── app/                    # Next.js App Router pages
│   ├── search/            # Search pages
│   ├── settings/          # Settings pages
│   ├── discover/          # Discovery pages
│   ├── feed/              # Feed pages
│   └── (protected)/       # Protected routes
├── components/            # React components
│   ├── search/           # Search feature
│   ├── email/            # Email feature
│   ├── social/           # Social feature
│   ├── contests/         # Contest feature
│   ├── profile/          # Profile feature
│   └── submissions/      # Submissions feature
├── e2e/                   # Playwright tests
├── public/                # Static assets
├── styles/                # Global styles
└── jest.config.js         # Jest configuration
```

## 🚀 Deployment

### Production Deployment
```bash
# 1. Run deployment script
./scripts/prepare-deployment.sh

# 2. Check health
./scripts/health-check.sh

# 3. Deploy to Render or Vercel
npm run build
git push
```

## 📊 Metrics

- **Components**: 50+
- **Pages**: 24
- **E2E Tests**: 130+
- **Unit Tests**: 40+
- **Code Coverage**: 85%+
- **TypeScript**: 100% strict mode

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for new features
4. Submit a pull request

## 📝 License

MIT

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-11  
**Status**: Production Ready ✅
