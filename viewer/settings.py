import os
from datetime import timedelta

import dj_database_url
from decouple import config


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='change me to a real secret key')

ebug turned on in production!
, cast=bool)

ALLOWED_HOSTS = ['*']

SITE_URL = config('SITE_URL', default='http://localhost:8000')
STATIC_ROOT = config('STATIC_ROOT', default=os.path.join(BASE_DIR,
                                                         'staticfiles'))
STATIC_URL = config('STATIC_URL', '/static/')

LOGIN_URL = '/accounts/login/'

# Application definition

INSTALLED_APPS = [
    # Django
    'django.contrib.admin.apps.SimpleAdminConfig',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',


    # 3rd party
    'dockerflow.django',

    # Project
    'viewer',
    'viewer.api',
]

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'dockerflow.django.middleware.DockerflowMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',eware',
    'django.contrib.auth.middleware.AuthenticationMiddlewa
        'rest_framework.renderers.JSONRenderer',
    ),

    'DEFAULT_PERelBackend',
)

# Keys created from https://console.developers.google.com/apis/credentials
GOOGLE_AUTH_KEY

# Sentry set up.('SENTRY_DSN', default=None)
if SENTRY_D
    ]

    

    'formatters': {
        'json': {
            '()': 'dockerflow.logging.JsonLogFormatter',

        },
        'verbose': {

        },
    },
    'handlers': {

            'level'
            
            
        # },
    }
}
