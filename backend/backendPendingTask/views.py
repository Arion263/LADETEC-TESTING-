from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from .models import PendingTask, CustomUser
from .serializer import PendingTaskSerializer, CustomUserSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import ModelViewSet

# Create your views here.
class PendingTaskViewSet(viewsets.ModelViewSet):
    queryset = PendingTask.objects.all()
    serializer_class = PendingTaskSerializer

    def get_queryset(self):
        queryset = PendingTask.objects.all()
        
        
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        priority = self.request.query_params.get('priority', None)
        if priority:
            queryset = queryset.filter(priority=priority)

        return queryset

    @action(detail=False, methods=['get'])
    def by_status(self, request):
        status = request.query_params.get('status')
        tasks = self.queryset.filter(status=status)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
    @action(detail=False, methods=['get'])
    def by_priority(self, request):
        priority = request.query_params.get('priority')
        tasks = self.queryset.filter(priority=priority)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
  

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    #def get_permissions(self):
    #    if self.action in ['create', 'update', 'partial_update', 'destroy']:
    #        permission_classes = [IsAdminUser]
    #    else:
    #        permission_classes = [IsAuthenticated]
    #    return [permission() for permission in permission_classes]



    