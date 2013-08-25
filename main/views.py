# -*- coding: utf-8 -*-
'''
	Autor: Marcos Aguayo y Xavi Güell
	Fecha de inicio: 10/04/2013
	Fecha de finalización: 01/06/2013
	Objetivo: Fichero que contiene las vistas
'''
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib import auth
from django.core.context_processors import csrf 
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.core.mail import send_mail, BadHeaderError
from django.core.urlresolvers import reverse
from django.db.models import Q
from django.db.models import Sum
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, Http404
from django.shortcuts import render_to_response
from django.template import RequestContext, loader, Context, Template
from django.utils import formats
from django.views.decorators.csrf import csrf_exempt
from main.ajax import *
from main.forms import *
from main.funciones import *
from main.models import *
from main.notificaciones import *
from main.subirarchivo import *
from smtplib import SMTPRecipientsRefused

import datetime as dt
import httplib2
import mpeg1audio
import operator
import os
import simplejson as json
import time as t
import urllib
import urllib2

from itertools import chain



# =========================================================================== #
# =============================| SERVING PAGES |============================= #
# =========================================================================== #


def pagina404(request):
	return render_to_response("404.html", context_instance=RequestContext(request))





'''
Página estática de Aviso Legal.
'''
def paginaAvisoLegal(request):
	return render_to_response("aviso-legal.html", context_instance=RequestContext(request))





'''
Página estática de Premium
'''
def paginaPremium(request):
	yo = Usuario.objects.get(pk=request.session['persona'])
	return render_to_response("premium.html", {'yo': yo}, context_instance=RequestContext(request))





'''
Página estática de Politica de privacidad.
'''
def paginaPoliticaPrivacidad(request):
	return render_to_response("politica-privacidad.html", context_instance=RequestContext(request))





def paginaEditarPrivacidad(request):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)
		privacidad = Privacidad.objects.get(usuario=yo)

		if request.method == "POST":
			comentarios = request.POST.get('comentarios', '')
			likes = request.POST.get('likes', '')
			privados = request.POST.get('privados', '')
			amistad = request.POST.get('amistad', '')
			compartir = request.POST.get('compartir', '')

			if comentarios!='' and likes!='' and privados!='' and compartir!='' and amistad!='':
				privacidad.comentario = int(comentarios)
				privacidad.mensaje = int(privados)
				privacidad.compartir = int(compartir)
				privacidad.amistad = int(amistad)
				privacidad.likes = int(likes)
				privacidad.save()

			return HttpResponseRedirect('/perfil/%s' % yo.slug)
			#return HttpResponse("%s-%s-%s-%s-%s" % (comentarios, likes, privados, amistad, compartir))

		informacion_general = infoAdicional(mi_session)
		diccionario = {'user_info': yo, 'privacidad':privacidad}
		diccionario.update(informacion_general)

		return render_to_response("editar-privacidad.html", diccionario, context_instance=RequestContext(request))

	else:
		return HttpResponseRedirect('/login/')
 




