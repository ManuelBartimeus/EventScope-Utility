from django.contrib import admin
from .models import Event, SavedEvent, SearchHistory


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'platform', 'event_type', 'start_date', 'created_at']
    list_filter = ['platform', 'event_type', 'created_at']
    search_fields = ['name', 'description', 'keywords']
    date_hierarchy = 'start_date'
    ordering = ['-created_at']


@admin.register(SavedEvent)
class SavedEventAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'saved_at']
    list_filter = ['saved_at', 'event__platform']
    search_fields = ['user__username', 'event__name']
    ordering = ['-saved_at']


@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'keywords', 'platform', 'searched_at']
    list_filter = ['platform', 'searched_at']
    search_fields = ['user__username', 'keywords']
    date_hierarchy = 'searched_at'
    ordering = ['-searched_at']
