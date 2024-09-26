import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import random
from datetime import timedelta, datetime
from django.utils import timezone
from timetracker.models import TimeLog, User, Category

def populate_timelogs():
    user = User.objects.get(username='demouser')
    categories = ['Work', 'Study', 'Read', 'Workout']
    
    # Crear entradas para agosto
    # for _ in range(60):
    #     date = datetime(2024, 8, random.randint(1, 31))
    #     category = Category.objects.get_or_create(slug=random.choice(categories))[0]
    #     duration = timedelta(minutes=random.randint(5, 60))
    #     TimeLog.objects.create(user=user, category=category, createdDate=date, duration=duration)
    
    # Crear entradas para septiembre
    for _ in range(80):
        date = datetime(2024, 9, random.randint(1, 30))
        category = Category.objects.get_or_create(slug=random.choice(categories))[0]
        duration = timedelta(minutes=random.randint(5, 60))
        TimeLog.objects.create(user=user, category=category, createdDate=date, duration=duration)

if __name__ == "__main__":
    populate_timelogs()