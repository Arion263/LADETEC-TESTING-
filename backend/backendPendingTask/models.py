from django.db import models
from django.contrib.auth.models import  BaseUserManager, AbstractBaseUser, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
    
class PendingTask(models.Model):
    user = models.ForeignKey(
        CustomUser,
        to_field='email',
        on_delete=models.CASCADE,
        related_name='pending_tasks'
    )
    title = models.CharField(max_length=100,help_text='Título de la tarea',null=True)
    description = models.TextField(blank=True,help_text='Descripción detallada de la tarea')
    STATUS_CHOICES = [('PENDING', 'Pendiente'),
                    ('IN_PROGRESS', 'En Progreso'), 
                    ('COMPLETED', 'Completada'),
                    ]
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True,blank=True,help_text='Fecha límite de la tarea')
    PRIORITY_CHOICES = [
        (1, 'Urgente'),
        (2, 'Alta'),
        (3, 'Media'),
        (4, 'Baja')
    ]
    priority = models.IntegerField(choices=PRIORITY_CHOICES,default=4)

    def __str__(self):
        return self.title
    
    def filter_by_status(self, status):
        return self.objects.filter(task_status=status)
    
    def filter_by_priority(self, priority):
        return self.objects.filter(task_priority=priority)
    
    
