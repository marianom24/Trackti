from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, TimeLog
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.utils import datetime_to_epoch
from datetime import timedelta

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)        
        if user.groups.filter(name='Demousers').exists():
            refresh_lifetime = timedelta(minutes=2)
        else:
            refresh_lifetime = timedelta(days=7)
        token.payload['exp'] = datetime_to_epoch(token.current_time + refresh_lifetime)
        
        return token

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'password', 'email')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use")
        return value

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