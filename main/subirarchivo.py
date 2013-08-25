# -*- coding: utf-8 -*-
'''
	Autor: Marcos Aguayo
	Fecha de inicio: 29/05/2013
	Fecha de finalización: 29/05/2013
	Objetivo: Clase para subir archivos al servidor, validarlos y manipularlos
	(Cambiarles el nombre y redimensionarlos)
'''
from django import http
from django.conf import settings
from PIL import Image
from datetime import datetime
import datetime as dt
from random import randint
from main.models import *
from main.funciones import *
import time as t

class SubirArchivo:
	'Clase que se encarga de subir archivos al servidor'

	tipos = [] # Declaramos la lista
	tamano = settings.MAX_SIZE_FILES # Ponemos una medida por defecto
	# Variable que se usa para almacenar el nombre del fichero durante
	# todo el proceso de subirla (cambios de nombre, redimension... )
	filename = '' 

	'''
	Tipo Archivo:
	1 --> Fotos de perfil
	2 --> Canciones
	3 --> Fotos de las canciones
	'''
	def __init__(self, f, tipo_archivo, tipo=None, tam=None):
		self.fichero = f
		self.tipos = tipo
		if tam is not None: self.tamano = tam
		self.tipo_archivo = tipo_archivo
		if self.tipo_archivo == 1: self.ruta = settings.RUTA_FOTOS_PERFIL 
		if self.tipo_archivo == 2: self.ruta = settings.RUTA_CANCIONES 
		if self.tipo_archivo == 3: self.ruta = settings.RUTA_FOTOS_CANCIONES 


	def subir(self):
		file_ext = self.fichero.name.split('.')[-1]
		self.filename = '%s.%s' % (self.renombrarArchivo(), file_ext)
		if self.validar():
			path = "%s/%s" % (self.ruta, self.filename)
			destination = open(path, 'wb+')
			f = self.fichero
			for chunk in f.chunks():
				destination.write(chunk)
			destination.close()
			return True
		else:
			return False


	def validar(self):
		filesize = self.fichero.size
		filetype = self.fichero.content_type

		if filetype in self.tipos:
			if int(filesize) <= int(self.tamano):
				return True
			else:
				return False
		else:
			return False


	def redimensionarImagen(self, width, height):
		path = "%s/%s" % (self.ruta, self.filename)
		file_ext = path.split('.')[-1]
		im = Image.open(path)
		region = im.resize((width, height))
		if file_ext.upper() == 'JPG': file_ext = 'jpeg'
		region.save(path, file_ext)


	def renombrarArchivo(self):
		ahora = datetime.datetime.now()
		new_name = '%s%s' % (randint(1,99999), ahora.strftime("%m%d%H%M%S"))
		return new_name


	def rutaFichero(self):
		return self.filename