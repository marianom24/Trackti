from django.urls import path
from . import views

urlpatterns = [
    path('time-entries', views.LogTimeView.as_view()),
    path('time-entries/<int:id>', views.SingleLogTimeView.as_view()),
    path('stats', views.Stats.as_view())
]


