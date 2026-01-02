from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'bio', 'avatar', 'is_active', 'is_staff')
    
    search_fields = ('email', 'first_name', 'last_name')
    
    list_filter = ('is_active', 'is_staff')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações pessoais', {'fields': ('first_name', 'last_name', 'bio', 'avatar')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {'fields': ('email', 'password', 'password_confirmation')}),
        ('Informações pessoais', {'fields': ('first_name', 'last_name', 'bio', 'avatar')}),
        ('Permissões', {'fields': ('is_active', 'is_staff')}),
    )
