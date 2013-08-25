# -*- coding: utf-8 -*-
'''
    Autor: Marcos Aguayo y Xavi Güell
    Fecha de inicio: 10/04/2013
    Fecha de finalización: 01/06/2013
    Objetivo: Fichero que contiene los modelos. 
'''

from datetime import date, timedelta
from django.db import models
from main.extra import ContentTypeRestrictedFileField
import datetime
import os
from django.conf import settings
from django.db.models import Q, Sum, Avg



class Cuenta(models.Model):
	tipo = models.CharField(blank=False, max_length=100, unique=True)
	almacenamiento = models.BigIntegerField()
	precio = models.IntegerField()






class Usuario(models.Model):
	tipo_cuenta = models.ForeignKey(Cuenta, to_field='tipo', related_name="tipo_cuenta", default='free')
	nombre = models.CharField(blank=False, max_length=100)
	slug = models.CharField(blank=False, max_length=100, unique=True)
	email = models.EmailField(unique=True)
	password = models.CharField(blank=False, max_length=200)
	imagen = models.ImageField(upload_to='/fotos_perfil/', blank=True, default='default_user.jpg')
	fondo = models.ImageField(upload_to='/fondos_perfil/', blank=True, default='fondo2.jpg')
	pais = models.CharField(blank=False, max_length=200)
	biografia = models.TextField(max_length=175, default='Este es tu perfil, pon aquí tu estado. ')
	gustos = models.CharField(blank=False, max_length=200)
	desde = models.DateTimeField(auto_now_add=True)
	codigo = models.CharField(max_length=200)
	validez = models.DateTimeField(auto_now_add=True)
	confirmado = models.BooleanField()


	def __init__(self, *args, **kwargs):
		super(Usuario, self).__init__(*args, **kwargs)
		self.hoy = date.today()
		self.mis_canciones = Cancion.objects.all().filter(autor=self.id)

	def __unicode__(self):
		return "%s" % self.nombre

	def getId(self):
		return "%s" % self.id

	'''
	Métodos que nos devuelven información sobre las reproducciones de los usuarios.
	'''

	def getReproducciones(self):
		return Reproducciones.objects.filter(cancion__in=self.mis_canciones).count()

	def getReproduccionesHoy(self):
		return Reproducciones.objects.filter(cancion__in=self.mis_canciones, fecha__year=self.hoy.year, fecha__month=self.hoy.month, fecha__day=self.hoy.day).count()
		
	def getReproduccionesMes(self):
		return Reproducciones.objects.filter(cancion__in=self.mis_canciones, fecha__year=self.hoy.year, fecha__month=self.hoy.month).count()


	'''
	Métodos que nos devuelven información sobre los puntos de un usuario.
	'''

	def getPuntos(self):
		puntos = Puntos.objects.filter(perfil=self.id).aggregate(Sum('puntos'))['puntos__sum']
		if puntos is None: puntos = 0
		return puntos

	def getPuntosHoy(self):
		puntos = Puntos.objects.filter(perfil=self.id, fecha__year=self.hoy.year, 
			fecha__month=self.hoy.month, fecha__day=self.hoy.day).aggregate(Sum('puntos'))['puntos__sum']
		if puntos is None: puntos = 0
		return puntos

	def getPuntosMes(self):
		puntos = Puntos.objects.filter(perfil=self.id, fecha__year=self.hoy.year, 
			fecha__month=self.hoy.month).aggregate(Sum('puntos'))['puntos__sum']
		if puntos is None: puntos = 0
		return puntos

	def getPuntosMedia(self):
		puntos_media = Puntos.objects.filter(perfil=self.id).aggregate(Avg('puntos'))['puntos__avg']
		if puntos_media is None: puntos_media = 0
		if puntos_media != 0: puntos_media = "%.1f" % puntos_media
		return puntos_media


	'''
	Métodos que nos devuelven información sobre las visitas, las de este mes, las de hoy y totales.
	'''

	def getVisitas(self):
		return VisitasPerfil.objects.filter(perfil=self.id).count()

	def getVisitasHoy(self):
		return VisitasPerfil.objects.filter(perfil=self.id, fecha__year=self.hoy.year, 
			fecha__month=self.hoy.month, fecha__day=self.hoy.day).count()

	def getVisitasMes(self):
		return VisitasPerfil.objects.filter(perfil=self.id, fecha__year=self.hoy.year, 
			fecha__month=self.hoy.month).count()


	'''
	Métodos que nos dan información sobre los likes, cuantos se han hecho hoy, este mes y siempre
	'''

	def getLikes(self):
		mis_canciones = Cancion.objects.filter(autor=self.id)
		return MeGustaCancion.objects.filter(cancion__in=mis_canciones).count()

	def getLikesHoy(self):
		return MeGustaCancion.objects.filter(cancion__in=self.mis_canciones, 
			fecha__year=self.hoy.year, fecha__month=self.hoy.month, fecha__day=self.hoy.day).count()

	def getLikesMes(self):
		return MeGustaCancion.objects.filter(cancion__in=self.mis_canciones, 
			fecha__year=self.hoy.year, fecha__month=self.hoy.month).count()


	'''
	Métodos encargados de devolver los totales. El total de amigos de un usuario, el total de fans,
	y el numero de canciones que tiene.
	'''

	def getTotalAmigos(self):
		return Amigo.objects.all().filter(usuario=self.id).count()

	def getTotalFans(self):
		return Amigo.objects.all().filter(amigo=self.id).count()

	def getTotalCanciones(self):
		return Cancion.objects.all().filter(autor=self.id, subida=1).count()


	'''
	Método que devuelve el numero de notificaciones que tiene un usuario.
	'''
	def getNumNotificaciones(self):
		return Notificacion.objects.all().filter(receptor=self.id, leido=0).count()


	'''
	Función que calcula el almacenamiento restante, el total de segundos que le quedan al usuario
	'''
	def almacenamientoRestante(self):
		try:
			espacio_consumido = Cancion.objects.filter(autor=self.id, subida=1).aggregate(Sum('segundos'))['segundos__sum']
		except ObjectDoesNotExist:
			espacio_consumido = 0

		if espacio_consumido <= 0: 
			espacio_consumido = 0
		return self.tipo_cuenta.almacenamiento - espacio_consumido;


	'''
	Método que calcula el porcentaje que lleva gastado el usuario
	'''
	def porcentajeAlmacenamiento(usuario):
		try:
			espacio_consumido = Cancion.objects.filter(autor=usuario, subida=1).aggregate(Sum('segundos'))['segundos__sum']
		except ObjectDoesNotExist:
			espacio_consumido = 1

		if espacio_consumido <= 0: 
			porcentaje = 0
		else: 
			porcentaje = espacio_consumido * 100 / usuario.tipo_cuenta.almacenamiento
		return porcentaje








