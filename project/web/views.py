from rest_framework.permissions import IsAuthenticated
from .models import Theorys, Course, Practice, Questions, Answers
from .serializer import TheorySerializer, PracticeSerializer, QuestionsSerializer, AnswerSerializer, CourseSerializer, \
    UserSerializer
from rest_framework import status, viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count


class Logout(APIView):
    """Вью выхода из личного кабинета"""
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    """Вью регистрации"""
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class TheoriesListView(viewsets.ModelViewSet):
    """Вью списка теорий"""
    # permission_classes = (IsAuthenticated, )
    queryset = Theorys.objects.all()
    serializer_class = TheorySerializer
    lookup_field = 'theory_id'

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return self.queryset.filter(course_id=course_id)


class PracticeListView(viewsets.ModelViewSet):
    """Вью списка практики"""
    serializer_class = PracticeSerializer

    def get_queryset(self):
        course_id = self.kwargs['course_id']

        return Practice.objects.filter(
            course_id=course_id
        ).annotate(
            questions_count=Count('questions')
        )


class QuestionListView(viewsets.ModelViewSet):
    """Вью списка вопросов"""
    serializer_class = QuestionsSerializer

    def get_queryset(self):
        practice_id = self.kwargs['practice']
        return Questions.objects.filter(practice=practice_id)


class AnswersListView(viewsets.ModelViewSet):
    """Вью списка ответов"""
    serializer_class = AnswerSerializer

    def get_queryset(self):
        question_id = self.kwargs['question']
        return Answers.objects.filter(question=question_id)


class CourseFreeDetailSerializerView(viewsets.ModelViewSet):
    """Вью списка деталей бесплатных курсов"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def retrieve(self, request, *args, **kwargs):
        free_param = self.kwargs.get('free')
        course = self.get_object()

        if free_param == 'True' and not course.free:
            return Response({"detail": 'Курс не доступен'}, status=status.HTTP_404_NOT_FOUND)
        elif free_param == 'False' and course.free:
            return Response({"detail": 'Курс доступен бесплатно'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(course)
        return Response(serializer.data)


class CourseListView(generics.ListAPIView):
    """Вью списка курсов"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_queryset(self):
        free_param = self.kwargs.get('free', None)

        if free_param == 'True':
            return Course.objects.filter(free=True)
        elif free_param == 'False':
            return Course.objects.filter(free=False)
        else:
            return Course.objects.all()

    def create(self, request, *args, **kwargs):
        if self.action == 'create':
            serializer = CourseSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        'status': status.HTTP_200_OK,
                        'message': 'Успех!',
                        'id': serializer.instance.pk,
                    }
                )

            if status.HTTP_400_BAD_REQUEST:
                return Response(
                    {
                        'status': status.HTTP_400_BAD_REQUEST,
                        'message': 'Некорректный запрос',
                        'id': None,
                    }
                )

            if status.HTTP_500_INTERNAL_SERVER_ERROR:
                return Response(
                    {
                        'status': status.HTTP_500_INTERNAL_SERVER_ERROR,
                        'message': 'Ошибка при выполнении операции',
                        'id': None,
                    }
                )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        book = self.get_object()
        serializer = CourseSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'state': '1',
                    'message': 'Изменения в записи внесены'
                }
            )
        else:
            return Response(
                {
                    'state': '0',
                    'message': serializer.errors
                }
            )
