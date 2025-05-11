from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []


class Course(models.Model):
    title_theory = models.CharField(max_length=120, verbose_name='Главное название теории')
    image_title = models.ImageField(upload_to='images_title_theory/', blank=True, verbose_name='Изображения шапки теории')
    about = models.TextField(verbose_name='Чему научитесь')
    free = models.BooleanField(default=False, verbose_name='Бесплатный курс')


class Theorys(models.Model):
    title_theory = models.CharField(max_length=120, verbose_name='Название теории')
    text_theory = models.TextField(verbose_name='Текст теории')
    image_theory = models.ImageField(upload_to='images_title_theory/', blank=True, verbose_name='Изображение теории')
    about_theory = models.TextField(verbose_name='Чему научитесь')
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    theory_id = models.IntegerField(verbose_name='Id теории')


class TheoryImages(models.Model):
    theory = models.ForeignKey(Course, on_delete=models.CASCADE)
    images = models.ImageField(upload_to='images_theory/', blank=True, verbose_name='Изображения теории')


class Practice(models.Model):
    title = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True)
    questions_count = models.IntegerField(default=1)
    course_id = models.ManyToManyField(Course, related_name='practice_theory', verbose_name='Теории для изучения')


class Questions(models.Model):
    question = models.CharField(max_length=256, verbose_name='Вопрос')
    image_question = models.ImageField(upload_to='images_question/', blank=True, verbose_name='Изображение вопросоа')
    answer = models.CharField(max_length=256, verbose_name='Ответ')
    just_resp = models.TextField(verbose_name='Обоснование ответа')
    practice = models.ManyToManyField(Practice, related_name='questions_practice', verbose_name='Вопросы практики')


class Answers(models.Model):
    question_str = models.CharField(max_length=256, verbose_name='Ответ')
    question = models.ForeignKey(Questions, on_delete=models.CASCADE, related_name='answer_question', verbose_name='Ответ на вопрос')




