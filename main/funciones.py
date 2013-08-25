# -*- coding: utf-8 -*-
'''
    Autor: Marcos Aguayo y Xavi Güell
    Fecha de inicio: 28/04/2013
    Fecha de finalización: 01/06/2013
    Objetivo: Fichero que contiene las funciones. Todo aquello que no son vistas.
'''

from collections import Counter
from datetime import datetime
from django.conf import settings
from django.contrib import auth
from django.core.context_processors import csrf 
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import BadHeaderError
from django.core.mail import EmailMessage
from django.core.mail import send_mail
from django.db.models import Avg
from django.db.models import Q
from django.db.models import Sum
from django.http import Http404
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import Context
from django.template import loader
from django.template import RequestContext
from django.template import Template
from django.utils import formats
from main.forms import *
from main.funciones import *
from main.models import *
from PIL import Image
from random import choice
from string import digits
from string import letters
import datetime as dt
import hashlib
import httplib2
import mpeg1audio
import operator
import os
import random
import simplejson as json
import time as t
import urllib
import urllib2

from itertools import chain



'''
Función para pasarle a las vistas información comun y asi no repetir el código. 
'''
def infoAdicional(sesion):
	yo = Usuario.objects.get(pk=sesion)

	diccionario = {
		'session': int(sesion),
		'yo': yo, # Toda mi Informacion
		'suggest_values': getSuggestValues(),
	}

	return diccionario




def buscarUsuarios():
	usuarios = Usuario.objects.filter(Q(nombre__contains=keyword) | Q(nombre__istartswith=keyword) | Q(nombre__iendswith=keyword))



'''
Función que devuelve los amigos recomendados en base a tus gustos musicales.
'''
def getAmigosRecomendados(sesion, limit):
	yo = Usuario.objects.get(pk=sesion)
	seguidos = Usuario.objects.filter(id__in=Amigo.objects.filter(usuario=yo).values_list('amigo', flat=True))

	users_excluir = list(chain(seguidos, Usuario.objects.filter(pk=sesion)))
	lista_excluir = []
	for u in users_excluir: lista_excluir.append(u.id)

	keywords = yo.gustos
	result = []
	for keyword in keywords.split(','):
	    result += list(Usuario.objects.filter(gustos__icontains=keyword).exclude(pk__in=lista_excluir))

	keywords_parecidos = estilosParecidos(keywords.split(','))
	for k in keywords_parecidos:
	    result += list(Usuario.objects.filter(gustos__icontains=k).exclude(pk__in=lista_excluir))

	resultado = Counter(result).most_common(limit)
	
	diccionario = []
	for r in resultado:
		diccionario += list(Usuario.objects.filter(pk=r[0].id)) 


	return diccionario





'''
Función que coge del fichero JSON todos los estilos de música o etiquetas para pasarselos
a jQuery para hacer una lista de selección con los valores sugeridos.
'''
def getSuggestValues():
	data = getContentJSON()
	valores = ''
	for a in data['array']:
		for b in a['hijo']:
			valores += '%s, ' % b

	return valores




'''
Función que genera la estructura del sidebar de las páginas de descubre. Esta función coge los
generos del fichero JSON.
'''
def getDescubreSidebar(pag=None):
	data = getContentJSON()
	html = ''

	if pag is not None:
		html += '<input type="hidden" id="genero-actual" value="%s" />' % stringToID(pag)

	for a in data['array']:
		html += ('<div class="accordion-group">'
					'<div class="accordion-heading">'
						'<a class="accordion-toggle" data-toggle="collapse" data-parent="#acordeon" href="#%s">%s</a>'
					'</div>'
					'<div id="%s" class="accordion-body collapse">'
						'<div class="accordion-inner">') % (stringToID(a['name']), a['name'], stringToID(a['name']))
		for b in a['hijo']:
			html += '<a href="http://disoner.com/descubre/%s" data-genero="%s">%s</a>' % (b, stringToID(b), b)

		html += 		('</div>'
					'</div>'
				'</div>')

	return html





'''
Función que genera la estructura del sidebar de las páginas de ranking. Esta función coge los
generos del fichero JSON.
'''
def getTopSidebar():
	data = getContentJSON()
	html = ''

	for a in data['array']:
		html += ('<div class="accordion-group">'
					'<div class="accordion-heading">'
						'<a class="accordion-toggle" href="/ranking/%s">%s</a>'
					'</div>'
				'</div>') % (a['name'], a['name'])

	return html






'''
Función que te crea un string aleatorio de la medida que le pases por parametro. 
'''
def randomString(length):
    s = ''
    for i in range(length):
        s += random.choice(digits + letters)
    return s





'''
Función para transformar un string normal en un ID, quitamos todos los carácteres que no
sean ASCIIs, sustituimos los espacios en blanco por un "-" y finalmente lo convertimos
todo en minúsculas. 
'''
def stringToID(s):
    result = ''.join([x for x in s if ord(x)<128])
    result = result.replace(" ", "-").lower();
    return result





'''
Función para comparar dos listas que le pasemos por parámetro.
'''
def compararListas(lista1, lista2):
	lista = []
	for x in set(lista1).intersection(set(lista2)):
		lista.append(x)
	return lista





'''
Función que coge los generos padres del fichero JSON de una lista de generos
que le hemos pasado previamente por parámetro.
'''
def getGeneroPadre(lista):
	obj_json = getContentJSON()
	coincidencias = []
	i = 0

	for datos in obj_json['array']:
		for tag in datos['hijo']:
			if tag in lista:
				for l in lista: 
					if tag == l: coincidencias.append(i)
		i += 1
			
	valores = []
	for val in coincidencias:
		valores.append(obj_json['array'][val]['name'])

	return valores





