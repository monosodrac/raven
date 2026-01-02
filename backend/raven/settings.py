"""
Django settings for raven project.
"""

import os
from pathlib import Path
from datetime import timedelta

from corsheaders.defaults import default_headers

# --------------------------------------------------------------
# 📌 BASE DIR
# --------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# --------------------------------------------------------------
# 🔐 SECURITY
# --------------------------------------------------------------
SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-default-key")
DEBUG = int(os.environ.get("DEBUG", 1))

ALLOWED_HOSTS = [
    "monosodrac.pythonanywhere.com",
    "twitter-theta-henna.vercel.app",
    "127.0.0.1",
    "localhost",
]

# --------------------------------------------------------------
# 📦 APPS
# --------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Terceiros
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "django_extensions",

    # Apps
    "tweets",
    "users",
]

# --------------------------------------------------------------
# ⚙️ MIDDLEWARE
# --------------------------------------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# --------------------------------------------------------------
# 🌐 CORS / CSRF
# --------------------------------------------------------------

CORS_ALLOWED_ORIGINS = [
    "https://twitter-theta-henna.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = list(default_headers) + [
    "authorization",
    "content-type",
    "x-csrftoken",
]

CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
]

CSRF_TRUSTED_ORIGINS = [
    "https://twitter-theta-henna.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# --------------------------------------------------------------
# 🔗 ROOT / TEMPLATES / WSGI
# --------------------------------------------------------------
ROOT_URLCONF = "raven.urls"

AUTH_USER_MODEL = 'users.User'

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "raven", "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "raven.wsgi.application"

# ==============================================================
# 🗄️ BANCO DE DADOS
# ==============================================================

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("SQL_DATABASE", BASE_DIR / "db.sqlite3"),
        "USER": os.environ.get("SQL_USER", "user"),
        "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
    }
}

# ==============================================================
# 🔐 VALIDAÇÃO DE SENHA
# ==============================================================

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ==============================================================
# 🌎 LOCALIZAÇÃO
# ==============================================================

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ==============================================================
# 📁 ARQUIVOS ESTÁTICOS E MÍDIA
# ==============================================================

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ==============================================================
# ⚙️ REST FRAMEWORK / JWT
# ==============================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.BasicAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ==============================================================
# 🧠 OUTRAS CONFIGURAÇÕES
# ==============================================================

INTERNAL_IPS = ["127.0.0.1"]
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
