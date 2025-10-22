from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, SavedEvent, SearchHistory


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'event_type', 'platform', 
            'link', 'start_date', 'end_date', 'keywords', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SavedEventSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    event_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = SavedEvent
        fields = ['id', 'event', 'event_id', 'saved_at']
        read_only_fields = ['id', 'saved_at']


class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = [
            'id', 'keywords', 'platform', 'start_date', 
            'end_date', 'searched_at'
        ]
        read_only_fields = ['id', 'searched_at']


class EventSearchSerializer(serializers.Serializer):
    """Serializer for event search requests"""
    keywords = serializers.CharField(max_length=500)
    platform = serializers.ChoiceField(choices=Event.PLATFORM_CHOICES)
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    
    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date must be before end date")
        return data