'''
A partir de una lista pasada por parametro nos devuelve otra lista ordenada
con los mas repetidos en ella.
'''
def getMasRepetidoLista(lista):
	resultado = []
	ordenado = Counter(lista).most_common(2)
	for o in ordenado:
		resultado.append(o[0])

	return resultado




'''
A partir de una lista que le pasamos por parámetro, coge del fichero JSON
todos los hijos de esta lista de gustos/generos.
'''
def getHijosPadre(padres):
	obj_json = getContentJSON()
	coincidencias = []

	for p in padres:
		for datos in obj_json['array']:
			for tag in datos['hijo']:
				if datos['name'] == p: coincidencias.append(tag)

	return coincidencias





'''
Función que devuelve los estilos parecidos a unos que son pasados por
parámetro. Primero coge todos los estilos del fichero JSON. Después 
comprueba cuales de los estilos que se le ha pasado por parametro son 
realmente gustos correctos (del fichero JSON). Después cogemos los generos
padres (agrupandolos) de todos estos estilos. Y Después todos los hijos de
estos padres. Y usamos la función de excluirLista para eliminar aquellos
estilos que le hemos pasado, de esta forma solo quedan los parecidos.
'''
def estilosParecidos(gustos):
	data = getContentJSON()
	tags_json = []

	for a in data['array']:
		for b in a['hijo']:
			tags_json.append(b)

	gustos_correctos = compararListas(gustos, tags_json)
	padres = getGeneroPadre(gustos_correctos)
	padres_ordenados = getMasRepetidoLista(padres)
	gustos_parecidos = getHijosPadre(padres_ordenados)
	resultado = list(excluirLista(gustos_parecidos, gustos_correctos))

	return resultado





'''
Función que devuelve el contenido de un fichero JSON.
'''
def getContentJSON():
	json_data = open(settings.RUTA_JSON_TAGS)
	data = json.load(json_data)
	json_data.close()

	return data





'''
Función para separar dos listas.
'''
def excluirLista(full_list, excludes):
    s = set(excludes)
    return (x for x in full_list if x not in s)





'''
Función para encriptar un string que le pasemos, se usa principalmente para la
contraseña, aunque se puede utilizar para otras cosas.
'''
def encriptarString(string):
	return hashlib.md5(string).hexdigest()





'''
Función para mostrar el TOP de usuarios por puntos. Se tiene que hacer una suma
y ordenar por el resultado.
'''
def topUsuarioPuntos(num, genero=None):
	if genero is None:
		puntos = Puntos.objects.values('perfil_id').annotate(total=Sum('puntos')).order_by('-total')[:num]
		usuarios = []
		for p in puntos:
			usuarios.append(Usuario.objects.get(pk=p['perfil_id']))
	else:
		subgeneros = getHijosPadre([genero])
		canciones_genero = Cancion.objects.filter(genero__in=subgeneros).values_list('autor', flat=True)
		puntos = Puntos.objects.filter(perfil__in=canciones_genero).values('perfil_id').annotate(total=Sum('puntos')).order_by('-total')[:num]
		usuarios = []
		for p in puntos:
			usuarios.append(Usuario.objects.get(pk=p['perfil_id']))

	return usuarios	





'''
Función que devuelve el TOP de canciones segun las Reproducciones.
'''
def topCancionesReproducciones(num, genero=None):
	if genero is None:
		reproducciones = Reproducciones.objects.all()
	else:
		subgeneros = getHijosPadre([genero])
		reproducciones = Reproducciones.objects.filter(cancion__in=Cancion.objects.filter(genero__in=subgeneros))
		
	canciones = []
	for r in reproducciones:
		canciones.append(r.cancion)

	ordenar = Counter(canciones).most_common(num)
	top = []
	for t in ordenar:
		top.append(t[0])

	return top





'''
Función que utiliza la vista "perfil" para pasarle al template las canciones
del perfil que se esta visitando. Utilizamos esta función porque entre las 
canciones también queremos incluir aquellas que han sido compartidas, y 
ordenarlas, pero no por fecha, porque una cancion compartida tiene dos fecha
la fecha de la cancion y la fecha en la que se ha compartido. Tenemos que ordenar
por fecha en las canciones y fecha que se ah compartido en las compartidas. Para
eso metemos en una lista la cancion y fechas, ordenamso por el segundo item y 
lo metemos en un nuevo array cogiendo solo los 7 primeros, el resto se cargaran
vía AJAX con jQuery.
'''
def todasCancionesPerfil(yo):
	num1 = 0
	num2 = 7
	compartidas = CancionesCompartidas.objects.filter(usuario=yo)
	canciones_dict = []
	for c in compartidas:
		canciones_dict.append([c.cancion, c.fecha])

	mias = Cancion.objects.filter(autor=yo)
	for m in mias:
		canciones_dict.append([m, m.fecha_subida])

	orden = sorted(canciones_dict, key=operator.itemgetter(1), reverse=True)
	orden_iter = orden[num1:num2]

	id_list = []
	for c in orden_iter:
		id_list.append(c[0].id)

	all_songs = Cancion.objects.filter(id__in=id_list)[num1:num2]
	all_songs = dict([(obj.id, obj) for obj in all_songs])
	sorted_objects = [all_songs[id] for id in id_list[num1:num2]]

	return sorted_objects


