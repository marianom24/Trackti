from django.db import models
from django.db.models import Sum
from django.contrib.auth.models import User
from datetime import timedelta, datetime
from django.utils import timezone
import calendar


class Category(models.Model):
    title = models.CharField(max_length=255)
    slug = models.CharField(max_length=255)
    def __str__(self) -> str:
        return self.title
    
class TimeLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    createdDate = models.DateField(default=timezone.now)
    duration = models.DurationField()

    @classmethod
    def daily_stats(cls, user, date=None, time_period='week'):
        if date is None:
            date = timezone.now().date()
        else:
            date = datetime.strptime(date, '%Y-%m-%d').date()

        today_entries = cls.objects.filter(user=user, createdDate=(date)).select_related('category')

        start_week = date - timedelta(days=date.weekday())
        end_week = start_week + timedelta(days=6)
        week_entries = cls.objects.filter(user=user, createdDate__range=(start_week, end_week)).select_related('category')

        start_month = date.replace(day=1)
        end_month = date.replace(day=calendar.monthrange(date.year, date.month)[1])
        month_entries = cls.objects.filter(user=user, createdDate__range=(start_month, end_month)).select_related('category')

        if time_period == 'week':
            daily_stats = week_entries.values('createdDate', 'category__title').annotate(total_time=Sum('duration')).order_by('createdDate', 'category__title')
        elif time_period == 'month':
            daily_stats = month_entries.values('createdDate', 'category__title').annotate(total_time=Sum('duration')).order_by('createdDate', 'category__title')
        elif time_period == 'today':
            daily_stats = today_entries.values('category__title').annotate(total_time=Sum('duration')).order_by('category__title')
        for entry in daily_stats:
            total_seconds = entry['total_time'].total_seconds()
            entry['total_time'] = round(total_seconds / 60)  # Convertir a minutos
            
        return daily_stats        

    @classmethod
    def weekly_stats(cls, user, date=None): #retorna promedios y totales mensuales por categoría#
        if date is None:
            date = timezone.now().date()
        else:
            date = datetime.strptime(date, '%Y-%m-%d').date()

        start_week = date - timedelta(days=date.weekday())
        end_week = start_week + timedelta(days=6)

        if date.month == timezone.now().date().month and date.year == timezone.now().date().year: #Determina si la semana termino#
            end_week = min(end_week, timezone.now().date())

        week_entries = cls.objects.filter(user=user, createdDate__range=(start_week, end_week)).select_related('category')

        total_time = week_entries.values('category__title').annotate(total_time=Sum('duration'))
        
        days_passed = (end_week - start_week).days + 1
        for entry in total_time:
            total_seconds = entry['total_time'].total_seconds()
            entry['total_time'] = round(total_seconds / 60) # Convertir a minutos
            entry['average_time'] = round(entry['total_time'] / days_passed)  # Promedio semanal basado en días transcurridos
        return total_time
    
    @classmethod
    def monthly_stats(cls, user, date=None): #retorna promedios y totales mensuales por categoría#
        if date is None:
            date = timezone.now().date()
        else:
            date = datetime.strptime(date, '%Y-%m-%d').date()

        start_month = date.replace(day=1)
        end_month = date.replace(day=calendar.monthrange(date.year, date.month)[1])

        if date.month == timezone.now().date().month and date.year == timezone.now().date().year: #Determina si el mes termino
            end_month = min(end_month, timezone.now().date())

        month_entries = cls.objects.filter(user=user, createdDate__range=(start_month, end_month)).select_related('category')

        total_time = month_entries.values('category__title').annotate(total_time=Sum('duration'))
        
        days_passed = (end_month - start_month).days + 1

        for entry in total_time:
            total_seconds = entry['total_time'].total_seconds()
            entry['total_time'] = round(total_seconds / 60)  # Convertir a minutos
            entry['average_time'] = round(entry['total_time'] / days_passed) # Promedio mensual basado en días transcurridos

        return total_time