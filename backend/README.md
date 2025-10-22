# EventScope Backend API

Django REST API backend for the EventScope application - a social media event discovery platform.

## Features

- **Event Management**: CRUD operations for events
- **User Authentication**: Registration, login, logout
- **Event Search**: Advanced search functionality with filters
- **Saved Events**: Users can save and manage their favorite events
- **Search History**: Track user search patterns
- **Social Media Integration**: Support for LinkedIn, Twitter, Facebook, Instagram

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login  
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/update/` - Update user profile

### Events
- `GET /api/events/` - List all events
- `POST /api/events/` - Create new event (authenticated users)
- `GET /api/events/<id>/` - Get specific event
- `PUT /api/events/<id>/` - Update event
- `DELETE /api/events/<id>/` - Delete event
- `POST /api/events/search/` - Search events with filters
- `GET /api/events/saved/` - Get user's saved events
- `POST /api/events/save/` - Save an event
- `DELETE /api/events/unsave/<id>/` - Remove saved event
- `GET /api/events/search-history/` - Get user's search history

## Installation & Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Create superuser** (optional):
   ```bash
   python manage.py createsuperuser
   ```

5. **Populate sample data**:
   ```bash
   python manage.py populate_events
   ```

6. **Start development server**:
   ```bash
   python manage.py runserver 8000
   ```

## Configuration

### CORS Settings
The API is configured to accept requests from:
- `http://localhost:3000` (Create React App default)
- `http://localhost:5173` (Vite default)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

### Database
- **Development**: SQLite3 (included)
- **Production**: Can be configured for PostgreSQL, MySQL, etc.

## Models

### Event
- `name`: Event title
- `description`: Event description
- `event_type`: 'online' or 'onsite'
- `platform`: 'linkedin', 'twitter', 'facebook', 'instagram'
- `link`: Event URL
- `start_date`: Event start datetime
- `end_date`: Event end datetime
- `keywords`: Searchable keywords

### SavedEvent
- Links users to their saved events

### SearchHistory
- Tracks user search queries for analytics

## Admin Interface

Access the Django admin at `http://127.0.0.1:8000/admin/` to manage:
- Events
- Users
- Saved Events
- Search History

## API Testing

### Example Search Request
```json
POST /api/events/search/
{
    "keywords": "tech innovation",
    "platform": "linkedin",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-12-31T23:59:59Z"
}
```

### Example Event Creation
```json
POST /api/events/
{
    "name": "My Tech Event",
    "description": "An amazing tech event",
    "event_type": "online",
    "platform": "linkedin",
    "link": "https://example.com/event",
    "start_date": "2024-12-01T10:00:00Z",
    "end_date": "2024-12-01T18:00:00Z",
    "keywords": "tech, innovation, networking"
}
```

## Development

### Project Structure
```
backend/
├── eventscope_backend/     # Main Django project
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── events/                 # Events app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── authentication/         # Authentication app
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── manage.py
└── requirements.txt
```

### Key Technologies
- **Django 5.2.7**: Web framework
- **Django REST Framework**: API framework
- **django-cors-headers**: CORS support
- **SQLite3**: Database (development)

## Security Notes

- CSRF protection enabled
- CORS configured for frontend origins
- Authentication required for sensitive operations
- Input validation and serialization