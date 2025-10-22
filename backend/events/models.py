from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    PLATFORM_CHOICES = [
        ('linkedin', 'LinkedIn'),
        ('twitter', 'Twitter/X'),
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
    ]
    
    EVENT_TYPE_CHOICES = [
        ('online', 'Online'),
        ('onsite', 'On-site'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    event_type = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    link = models.URLField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    keywords = models.CharField(max_length=500, help_text="Comma-separated keywords")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['platform']),
            models.Index(fields=['event_type']),
            models.Index(fields=['start_date']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.platform})"


class SavedEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_events')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'event')
        ordering = ['-saved_at']
    
    def __str__(self):
        return f"{self.user.username} saved {self.event.name}"


class SearchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='search_history', null=True, blank=True)
    keywords = models.CharField(max_length=500)
    platform = models.CharField(max_length=20, choices=Event.PLATFORM_CHOICES)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    searched_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-searched_at']
    
    def __str__(self):
        return f"Search: {self.keywords} on {self.platform}"
