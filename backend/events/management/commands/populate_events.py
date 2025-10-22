from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from events.models import Event


class Command(BaseCommand):
    help = 'Populate the database with sample events'

    def handle(self, *args, **options):
        # Clear existing events
        Event.objects.all().delete()
        
        sample_events = [
            {
                'name': 'Tech Innovation Summit 2024',
                'description': 'Join industry leaders discussing the latest technological innovations and future trends in AI, blockchain, and sustainable tech solutions.',
                'event_type': 'online',
                'platform': 'linkedin',
                'link': 'https://example.com/tech-summit',
                'keywords': 'tech, innovation, AI, blockchain, technology, summit',
                'start_date': timezone.now() + timedelta(days=7),
                'end_date': timezone.now() + timedelta(days=7, hours=8),
            },
            {
                'name': 'Digital Marketing Conference',
                'description': 'Learn cutting-edge digital marketing strategies from top professionals. Network with marketing experts and discover new tools.',
                'event_type': 'onsite',
                'platform': 'facebook',
                'link': 'https://example.com/marketing-conf',
                'keywords': 'marketing, digital, strategy, networking, conference',
                'start_date': timezone.now() + timedelta(days=14),
                'end_date': timezone.now() + timedelta(days=16),
            },
            {
                'name': 'Startup Pitch Competition',
                'description': 'Watch emerging startups pitch their innovative ideas to investors. Interactive Q&A sessions and networking opportunities included.',
                'event_type': 'online',
                'platform': 'twitter',
                'link': 'https://example.com/pitch-comp',
                'keywords': 'startup, pitch, investment, networking, entrepreneurship',
                'start_date': timezone.now() + timedelta(days=21),
                'end_date': timezone.now() + timedelta(days=21, hours=6),
            },
            {
                'name': 'Creative Photography Workshop',
                'description': 'Learn advanced photography techniques, editing tips, and creative composition from professional photographers. Share your work and get feedback.',
                'event_type': 'online',
                'platform': 'instagram',
                'link': 'https://example.com/photo-workshop',
                'keywords': 'photography, creative, workshop, editing, visual arts',
                'start_date': timezone.now() + timedelta(days=10),
                'end_date': timezone.now() + timedelta(days=10, hours=4),
            },
            {
                'name': 'Web Development Bootcamp',
                'description': 'Intensive hands-on workshop covering modern web development frameworks, best practices, and career advancement strategies.',
                'event_type': 'onsite',
                'platform': 'linkedin',
                'link': 'https://example.com/web-bootcamp',
                'keywords': 'web development, coding, bootcamp, programming, career',
                'start_date': timezone.now() + timedelta(days=28),
                'end_date': timezone.now() + timedelta(days=30),
            },
            {
                'name': 'AI & Machine Learning Symposium',
                'description': 'Explore the latest advances in artificial intelligence and machine learning with research presentations and practical workshops.',
                'event_type': 'online',
                'platform': 'twitter',
                'link': 'https://example.com/ai-symposium',
                'keywords': 'AI, machine learning, research, symposium, technology',
                'start_date': timezone.now() + timedelta(days=35),
                'end_date': timezone.now() + timedelta(days=35, hours=10),
            },
            {
                'name': 'Sustainable Business Forum',
                'description': 'Discuss sustainable business practices, environmental impact, and corporate responsibility with industry experts.',
                'event_type': 'onsite',
                'platform': 'facebook',
                'link': 'https://example.com/sustainable-forum',
                'keywords': 'sustainability, business, environment, corporate responsibility',
                'start_date': timezone.now() + timedelta(days=42),
                'end_date': timezone.now() + timedelta(days=43),
            },
            {
                'name': 'Social Media Influencer Meetup',
                'description': 'Network with social media influencers, learn content creation strategies, and discover new collaboration opportunities.',
                'event_type': 'onsite',
                'platform': 'instagram',
                'link': 'https://example.com/influencer-meetup',
                'keywords': 'social media, influencer, content creation, networking',
                'start_date': timezone.now() + timedelta(days=49),
                'end_date': timezone.now() + timedelta(days=49, hours=6),
            }
        ]
        
        for event_data in sample_events:
            event = Event.objects.create(**event_data)
            self.stdout.write(
                self.style.SUCCESS(f'Created event: {event.name}')
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(sample_events)} sample events')
        )