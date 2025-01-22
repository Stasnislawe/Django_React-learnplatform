from rest_framework import serializers
from .models import Course, Theorys, Practice, Questions, Answers, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'title_theory', 'image_title', 'about')


class TheorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Theorys
        fields = ('id', 'title_theory', 'text_theory', 'about_theory', 'image_theory', 'course_id', 'theory_id')


class PracticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Practice
        fields = ('id', 'title', 'description', 'questions_count', 'course_id')


class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields = ('id', 'question', 'image_question',
                  'answer', 'just_resp', 'practice')


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answers
        fields = ('id', 'question_str', 'question')