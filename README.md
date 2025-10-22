# EventScope-Utility

A comprehensive event discovery platform that aggregates events from multiple social media platforms, providing users with a centralized interface to search, filter, and save events based on their interests.

## Overview

EventScope is a full-stack web application that combines a React frontend with a Django REST API backend to deliver a seamless event discovery experience. The platform currently supports event scraping from LinkedIn and is designed to be extensible for additional social media platforms.

## Features

### Current Features
- **Multi-Platform Event Search**: Search for events across different social media platforms
- **Advanced Filtering**: Filter events by keywords, date range, and platform
- **Event Management**: Save and organize events for future reference
- **Dark/Light Theme**: Toggle between dark and light modes for better user experience
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Real-time Search**: Live event scraping with loading indicators

### Planned Features
- Additional social media platform integrations (Twitter, Facebook, Instagram)
- User authentication and personalized event recommendations
- Event notifications and reminders
- Advanced search filters (location, event type, price range)
- Event calendar integration

## Technology Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **React Icons** - Comprehensive icon library
- **React DatePicker** - Date selection components
- **CSS3** - Custom styling with CSS variables for theming

### Backend
- **Django 5.2.7** - High-level Python web framework
- **Django REST Framework** - Powerful toolkit for building Web APIs
- **Selenium** - Web scraping automation
- **BeautifulSoup4** - HTML parsing library
- **SQLite3** - Development database
- **CORS Headers** - Cross-origin resource sharing

## Project Structure

```
EventScope/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── HomePage.jsx    # Main search interface
│   │   │   ├── ResultsPage.jsx # Search results display
│   │   │   ├── SavedPage.jsx   # Saved events management
│   │   │   ├── Navbar.jsx      # Navigation header
│   │   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   │   └── FilterModal.jsx # Platform filter modal
│   │   ├── contexts/           # React contexts
│   │   │   └── ThemeContext.jsx # Theme management
│   │   ├── services/           # API services
│   │   │   └── api.js          # Backend communication
│   │   ├── App.jsx             # Main application component
│   │   ├── App.css             # Application styles
│   │   └── main.jsx            # Application entry point
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
├── backend/                     # Django application
│   ├── eventscope/             # Django project settings
│   │   ├── settings.py         # Project configuration
│   │   ├── urls.py             # URL routing
│   │   └── wsgi.py             # WSGI configuration
│   ├── events/                 # Events app
│   │   ├── models.py           # Database models
│   │   ├── views.py            # API endpoints
│   │   ├── serializers.py      # Data serialization
│   │   ├── urls.py             # App URL routing
│   │   └── linkedin_scraper.py # LinkedIn scraping service
│   ├── manage.py               # Django management script
│   └── requirements.txt        # Backend dependencies
└── README.md                   # Project documentation
```

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Chrome Browser** (for Selenium web scraping)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Populate with sample data:**
   ```bash
   python manage.py populate_events
   ```

7. **Start the Django development server:**
   ```bash
   python manage.py runserver 8000
   ```

The Django API will be available at `http://127.0.0.1:8000/`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm run dev
   ```

The React application will be available at `http://localhost:5173/`

## Usage

### Basic Workflow

1. **Search for Events:**
   - Enter keywords in the search box
   - Select start and end dates using the date pickers
   - Choose a platform using the filter button
   - Click "Search Events" to find relevant events

2. **View Results:**
   - Browse through the search results
   - Click the bookmark icon to save events
   - Use the external link to visit the original event page

3. **Manage Saved Events:**
   - Navigate to the "Saved" tab to view saved events
   - Remove events from your saved list as needed

### API Endpoints

The Django backend provides the following REST API endpoints:

- `GET /api/events/` - List all events
- `POST /api/events/search/` - Search events with filters
- `POST /api/events/live-scrape/` - Perform live event scraping
- `GET /api/events/saved/` - Get user's saved events
- `POST /api/events/save/` - Save an event
- `DELETE /api/events/unsave/{id}/` - Remove saved event

## Development Notes

### Web Scraping
The LinkedIn scraper uses Selenium with Chrome WebDriver to extract event data. The scraper includes:
- Headless browser automation
- Error handling and fallback mechanisms
- Rate limiting to avoid being blocked
- Data extraction with CSS selectors

### Theme System
The application uses CSS variables for theming:
- Light and dark mode support
- Consistent color scheme across components
- Easy theme customization

### State Management
- React Context for theme management
- Session storage for search persistence
- API integration for data persistence

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **Chrome Driver Issues:**
   - Ensure Chrome browser is installed
   - WebDriver will be automatically downloaded by webdriver-manager

2. **CORS Errors:**
   - Verify that CORS is properly configured in Django settings
   - Check that frontend is running on `http://localhost:5173`

3. **Database Issues:**
   - Run migrations: `python manage.py migrate`
   - Clear database: Delete `db.sqlite3` and run migrations again

4. **Port Conflicts:**
   - Backend default: `http://127.0.0.1:8000`
   - Frontend default: `http://localhost:5173`
   - Change ports in respective configuration files if needed

## Future Enhancements

- [ ] User authentication system
- [ ] Additional social media platform integrations
- [ ] Advanced filtering options
- [ ] Event recommendation engine
- [ ] Mobile application
- [ ] Event calendar synchronization
- [ ] Email notifications
- [ ] Event analytics and insights 
