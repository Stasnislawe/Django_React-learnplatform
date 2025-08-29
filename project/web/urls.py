from django.urls import path, include
from web.views import CourseListView, PracticeListView, QuestionListView, AnswersListView, TheoriesListView, Logout, RegisterView, CourseFreeDetailSerializerView
from django.conf import settings
from rest_framework_simplejwt import views as jwt_views
from rest_framework import routers
from django.conf.urls.static import static

# Роутер сам создает юрл по типу /courses || /courses/<int:pk>
# router = routers.DefaultRouter()
# router.register(r'courses', CourseListView)

# URL для вывода списка practice которая имеет связь к theory
theories = TheoriesListView.as_view({
    'get': 'list',
    'post': 'create',
})


theory_practice = PracticeListView.as_view({
    'get': 'list',
    'post': 'create',
})

# URL список question которые имеют связь к practice
practice_question = QuestionListView.as_view({
    'get': 'list',
    'post': 'create',
})

# URL список answers которые имеют связь к question
question_answers = AnswersListView.as_view({
    'get': 'list',
    'post': 'create',
})

urlpatterns = [
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    # сам роутер
    # path('', include(router.urls)),
    # юрл списка практик связанных с теорией
    path('courses/<str:free>/', CourseListView.as_view()),
    path('courses/<str:free>/<int:pk>/', CourseFreeDetailSerializerView.as_view({'get': 'retrieve'})),
    path('courses/<str:free>/<int:course_id>/practice/', theory_practice),
    path('courses/<str:free>/<int:course_id>/theories/', theories),
    path('courses/<str:free>/<int:course_id>/theories/<int:theory_id>', TheoriesListView.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy',
    })),
    # юрл конкретной практики привязанной к теории
    path('courses/<int:course_id>/practice/<int:pk>', PracticeListView.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy',
    })),
    # юрл списка вопросов привязанных к практике
    path('courses/<int:course_id>/practice/<int:practice>/question', practice_question),
    # юрл конкретного вопроса привязанного к практике
    path('courses/<int:course_id>/practice/<int:practice>/question/<int:pk>', QuestionListView.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy',
    })),
    # юрл списка ответов связанных с вопросом
    path('courses/<int:theory_url>/practice/<int:practice>/question/<int:question>/answers', question_answers),
    # юрл конкретного ответа связанного с вопросом
    path('courses/<int:theory_url>/practice/<int:practice>/question/<int:question>/answers/<int:pk>', AnswersListView.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy',
    })),
]