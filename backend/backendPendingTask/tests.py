from django.test import TestCase
from django.utils import timezone
from .models import PendingTask, CustomUser

class TaskTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            email='test@example.com',
            first_name='Test',
            last_name='User'
        )
        
        self.task1 = PendingTask.objects.create(
            title='Tarea 1',
            description='Descripción 1',
            status='IN_PROGRESS',
            priority=1,
            user=self.user
        )
        
        self.task2 = PendingTask.objects.create(
            title='Tarea 2',
            description='Descripción 2',
            status='PENDING',
            priority=2,
            user=self.user
        )

    def test_task_creation(self):
        self.assertEqual(self.task1.title, 'Tarea 1')
        self.assertEqual(self.task1.status, 'IN_PROGRESS')
        self.assertEqual(self.task1.user, self.user)

    def test_task_str_representation(self):
        self.assertEqual(str(self.task1), 'Tarea 1')

    def test_filter_by_status(self):
        in_progress = PendingTask.objects.filter(status='IN_PROGRESS')
        pending = PendingTask.objects.filter(status='PENDING')
        
        self.assertEqual(in_progress.count(), 1)
        self.assertEqual(pending.count(), 1)

    def test_filter_by_priority(self):
        high_priority = PendingTask.objects.filter(priority=1)
        medium_priority = PendingTask.objects.filter(priority=2)
        
        self.assertEqual(high_priority.count(), 1)
        self.assertEqual(medium_priority.count(), 1)

    def test_user_tasks_relationship(self):
        user_tasks = self.user.pending_tasks.all()
        self.assertEqual(user_tasks.count(), 2)
