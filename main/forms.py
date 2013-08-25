# -*- coding: utf-8 -*-
'''
    Autor: Marcos Aguayo
    Fecha de inicio: 16/04/2013
    Fecha de finalización: 20/04/2013
    Objetivo: Modelos de algunos formularios de la aplicación.
'''

from django import forms
from main.models import Usuario, Cancion, Comentarios
from django.forms import CharField, Form, PasswordInput

class UsuarioForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class' : ''}))
    class Meta:
        model = Usuario
        fields = ('nombre','email', 'password')



class EditarPerfil(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class' : ''}))
    class Meta:
    	model = Usuario
        fields = ('nombre', 'email', 'password', 'pais', 'biografia')



class UploadFileForm(forms.Form):
    file  = forms.FileField()



class UploadSong(forms.Form):
    class Meta:
        model = Cancion
        fields = ('cancion')



class InfoCancion(forms.Form):
    class Meta:
        model = Cancion
        fields = ('nombre', 'genero')