class Amigo(models.Model):
	usuario = models.ForeignKey(Usuario, to_field = 'id', related_name="id_usuario")
	amigo = models.ForeignKey(Usuario, to_field = 'id', related_name="id_amigo")






class Cancion(models.Model):
	nombre = models.CharField(blank=True, max_length=50)
	autor = models.ForeignKey(Usuario, to_field='id', related_name="id_usuario2")
	cancion = models.FileField(upload_to='/canciones/')
	genero = models.CharField(blank=True, max_length=100)
	descripcion = models.CharField(max_length=220)
	descargable = models.BooleanField()
	imagen = models.ImageField(upload_to='/fotos_canciones/', blank=True, default='foto-cancion.png')
	segundos = models.BigIntegerField(default='0')
	fecha_subida = models.DateTimeField(auto_now_add=True)
	subida = models.BooleanField()

	def __unicode__(self):
		return "%s" % self.id

	def getId(self):
		return self.id

	def getLikes(self):
		return MeGustaCancion.objects.filter(cancion=self.id).count()
		 
	def getComentarios(self):
		return Comentarios.objects.filter(cancion=self.id).count()

	def getCompartida(self):
		return CancionesCompartidas.objects.filter(cancion=self.id).count()

	def getNumReproducciones(self):
		return Reproducciones.objects.filter(cancion=self.id).count()
		 
	def getIdAutor(self):
		cancion = Cancion.objects.get(pk=self.getId)
		temp = cancion.autor
		usuario = Usuario.objects.get(nombre=temp)
		return usuario.id

	def delete(self, *args, **kwargs):
		storage, path = self.cancion.storage, self.cancion.path
		super(Cancion, self).delete(*args, **kwargs)
		ruta_song = "%s%s" % (settings.RUTA_CANCIONES, self.cancion)
		ruta_imagen = "%s%s" % (settings.RUTA_FOTOS_CANCIONES, self.imagen)
		os.remove(ruta_song)
		if self.imagen != 'foto-cancion.png': os.remove(ruta_imagen)







class MeGustaCancion(models.Model):
	usuario = models.ForeignKey(Usuario, to_field='id', related_name="usuario_megusta")
	cancion = models.ForeignKey(Cancion, to_field='id', related_name="cancion_megusta")
	fecha = models.DateTimeField(auto_now_add=True)







class Comentarios(models.Model):
	cancion = models.ForeignKey(Cancion, to_field='id', related_name="id_cancion2")
	usuario =  models.ForeignKey(Usuario, to_field='id', related_name="id_usuario5")
	comentario = models.CharField(blank=False, max_length=220)
	fecha = models.DateTimeField(auto_now_add=True)
	
	def getId(self):
		return self.id

	def getIdCancion(self):
		temp = "%s" % self.cancion
		cancion = Cancion.objects.get(id=temp)
		return cancion.id






class Notificacion(models.Model):
	receptor =  models.ForeignKey(Usuario, to_field='id', related_name="receptor")
	emisor =  models.ForeignKey(Usuario, to_field='id', related_name="emisor")
	notificacion = models.CharField(blank=False, max_length=220)
	sitio = models.CharField(blank=False, max_length=220)
	leido = models.BooleanField()







