"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from web.views import TheoryListView, PracticeListView, QuestionListView, AnswersListView, TheoriesListView, Logout, RegisterView
from django.conf import settings
from rest_framework_simplejwt import views as jwt_views
from rest_framework import routers
from django.conf.urls.static import static

# Роутер сам создает юрл по типу /courses || /courses/<int:pk>
router = routers.DefaultRouter()
router.register(r'courses', TheoryListView)

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
    path('admin/', admin.site.urls),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    # сам роутер
    path('', include(router.urls)),
    # юрл списка практик связанных с теорией
    path('courses/<int:course_id>/practice/', theory_practice),
    path('courses/<int:course_id>/theories/', theories),
    path('courses/<int:course_id>/theories/<int:theory_id>', TheoriesListView.as_view({
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

# Подключение отображения медии
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
