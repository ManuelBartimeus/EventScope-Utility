from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q
from datetime import datetime
from .models import Event, SavedEvent, SearchHistory
from .serializers import (
    EventSerializer, SavedEventSerializer, 
    SearchHistorySerializer, EventSearchSerializer
)


class EventListCreateView(generics.ListCreateAPIView):
    """List all events or create a new event"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an event"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def search_events(request):
    """Search for events based on criteria"""
    serializer = EventSearchSerializer(data=request.data)
    
    if serializer.is_valid():
        data = serializer.validated_data
        keywords = data['keywords']
        platform = data['platform']
        start_date = data['start_date']
        end_date = data['end_date']
        
        # Save search history (optional - for anonymous users)
        if request.user.is_authenticated:
            SearchHistory.objects.create(
                user=request.user,
                keywords=keywords,
                platform=platform,
                start_date=start_date,
                end_date=end_date
            )
        
        # Search for events
        events = Event.objects.filter(
            Q(keywords__icontains=keywords) | Q(name__icontains=keywords) | Q(description__icontains=keywords),
            platform=platform,
            start_date__gte=start_date,
            end_date__lte=end_date
        )
        
        # For demo purposes, if no events found, return dummy data
        if not events.exists():
            # Return dummy events that match the search criteria
            dummy_events = get_dummy_events(platform, keywords, start_date, end_date)
            return Response({
                'results': dummy_events,
                'count': len(dummy_events),
                'message': 'Showing sample results for demonstration'
            })
        
        event_serializer = EventSerializer(events, many=True)
        return Response({
            'results': event_serializer.data,
            'count': events.count()
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SavedEventListView(generics.ListAPIView):
    """List user's saved events"""
    serializer_class = SavedEventSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedEvent.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_event(request):
    """Save an event for the user"""
    event_id = request.data.get('event_id')
    
    if not event_id:
        return Response({'error': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    
    saved_event, created = SavedEvent.objects.get_or_create(
        user=request.user,
        event=event
    )
    
    if created:
        serializer = SavedEventSerializer(saved_event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response({'message': 'Event already saved'}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def unsave_event(request, event_id):
    """Remove an event from user's saved events"""
    try:
        saved_event = SavedEvent.objects.get(user=request.user, event_id=event_id)
        saved_event.delete()
        return Response({'message': 'Event removed from saved'}, status=status.HTTP_200_OK)
    except SavedEvent.DoesNotExist:
        return Response({'error': 'Saved event not found'}, status=status.HTTP_404_NOT_FOUND)


class SearchHistoryListView(generics.ListAPIView):
    """List user's search history"""
    serializer_class = SearchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])  # Allow Chrome extension without auth
def receive_extension_data(request):
    """Receive scraped data from Chrome extension and store/forward it"""
    try:
        data = request.data
        source = data.get('source', 'unknown')
        timestamp = data.get('timestamp', datetime.now().isoformat())
        scraped_data = data.get('data', {})
        
        print(f"Received data from {source} at {timestamp}")
        print(f"Data contains {len(scraped_data.get('results', []))} results")
        
        # Process the scraped data
        results = scraped_data.get('results', [])
        content_type = scraped_data.get('contentType', 'search_results')
        processed_results = []
        
        for result in results:
            if content_type == 'feed_posts' and result.get('type') == 'feed_post':
                # Handle LinkedIn feed posts
                processed_result = {
                    'id': result.get('id'),
                    'type': 'feed_post',
                    'name': 'Feed Post',  # Generic title for posts
                    'author': result.get('author', 'Unknown'),
                    'description': result.get('description', ''),
                    'event_type': 'feed_post',
                    'platform': 'linkedin',
                    'urn': result.get('urn', ''),
                    'likes': result.get('likes', 0),
                    'comments': result.get('comments', 0),
                    'reposts': result.get('reposts', 0),
                    'extractedAt': result.get('extractedAt'),
                    'source': 'chrome_extension'
                }
            else:
                # Handle LinkedIn profile search results (existing logic)
                processed_result = {
                    'id': result.get('id'),
                    'name': result.get('name', 'Unknown'),
                    'description': result.get('description', ''),
                    'event_type': 'profile',
                    'platform': 'linkedin',
                    'link': result.get('profileUrl', '#'),
                    'location': result.get('location', ''),
                    'image_url': result.get('imageUrl', ''),
                    'extractedAt': result.get('extractedAt'),
                    'keywords': scraped_data.get('searchKeywords', ''),
                    'source': 'chrome_extension'
                }
            processed_results.append(processed_result)
        
        # Store in a way that can be retrieved by frontend
        # For now, we'll use session storage or a simple cache
        # In production, you might want to store this in the database
        
        # Return success response to extension
        response_data = {
            'success': True,
            'message': f'Received {len(processed_results)} results',
            'processed_count': len(processed_results),
            'redirect_url': 'http://localhost:5173/results',  # Frontend results page
        }
        
        # Store processed data in request session or cache for frontend retrieval
        request.session['extension_results'] = {
            'data': processed_results,
            'timestamp': timestamp,
            'source': source,
            'original_data': scraped_data
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error processing extension data: {str(e)}")
        return Response(
            {'success': False, 'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_extension_results(request):
    """Get the latest results from Chrome extension"""
    try:
        # Retrieve stored extension results
        results_data = request.session.get('extension_results', {})
        
        if not results_data:
            return Response(
                {'results': [], 'message': 'No extension data available'}, 
                status=status.HTTP_200_OK
            )
        
        return Response({
            'results': results_data.get('data', []),
            'timestamp': results_data.get('timestamp'),
            'source': results_data.get('source'),
            'count': len(results_data.get('data', [])),
            'message': 'Extension results retrieved successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error retrieving extension results: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def get_dummy_events(platform, keywords, start_date, end_date):
    """Generate dummy events for demonstration"""
    from datetime import timedelta
    import random
    
    dummy_data = [
        {
            'id': 1,
            'name': 'Tech Innovation Summit 2024',
            'description': 'Join industry leaders discussing the latest technological innovations and future trends in AI, blockchain, and sustainable tech solutions.',
            'event_type': 'online',
            'platform': 'linkedin',
            'link': 'https://example.com/tech-summit',
            'keywords': 'tech, innovation, AI, blockchain',
        },
        {
            'id': 2,
            'name': 'Digital Marketing Conference',
            'description': 'Learn cutting-edge digital marketing strategies from top professionals. Network with marketing experts and discover new tools.',
            'event_type': 'onsite',
            'platform': 'facebook',
            'link': 'https://example.com/marketing-conf',
            'keywords': 'marketing, digital, strategy, networking',
        },
        {
            'id': 3,
            'name': 'Startup Pitch Competition',
            'description': 'Watch emerging startups pitch their innovative ideas to investors. Interactive Q&A sessions and networking opportunities included.',
            'event_type': 'online',
            'platform': 'twitter',
            'link': 'https://example.com/pitch-comp',
            'keywords': 'startup, pitch, investment, networking',
        },
        {
            'id': 4,
            'name': 'Creative Photography Workshop',
            'description': 'Learn advanced photography techniques, editing tips, and creative composition from professional photographers. Share your work and get feedback.',
            'event_type': 'online',
            'platform': 'instagram',
            'link': 'https://example.com/photo-workshop',
            'keywords': 'photography, creative, workshop, editing',
        },
    ]
    
    # Filter dummy data based on platform and add dates
    filtered_events = []
    for event in dummy_data:
        if event['platform'] == platform:
            # Add random dates within the search range
            event_start = start_date + timedelta(days=random.randint(0, 7))
            event_end = event_start + timedelta(hours=random.randint(2, 8))
            
            event.update({
                'start_date': event_start.isoformat(),
                'end_date': event_end.isoformat(),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
            })
            filtered_events.append(event)
    
    return filtered_events
