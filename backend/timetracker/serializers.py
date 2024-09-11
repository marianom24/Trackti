from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, TimeLog

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = 'username'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','title']

class TimeLogSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field='username',
        queryset=User.objects.all()
    )
    category = serializers.SlugRelatedField(
        queryset=Category.objects.all(),
        slug_field='title'
    )

    class Meta:
        model = TimeLog
        fields = '__all__'