def paginaSugerirAmigos(request):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		diccionario = {
			'session': int(mi_session), # Id del usuario logueado
			'user_id': yo.id, # Id del perfil
			'user_info': yo, # Contiene toda la info del perfil, nombre, foto, etc...
			'yo': yo,
			'artistas': getAmigosRecomendados(mi_session, 20)
		}

		return render_to_response('sugerir-amigos.html', diccionario, context_instance = RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')



def paginaBienvenido(request):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		if request.method == "POST":
			gustos = request.POST.get('gustos_array', '')
			if gustos != '': 
				yo.gustos = gustos
				yo.save()
				return HttpResponse("1")
			else:
				return HttpResponse("-1")
		else:

			json_data=open(settings.RUTA_JSON_TAGS)
			data = json.load(json_data)
			json_data.close()

			html = ''
			for a in data['array']:
				html += '<div class="cat-etiquetas"><h4>%s</h4><ul>' % a['name']
				for b in a['hijo']:
					html += '<li class="welcome-tag">%s</li>' % b
				html += '</ul></div>'

			diccionario = {
				'session': int(mi_session), # Id del usuario logueado
				'user_id': yo.id, # Id del perfil
				'user_info': yo, # Contiene toda la info del perfil, nombre, foto, etc...
				'yo': yo,
				'lista_tags': html
			}

			return render_to_response('bienvenido.html', diccionario, context_instance = RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')






def paginaListasReproduccion(request):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		listas = ListaReproduccion.objects.filter(usuario=yo)
		listas_cancion = CancionLista.objects.filter(lista__in=listas.values_list('id', flat=True))
		canciones = Cancion.objects.filter(pk__in=listas_cancion.values_list('cancion', flat=True), subida=1)

		informacion_general = infoAdicional(mi_session)
		diccionario =  {
			'session': int(mi_session),
			'pagina': 3,
			'subpagina': 1,
			'listas': listas,
			'listas_cancion': listas_cancion,
			'canciones': canciones
		}
		diccionario.update(informacion_general)

		return render_to_response('listas-reproduccion.html', diccionario, context_instance = RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')




def paginaListasReproduccionSingle(request, id):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		listas = ListaReproduccion.objects.filter(usuario=yo)
		lista = ListaReproduccion.objects.filter(pk=int(id))
		lista_canciones = CancionLista.objects.filter(lista__in=lista.values_list('id', flat=True))
		canciones = Cancion.objects.filter(pk__in=lista_canciones.values_list('cancion', flat=True), subida=1)

		if request.method == 'POST':
			nombre_lista = request.POST.get('nombre-lista', '')
			borrar_canciones = request.POST.get('canciones', '')

			if nombre_lista != '': 
				lista2 = ListaReproduccion.objects.get(pk=int(id))
				lista2.nombre = nombre_lista
				lista2.save()

			T1 = borrar_canciones.split(',')
			T1.pop() 
			T1 = map(int, T1)
			for cancion in T1:
				song = Cancion.objects.filter(pk=cancion)
				eliminar = CancionLista.objects.filter(cancion=song, lista=lista)
				eliminar.delete()
			


		informacion_general = infoAdicional(mi_session)
		diccionario =  {
			'session': int(mi_session),
			'pagina': 3,
			'subpagina': 2,
			'listas': listas,
			'lista': lista,
			'listas_cancion': lista_canciones,
			'canciones': canciones
		}
		diccionario.update(informacion_general)
		
		return render_to_response('listas-reproduccion.html', diccionario, context_instance = RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')



'''
Función que carga el formulario con los datos del usuario, pasandoselos con una
instancia. Si han hecho post, comprueba si es correcto y guarda los cambios.
'''
def editarPerfil(request):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		if request.method == "POST":
			nombre = request.POST.get('nombre', '')
			email = request.POST.get('email', '')
			pais = request.POST.get('pais', '')
			biografia = request.POST.get('biografia', '')
			gustos_hidden = request.POST.get('gustos', '')
			fondo = ''
			if request.FILES: 
				permitidos = ['image/jpeg', 'image/png']
				f = SubirArchivo(request.FILES['fondo'], 1 , permitidos, 600000)
				if f.subir() == True:
					fondo = f.rutaFichero()
				else:
					return HttpResponse('-1')
			gustos_hidden = gustos_hidden.replace('"', '')
			gustos_hidden = gustos_hidden.replace('[', '')
			gustos_hidden = gustos_hidden.replace(']', '')

			if nombre != '': yo.nombre = nombre
			if email != '': yo.email = email
			if pais != '': yo.pais = pais
			if biografia != '': yo.biografia = biografia
			if gustos_hidden != '': yo.gustos = gustos_hidden
			if fondo != '': yo.fondo = fondo

			yo.save()
			
			return HttpResponse('1')

		informacion_general = infoAdicional(mi_session)
		diccionario = {'user_info': yo,}
		diccionario.update(informacion_general)

		return render_to_response("editar-perfil.html", diccionario, context_instance=RequestContext(request))

	else:
		return HttpResponseRedirect('/login/')





'''
Función para mostrar el perfil del usuario que le indiquemos con una ID, en esta funcion también
contabilizamos las visitas del perfil, si el usuario no ha visitado ese perfil en las ultimas 24h
entonces guardamos la visita para que se contabilize, este sistema evita que puedan hacer trampas.
Esta función a pesar de ser de las funciones que cogen los diccionarios de la función "infoConCabecera",
es un poco diferente, asi que en vez de coger toda la información general, cogemos algunas cosas 
concretas como el almacenamiento, los totales de amigos, fans, canciones y las estadisticas del sidebar
'''
def perfil(request, user):
	if 'persona' in request.session:

		hoy = date.today()
		mi_session=request.session['persona'];

		perfil = Usuario.objects.get(slug=user)
		songs = Cancion.objects.all().filter(autor=perfil, subida=1).order_by('-fecha_subida')
		yo = Usuario.objects.get(pk=mi_session)

		# Las canciones que el usuario ha compartido
		mis_canciones = todasCancionesPerfil(perfil)

		try:
		    amistad = Amigo.objects.get(usuario=yo, amigo=perfil)
		    exist_amistad = True
		except ObjectDoesNotExist:
			exist_amistad = False

		# Comprobamos que es la primera vez que el usuario accede hoy.
		visita = VisitasPerfil.objects.filter(usuario=yo, perfil=perfil, fecha__year=hoy.year, fecha__month=hoy.month, fecha__day=hoy.day).count()
		if visita == 0:
			add_visita = VisitasPerfil(usuario=yo, perfil=perfil)
			add_visita.save()

		diccionario = {
			'session': int(mi_session), # Id del usuario logueado
			'user_id': perfil.id, # Id del perfil
			'user_info': perfil, # Contiene toda la info del perfil, nombre, foto, etc...
			'perfil_canciones': mis_canciones, # Para listar todas las canciones del perfil
			'pagina': 2, # Para marcar en el menu el "current page"
			'yo': yo,
			'suggest_values': getSuggestValues(),
			'amistad': exist_amistad
		}

		return render_to_response("perfil.html", diccionario, context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')





'''
Función del inicio para comprobar si el usuario ya esta autentificado, si no lo 
esta lo redirige al login.con "context_instance = RequestContext(request)" le 
pasamos al template las variables del settings.py para poder usarlas como constantes
'''
def home(request):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		if len(yo.gustos) < 2 and Amigo.objects.filter(usuario=yo).count() == 0: return HttpResponseRedirect('/bienvenido/')

		canciones = Cancion.objects.filter(autor__in = Amigo.objects.filter(usuario=yo).values_list('amigo', flat=True), subida=1).order_by('-fecha_subida')[:50]
		comentarios = Comentarios.objects.all().filter(cancion__in=canciones)

		informacion_general = infoAdicional(mi_session)
		recomendaciones = getAmigosRecomendados(mi_session, 3)
		diccionario = {
			'session': int(mi_session),
			'pagina': 1,
			'comentarios': comentarios,
			'canciones': canciones,
			'recomendaciones': recomendaciones
		}
		diccionario.update(informacion_general)

		return render_to_response('index.html', diccionario, context_instance = RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')





'''
Función que llama a la plantilla login y usa protección contra XSS gracias a "csrf".
esta protección csrf hace que solo el usuario que haya cargado la página pueda enviar
el formulario.
'''
def login(request):
	formulario = UsuarioForm()
	return render_to_response('login.html', {'formulario': formulario}, context_instance=RequestContext(request))





'''
Página que muestra las notificaciones del usuario autentificado. Al entrar en notificaciones
estas se limpian automaticamente, ya que se supone que las ha leido al entrar en la pagina.
'''
def paginaNotificaciones(request):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		notificaciones = Notificacion.objects.order_by('-id').filter(receptor=mi_session)[:20]
		Notificacion.objects.all().filter(receptor=mi_session).update(leido=1)

		informacion_general = infoAdicional(mi_session)
		diccionario = {
			'session': int(mi_session), 
			'user_id': id, 
			'pagina': 4,
			'user_info': yo,
			'notificaciones': notificaciones
		}
		diccionario.update(informacion_general)

		return render_to_response("notificaciones.html", diccionario, context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')




def paginaFAQ(request):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		informacion_general = infoAdicional(mi_session)
		diccionario = {
			'session': int(mi_session), 
			'user_id': id, 
			'pagina': 4,
			'user_info': yo
		}
		diccionario.update(informacion_general)

		return render_to_response("faq.html", diccionario, context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')


'''
Página "single" de las cancions, una página dedicada a cada canción, para que puedan
tener su link por si queremos compartirlas.
'''
def paginaCancion(request, id):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		cancion = Cancion.objects.get(pk=id)
		id_cancion = cancion.getId
		id_perfil = cancion.getIdAutor;

		perfil = Usuario.objects.get(pk=id_perfil)
		yo = Usuario.objects.get(pk=mi_session)
		comentarios = Comentarios.objects.all().filter(cancion=id_cancion)

		try:
		    amistad = Amigo.objects.get(usuario=yo, amigo=perfil)
		    exist_amistad = True
		except ObjectDoesNotExist:
			exist_amistad = False

		informacion_general = infoAdicional(mi_session)
		diccionario =  {
			'session': int(mi_session), 
			'user_id': id_perfil, 
			'user_info': perfil, 
			'cancion': cancion,
			'pagina': 6,
			'comentarios': comentarios,
			'amistad': exist_amistad
		}
		diccionario.update(informacion_general)

		return render_to_response("cancion.html", diccionario, context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')





'''
Función que entrega la pagina de descrubre al navegador del cliente, cuando
la peticion tiene parametros (busqueda de etiquetas).
'''
def paginaDescrubreTag(request, string):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		canciones_tag = Cancion.objects.all().filter(genero__contains=string)

		return render_to_response('descubre.html', {
			'session': request.session['persona'], 
			'pagina': 3,
			'subpagina': 2, # Para diferenciar las URL con busqueda de la simple, se hace un if en el html
			'yo': yo,
			'sidebar_tags': getDescubreSidebar(string),
			'canciones_tag': canciones_tag}, context_instance = RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')





'''
Función que entrega la página de "descubre" sin ningun parametro ni busqueda.
esta función cogerá las canciones sugeridas en base a los gustos del usuario.
'''
def paginaDescrubre(request):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		# Convertimos los gustos en una lista y buscamos todas las canciones que tengan un genero parecido a tus gustos
		gustos = yo.gustos.split(',')
		canciones_recomendadas = Cancion.objects.all().filter(reduce(lambda x, y: x | y, [Q(genero__contains=word) for word in gustos])).exclude(autor=yo)

		# Buscamos canciones parecidas a los gustos del usuario
		gustos_parecidos = estilosParecidos(gustos)
		canciones_parecidas = Cancion.objects.all().filter(reduce(lambda x, y: x | y, [Q(genero__contains=kw) for kw in gustos_parecidos])).exclude(autor=yo)

		# Para que no salgan repetidas hacemos una lista de las que ya han salido
		canciones_excluir = list(chain(canciones_parecidas, canciones_recomendadas, Cancion.objects.filter(autor=yo)))

		# Las mejores canciones si no tienes muchas
		top_canciones = []
		
		if (len(canciones_parecidas) + len(canciones_recomendadas)) <= 5:
			canciones = []
			reproducciones = Reproducciones.objects.all().exclude(cancion__in=canciones_excluir)
			for r in reproducciones:canciones.append(r.cancion)
			ordenar = Counter(canciones).most_common(10)
			for t in ordenar:top_canciones.append(t[0])

		informacion_general = infoAdicional(mi_session)
		diccionario =  {
			'pagina': 3,
			'sidebar_tags': getDescubreSidebar(),
			'canciones_recomendadas': canciones_recomendadas,
			'canciones_parecidas': canciones_parecidas,
			'top_canciones': top_canciones
		}
		diccionario.update(informacion_general)

		return render_to_response('descubre.html', diccionario, context_instance = RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')





'''
Vista para la página de Ranking, llamamos a otras dos funciones que se encuentran en funciones.py que nos
devuelven los datos de top_canciones y top_usuarios.
'''
def paginaRanking(request):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		informacion_general = infoAdicional(mi_session)
		diccionario =  {
			'pagina': 3,
			'genero': '-1', # No hay genero
			'sidebar_tags': getTopSidebar(),
			'top_canciones': topCancionesReproducciones(25),
			'top_usuarios': topUsuarioPuntos(25)
		}
		diccionario.update(informacion_general)

		return render_to_response('ranking.html', diccionario, context_instance = RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')




def paginaRankingGenero(request, genero):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		informacion_general = infoAdicional(mi_session)
		diccionario =  {
			'pagina': 3,
			'genero': genero,
			'sidebar_tags': getTopSidebar(),
			'top_canciones': topCancionesReproducciones(25, genero),
			'top_usuarios': topUsuarioPuntos(25, genero)
		}
		diccionario.update(informacion_general)

		return render_to_response('ranking.html', diccionario, context_instance = RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')



