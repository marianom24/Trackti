from django.contrib import admin
from .models import Category, TimeLog
# Register your models here.
admin.site.register(Category)
# admin.site.register(TimeLog)

@admin.register(TimeLog)
class TimeLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'createdDate', 'category', 'duration')