from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import TimeLogSerializer
from .models import TimeLog
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta, datetime
from django.utils import timezone
import calendar
from rest_framework_simplejwt.tokens import RefreshToken


class LogTimeView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TimeLogSerializer
    def get_queryset(self):
        queryset = TimeLog.objects.filter(user=self.request.user)
        today = timezone.now().date()
        filter = self.request.query_params.get('filter')
        if filter == 'today':
            queryset = queryset.filter(createdDate__year=today.year,
                createdDate__month=today.month,
                createdDate__day=today.day
            )
        return  queryset
class SingleLogTimeView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimeLog.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = TimeLogSerializer
    lookup_field = 'id'

class Stats(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        date = request.query_params.get('date')
        filter = request.query_params.get('filter')
        time_period = request.query_params.get('time_period')
        if filter == 'daily':
            stats = TimeLog.daily_stats(user, date, time_period)
        elif filter == 'weekly':
            stats = TimeLog.weekly_stats(user, date)
        elif filter == 'monthly':
            stats = TimeLog.monthly_stats(user, date)
        else:
            return Response({'error': 'Invalid filter type'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(stats, status = status.HTTP_200_OK)
    
class LogoutView(APIView):
    def post(self, request):
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
        return Response("Success")