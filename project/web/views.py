from rest_framework.permissions import IsAuthenticated
from .models import Theorys, Course, Practice, Questions, Answers
from .serializer import TheorySerializer, PracticeSerializer, QuestionsSerializer, AnswerSerializer, CourseSerializer, \
    UserSerializer
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class Logout(APIView):
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

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class TheoriesListView(viewsets.ModelViewSet):
    queryset = Theorys.objects.all()
    serializer_class = TheorySerializer
    lookup_field = 'theory_id'

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return self.queryset.filter(course_id=course_id)


class PracticeListView(viewsets.ModelViewSet):
    queryset = Practice.objects.all()
    serializer_class = PracticeSerializer

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return self.queryset.filter(course_id=course_id)


class QuestionListView(viewsets.ModelViewSet):
    serializer_class = QuestionsSerializer

    def get_queryset(self):
        practice_id = self.kwargs['practice']
        return Questions.objects.filter(practice=practice_id)


class AnswersListView(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer

    def get_queryset(self):
        question_id = self.kwargs['question']
        return Answers.objects.filter(question=question_id)


class TheoryListView(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

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
        theory = self.get_object()
        serializer = TheorySerializer(theory, data=request.data, partial=True)
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