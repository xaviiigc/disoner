# -*- coding: utf-8 -*-
'''
    Autor: Marcos Aguayo
    Fecha de inicio: 15/04/2013
    Fecha de finalización: 15/04/2013
    Objetivo: Clase para hacer la autentificación de usuarios.
'''

from django.db import models
from django.conf import settings
from main.models import *

class Autentificacion(object):
    def authenticate(self, email=None, password=None):
         try:
             o = Usuario.objects.get(email=email, password=password)
         except Usuario.DoesNotExist:
                return None
         return Usuario.objects.get(email=o.email)

    def get_user(self, user_id):
        try:
            return Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            return None