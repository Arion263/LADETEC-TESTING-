from rest_framework import serializers
from .models import PendingTask, CustomUser

class PendingTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingTask
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'


