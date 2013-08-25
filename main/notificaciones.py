# -*- coding: utf-8 -*-
'''
    Autor: Marcos Aguayo
    Fecha de inicio: 19/05/2013
    Fecha de finalización: 28/05/2013
    Objetivo: Clase para las notificaciones.
'''

from main.funciones import *
from main.models import *
from django.conf import settings


class Notificaciones:
    'Clase para enviar notificaciones'

    comentario = 0
    mensaje = 0
    compartir = 0
    amistad = 0
    likes = 0

    def __init__(self, usuario, emisor=None):
        self.emisor = emisor
        self.usuario = usuario
        self.comentario = Privacidad.objects.get(usuario=usuario).comentario
        self.mensaje = Privacidad.objects.get(usuario=usuario).mensaje
        self.compartir = Privacidad.objects.get(usuario=usuario).compartir
        self.amistad = Privacidad.objects.get(usuario=usuario).amistad
        self.likes = Privacidad.objects.get(usuario=usuario).likes

    def nuevoComentario(self, cancion, texto):
        url = 'http://disoner.com/cancion/%s' % cancion.id
        texto_pantalla = "%s..." % texto[:84] 
        n = Notificacion(receptor=self.usuario, emisor=self.emisor, notificacion=texto_pantalla, sitio=url)
        n.save()

        if self.comentario:
            diccionario = {"nombre": self.emisor.nombre, "sitio": url, "texto": texto, "imagen": self.emisor.imagen}
            self.sendEmail("Nuevo comentario en tus canciones", diccionario, "mailing/alerta-comentario.html")


    def nuevoMensaje(self, texto):
        url = ''
        texto_pantalla = "%s..." % texto[:84] 
        n = Notificacion(receptor=self.usuario, emisor=self.emisor, notificacion=texto_pantalla, sitio=url)
        n.save()

        if self.mensaje:
            diccionario = {"nombre": self.emisor.nombre, "texto": texto, "imagen": self.emisor.imagen}
            self.sendEmail("Nuevo mensaje directo", diccionario, "mailing/alerta-mensaje.html")


    def nuevoAmigo(self):
        url = 'http://disoner.com/perfil/%s' % self.emisor.slug
        texto = u'%s ahora es tu amigo.' % self.emisor.nombre
        n = Notificacion(receptor=self.usuario, emisor=self.emisor, notificacion=texto, sitio=url)
        n.save()

        if self.amistad:
            diccionario = {"nombre": self.emisor.nombre, "imagen": self.emisor.imagen}
            self.sendEmail("Tienes un nuevo seguidor", diccionario, "mailing/alerta-amigo.html")


    def nuevoLike(self, cancion):
        url = 'http://disoner.com/cancion/%s' % cancion.id
        texto =  u'A %s le gusta tu canción "%s" ' % (self.emisor.nombre, cancion.nombre)
        n = Notificacion(receptor=self.usuario, emisor=self.emisor, notificacion=texto, sitio=url)
        n.save()

        if self.likes:
            asunto = 'A %s le ha gustado una de tus canciones' % self.emisor.nombre
            diccionario = {"nombre": self.emisor.nombre, "texto": texto, "imagen": self.emisor.imagen}
            self.sendEmail(asunto, diccionario, "mailing/alerta-like.html")


    def registro(self):
       diccionario = {"nombre": self.usuario.nombre, "confirmar_email": self.usuario.codigo}
       self.sendEmail("Bienvenido a Disoner", diccionario, "mailing/alerta-registro.html")


    def recuperarPass(self):
        diccionario = {"nombre": self.usuario.nombre, "confirmar_email": self.usuario.codigo}
        self.sendEmail("Recupearar tu contraseña", diccionario, "mailing/recuperar-password.html")


    def sendEmail(self, subject, diccionario, template):
        from_email = settings.EMAIL_MAILING
        to = self.usuario.email

        t = loader.get_template(template)
        c = Context(diccionario)
        html_content = t.render(c)

        msg = EmailMessage(subject, html_content, from_email, [to])
        msg.content_subtype = "html" 
        msg.send()