class ListaReproduccion(models.Model):
	usuario = models.ForeignKey(Usuario, to_field='id', related_name="id_usuario3")
	nombre = models.CharField(blank=False, max_length=100)
	publica = models.BooleanField()






class CancionLista(models.Model):
	lista = models.ForeignKey(ListaReproduccion, to_field='id', related_name="id_lista")
	cancion = models.ForeignKey(Cancion, to_field='id', related_name="id_cancion3")

	def getNombreCancion(self):
		return "%s" % (self.cancion.nombre)






class Mensaje(models.Model):
	usuario = models.ForeignKey(Usuario, to_field='id', related_name="id_usuario6")
	destinatario = models.ForeignKey(Usuario, to_field='id', related_name="id_amigo2")
	mensaje = models.CharField(blank=False, max_length=220)
	fecha = models.DateTimeField(auto_now_add=True)

	def getIdUsuario(self):
		user = Usuario.objects.get(nombre=self.usuario)
		return user.id

	def getNombreUsuario(self):
		user = Usuario.objects.get(nombre=self.usuario)
		return user.nombre

	def getFotoUsuario(self):
		user = Usuario.objects.get(nombre=self.usuario)
		return user.imagen







class Reproducciones(models.Model):
	usuario = models.ForeignKey(Usuario, to_field='id', related_name="usuario_reproducciones")
	cancion = models.ForeignKey(Cancion, to_field='id', related_name="cancion_reproducciones")
	fecha = models.DateTimeField(auto_now_add=True)






class VisitasPerfil(models.Model):
	usuario = models.ForeignKey(Usuario, to_field='id', related_name="usuario_visitas")
	perfil = models.ForeignKey(Usuario, to_field='id', related_name="perfil_visitas")
	fecha = models.DateTimeField(auto_now_add=True)






class Puntos(models.Model):
	usuario = models.ForeignKey(Usuario, to_field='id', related_name="usuario_puntos")
	perfil = models.ForeignKey(Usuario, to_field='id', related_name="perfil_puntos")
	puntos = models.IntegerField()
	fecha = models.DateTimeField(auto_now_add=True)






class Privacidad(models.Model):
	usuario = models.ForeignKey(Usuario, to_field='id', related_name="usuario_privacidad")
	comentario = models.BooleanField(default=1)
	mensaje = models.BooleanField(default=1)
	compartir = models.BooleanField(default=1)
	amistad = models.BooleanField(default=0)
	likes = models.BooleanField(default=0)





class CancionesCompartidas(models.Model):
	usuario = models.ForeignKey(Usuario, to_field='id', related_name="usuario_compartidas")
	cancion = models.ForeignKey(Cancion, to_field='id', related_name="cancion_compartidas")
	fecha = models.DateTimeField(auto_now_add=True)






class Paypal(models.Model):
	protection_eligibility = models.CharField(max_length=150)
	last_name = models.CharField(max_length=220)
	txn_id = models.CharField(max_length=200)
	receiver_email = models.CharField(max_length=220)
	payment_status = models.CharField(max_length=100)
	payment_gross = models.CharField(max_length=50)
	tax = models.CharField(max_length=50)
	residence_country = models.CharField(max_length=25)
	cmd = models.CharField(max_length=100)
	address_state = models.CharField(max_length=100)
	payer_status = models.CharField(max_length=100)
	txn_type = models.CharField(max_length=100)
	address_street = models.CharField(max_length=220)
	handling_amount = models.CharField(max_length=50)
	payment_date = models.CharField(max_length=220)
	first_name = models.CharField(max_length=220)
	item_name = models.CharField(max_length=50)
	address_country = models.CharField(max_length=170)
	charset = models.CharField(max_length=100)
	custom = models.CharField(max_length=220)
	notify_version = models.CharField(max_length=10)
	address_name = models.CharField(max_length=220)
	test_ipn = models.CharField(max_length=10)
	item_number = models.CharField(max_length=150)
	receiver_id = models.CharField(max_length=150)
	transaction_subject = models.CharField(max_length=100)
	business = models.CharField(max_length=220)
	payer_id = models.CharField(max_length=200)
	verify_sign = models.CharField(max_length=220)
	address_zip = models.CharField(max_length=10)
	payment_fee = models.CharField(max_length=10)
	address_country_code = models.CharField(max_length=5)
	address_city = models.CharField(max_length=220)
	address_status = models.CharField(max_length=100)
	mc_fee = models.CharField(max_length=10)
	mc_currency = models.CharField(max_length=10)
	shipping = models.CharField(max_length=10)
	payer_email = models.CharField(max_length=220)
	payment_type = models.CharField(max_length=100)
	mc_gross = models.CharField(max_length=220)
	ipn_track_id = models.CharField(max_length=150)
	quantity = models.CharField(max_length=10)