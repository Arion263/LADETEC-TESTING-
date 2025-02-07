from rest_framework import serializers
from .models import PendingTask, CustomUser

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingTask
        fields = ['id', 'title', 'description', 'status', 'priority', 'created_at', 'due_date', 'user']
        extra_kwargs = {
            'user': {'required': True}
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = instance.user.email
        return representation 