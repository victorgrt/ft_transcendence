"""
Django settings for django_project project.

Generated by 'django-admin startproject' using Django 4.2.13.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from decouple import config
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-bsssz*0u%)7*#g3ir7a04w-c=%l*y-p&_fc^7%2xed%a8#g10a'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    #SESSION COOKIES
    'django.contrib.sessions',
    
    'django.contrib.admin',
    'django.contrib.auth',
    # 'django.contrib.authchat',
    'django.contrib.contenttypes',
    # 'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'pages',
    'chat',
    'game',
    'channels'
]

WSGI_APPLICATION = 'django_project.wsgi.application'

ASGI_APPLICATION = 'django_project.asgi.application'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

# SECRET_KEY = [
#     'django-admin startproject'  # Generate a new secret key 
# ]

SESSION_ENGINE = 'django.contrib.sessions.backends.db'

#'django.contrib.sessions.backends.cache'

MIDDLEWARE = [
    # SESSION COOKIES
    'django.contrib.sessions.middleware.SessionMiddleware',
    
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'django_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]



# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        #Update database
        #python manage.py makemigrations
        #python manage.py migrate
        #'ENGINE':   'django.db.backends.postgresql',
        'ENGINE':   'django.db.backends.sqlite3',
        'NAME':     config('DB_ACC_NAME'),
        'USER':     config('DB_ACC_ADMIN'),
        'PASSWORD': config('DB_ACC_PSWD'),
        'HOST':     config('DB_ACC_HOST'),
        'PORT':     config('DB_ACC_PORT'),
    }

}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     )
# }
# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

APPEND_SLASH = False


# STATIC FILES CONFIGURATION

STATIC_URL = '/staticfiles/'

STATIC_ROOT = 'static'  # A directory named 'staticfiles' at your project's root

# Django automatically looks for a 'static' folder in each of your INSTALLED_APPS
STATICFILES_DIRS = [
    # If you have any global static directories, list them here
    BASE_DIR / 'staticfiles',
]

# Adding WhiteNoise for serving static files more efficiently
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)