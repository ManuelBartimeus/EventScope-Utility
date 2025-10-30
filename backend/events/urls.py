from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    path('', views.EventListCreateView.as_view(), name='event-list-create'),
    path('<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    path('search/', views.search_events, name='search-events'),
    path('saved/', views.SavedEventListView.as_view(), name='saved-events'),
    path('save/', views.save_event, name='save-event'),
    path('unsave/<int:event_id>/', views.unsave_event, name='unsave-event'),
    path('search-history/', views.SearchHistoryListView.as_view(), name='search-history'),
    # Chrome extension endpoints
    path('results/', views.receive_extension_data, name='extension-results'),
    path('results/get/', views.get_extension_results, name='get-extension-results'),
]