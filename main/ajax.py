# -*- coding: utf-8 -*-
'''
	Autor: Marcos Aguayo y Xavi Güell
	Fecha de inicio: 10/04/2013
	Fecha de finalización: 01/06/2013
	Objetivo: Fichero que tiene las funciones/vistas usadas mayormente con AJAX.
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
from main.forms import *
from main.funciones import *
from main.models import *
from main.subirarchivo import *
from main.views import *
from main.notificaciones import *
from main.autentificacion import * 
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



# =========================================================================== #
# =============================| VISTAS AJAX |=============================== #
# =========================================================================== #


'''
Función para subir una canción al servidor, con el path.split(".")[-1] cogemos la extensión 
y hacemos un filtro, devolvemos el id de la canción que lo capturará jQuery y lo pondra en 
un input hidden para que al actualizar la información de la canción saber el ID
'''
def addCancion(request):
	if 'persona' in request.session:
		if request.method == 'POST':
			form2 = UploadSong(request.POST, request.FILES)
			yo = Usuario.objects.get(pk=request.session['persona'])
			if form2.is_valid():

				permitidos = ['audio/mp3', 'audio/mpeg']
				f = SubirArchivo(request.FILES['file'], 2 , permitidos)

				if f.subir() == True:

					archivo = "%s/%s" % (settings.RUTA_CANCIONES, f.rutaFichero())

					try:
						mp3 = mpeg1audio.MPEGAudio(open(archivo, 'rb'))
					except mpeg1audio.MPEGAudioHeaderException:
						pass
					else:
						a = '%s' % mp3.duration

					x = t.strptime(a, '%H:%M:%S')
					total_segundos = dt.timedelta(hours=x.tm_hour, minutes=x.tm_min, seconds=x.tm_sec).total_seconds()
					total_restante = yo.almacenamientoRestante();

					if total_segundos < total_restante:
						usuario = Usuario.objects.get(pk=request.session['persona'])
						song = Cancion(autor=usuario, cancion=f.rutaFichero(), segundos=total_segundos)
						song.save()
						return HttpResponse(song.id)
					else:
						usuario = Usuario.objects.get(pk=request.session['persona'])
						song = Cancion(autor=usuario, cancion=f.rutaFichero())
						song.save()	
						return HttpResponse("-4")
				else:
					return HttpResponse("-3")

			else:
				return HttpResponse("-2")
		else:
			return HttpResponse("-1")	
	else:
		return HttpResponseRedirect('/login/')





'''
Función para añadir una canción a una lista de reproducción. Se le pasan dos parametros
vía URL /cancion20/lista3/, valida que el usuario este autentificado, comprueba que la
petición ha sido vía AJAX, comprueba que la lista es del usuario logueado, y la añade.
'''
def addCancionLista(request, n1, n2):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():

			song = Cancion.objects.get(pk=n1)
			lista = ListaReproduccion.objects.get(pk=n2)

			existe = CancionLista.objects.filter(cancion=song, lista=lista).count()

			if existe == 0:
				add = CancionLista(cancion=song, lista=lista)
				add.save()
				return HttpResponse("1")
			else:
				return HttpResponse("-2")
		else:
			return HttpResponse('-1')
	else:
		return HttpResponse('-1')





'''
Función para subir la foto de la canción al servidor. Se le pasa a la funcion encargada de subir
la foto dos parametors, el fichero y la peticion "request". Esta función cambia el nombre a la foto
y lo devuelve a una varibale que se le pasara a una funcion para redimensionar la imagen a un tamaño
mas optimo (130x130). Una vez redimansionada la imagen se guarda en la base de datos.
'''
def addFotoCancion(request):
	if 'persona' in request.session:
		if request.method == 'POST':
			
			id_editar = request.POST.get('cancion-editar', '')
			usuario = Usuario.objects.get(pk=request.session['persona'])
			song = Cancion.objects.get(id=id_editar, autor=usuario)

			if song is not None:
				permitidos = ['image/jpeg', 'image/png', 'image/jpg']
				f = SubirArchivo(request.FILES['file'], 3 , permitidos, 500000)
				if f.subir() == True:
					f.redimensionarImagen(130,130)
					song.imagen = f.rutaFichero()
					song.save()
					return HttpResponse(f.rutaFichero())
				else:
					return HttpResponse("-7")
			else:
				return HttpResponse("-6") # No existe el ID que nos han enviado
			
		else:
			raise Http404
	else:
		return HttpResponseRedirect('/login/')	





'''
Función para añadir la información después de haberla subido. Comprobamos que el ID del input hidden 
pertenece realmente a quien deberia, por si lo han modificado desde el browser, si es autentico
guardamos los cambios en la BD, sino devolvemos un codigo de ee
'''
def addInfoCancion(request):
	if 'persona' in request.session:
		if request.method == 'POST':
			form2 = InfoCancion(request.POST)
			if form2.is_valid():
				titulo = request.POST.get('titulo-cancion', '')
				gen = request.POST.get('genero-cancion', '')
				id_editar = request.POST.get('cancion-editar', '')
				descripcion = request.POST.get('descripcion-cancion', '')
				usuario = Usuario.objects.get(pk=request.session['persona'])
				song = Cancion.objects.get(id=id_editar, autor=usuario)

				gen = gen.replace('"', '')
				gen = gen.replace('[', '')
				gen = gen.replace(']', '')

				if song is not None:
					if titulo != '': song.nombre = titulo
					if gen != '': song.genero = gen
					if descripcion != '': song.descripcion = descripcion

					if titulo != '' and gen != '':
						song.subida = 1
						song.save()
						return HttpResponse("1")
					else:
						return HttpResponse("-7")
						
				else:
					return HttpResponse("-6") # No existe el ID que nos han enviado

			else:
				return HttpResponse("-5") # Formulario invalido
		else:
			return HttpResponse("-4") # La petición no ha sido vía POST
	else:
		return HttpResponseRedirect('/login/')	





'''
Función para escribir un mensaje nuevo en la base de datos, se comprueban los datos
enviados y se limpian (el id se muestra de esta forma: [2], y lo necesitamos int).
'''
def addMensaje(request):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			destinatario = request.POST.get('destinatario-mensaje-id', '')
			if destinatario != '':
				destinatario = int(destinatario)
			mensaje = request.POST.get('texto-nuevo-mensaje', '')
			yo = Usuario.objects.get(pk=mi_session)
			dest = Usuario.objects.get(pk=destinatario)

			if destinatario != '' and mensaje != '':
				msg = Mensaje(usuario=yo, destinatario=dest, mensaje=mensaje)
				msg.save()

				txt = u'%s te ha enviado un mensaje: %s' % (yo.nombre, mensaje)
				notificacion = Notificaciones(dest, yo)
				notificacion.nuevoMensaje(txt)

				return HttpResponse('1')
			else:
				return HttpResponse('-3')
		else:
			return HttpResponse('-2')
	else:
		return HttpResponse('-1')





'''
Función para agregar a un amigo, primero se comprueba que esta autentificado, si lo esta, 
se comprueba si existe la amistad entre estos dos, si no existe se crea, si ya existe se
redirecciona al usuario de vuelta al perfil.
'''
def agregarAmigo(request, user):
	if 'persona' in request.session:
		amigo = Usuario.objects.get(slug=user)
		yo = Usuario.objects.get(pk=request.session['persona'])
		url_perfil = '/perfil/%s' % (user)

		try:
		    amistad = Amigo.objects.get(usuario=yo, amigo=amigo)
		    exist_amistad = True
		except ObjectDoesNotExist:
			exist_amistad = False

		if not exist_amistad:
			add = Amigo(usuario=yo, amigo=amigo)
			add.save()
			notificacion = Notificaciones(amigo, yo)
			notificacion.nuevoAmigo()

			return HttpResponseRedirect(url_perfil)
		else:
			return HttpResponseRedirect(url_perfil)
	else:
		return HttpResponseRedirect('/login/')





'''
Función para crear usuarios usando un form de "forms.py" que valida el modelo Usuario. 
Comprobamos la petición es través de AJAX y "POST", pasamos los datos al formulario para 
que lo valide. Si es valido lo guarda en la BD, sino devuelve un código de error
'''
def agregarUsuarioAJAX(request):
	if request.is_ajax() and request.method == 'POST':
		contador = 1
		nombre = request.POST.get('rnombre', '')
		email = request.POST.get('remail', '')
		password = request.POST.get('rpassword', '')
		password2 = request.POST.get('rpassword2', '')

		if email != '' and password != '' and nombre != '':
			aleatorio = randomString(30)
			len_pass = len(password)

			email_used = Usuario.objects.filter(email=email).count() > 0
			same_passwords = (password == password2)

			if email_used or not same_passwords:
				if email_used: return HttpResponse("-2")
				if not same_passwords: return HttpResponse("-3")
				return HttpResponse("-5")
			else:
				#if len_pass<8 or len_pass>12: return HttpResponse("-4")

				url_user = nombre.lower()
				url_user = url_user.replace(' ', '-')
				exists = Usuario.objects.filter(slug=url_user).count() > 0
				while exists:
					url_user2 = u'%s-%s' % (url_user, contador)
					exists = Usuario.objects.filter(slug=url_user2).count() > 0
					contador += 1

				if contador > 1: url_user = url_user2

				#user = Usuario(nombre=nombre, slug=url_user, email=email, password=encriptarString(password), codigo=aleatorio)
				#user.save()

				#privacidad = Privacidad(usuario=user)
				#privacidad.save()

				#notificacion = Notificaciones(user)
				#notificacion.registro()

				#usuario_priv = Usuario.objects.get(email=email);

				return HttpResponse("1")
		else:
			return HttpResponse("-1")

	else:
		raise Http404





'''
Función que autentifica los campos del Login y dice si el usuario es correcto o 
incorrecto. En caso de ser correcto instala una sessión con el ID de usuario, si 
es le pasa al template parametros que indican el tipo de error
'''
def auth(request):
	if request.is_ajax() and request.method == 'POST':
		email = request.POST.get('username', '')
		password = request.POST.get('password', '')
		autenti = Autentificacion()
		auth = autenti.authenticate(email, encriptarString(password))

		if auth is not None:
			id_usuario = Usuario.objects.get(email=email).getId()
			request.session['persona'] = id_usuario
			return HttpResponse('1')
		else:
			return HttpResponse("-1")
	else:
		return HttpResponse("-1")		



def borrarComentario(request, id):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			yo = Usuario.objects.get(pk=mi_session);
			comentario = Comentarios.objects.get(pk=int(id))

			if comentario.usuario.id == yo.id:
				comentario.delete()
				return HttpResponse("1")

		else:
			return HttpResponse('-1')
	else:
		return HttpResponse('-1')



'''
Función para borrar una lista, la llamamos a través de AJAX y le pasamos por
la URL el ID de la Lista que vamos a borrar.
'''
def borrarLista(request, id):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			yo = Usuario.objects.get(pk=mi_session);
			lista = ListaReproduccion.objects.get(pk=int(id))

			if lista.usuario.id == yo.id:
				lista.delete()
				return HttpResponse("1")
			else:
				return HttpResponse("-2")
		else:
			return HttpResponse('-1')
	else:
		return HttpResponse('-1')





'''
Función para el buscador de la cabecera, esta función se le llama cada vez que el usuario
escribe una letra, y esta función va buscando coincidencias en la base de datos y devolviendolas
mediante AJAX. Si envían el formulario esta función llama a la página de buscar.
'''
def buscar(request):
	if 'persona' in request.session:
		keyword = '-1'
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			yo = Usuario.objects.get(pk=mi_session);
			keyword = request.POST.get('keyword', '')

			canciones = Cancion.objects.filter(Q(nombre__contains=keyword) | Q(nombre__istartswith=keyword) | Q(nombre__iendswith=keyword))[:4]
			usuarios = Usuario.objects.filter(Q(nombre__contains=keyword) |Q(nombre__istartswith=keyword) |Q(nombre__iendswith=keyword))[:4]

			t = loader.get_template('buscar.html')
			c = Context({'usuarios': usuarios, 'canciones': canciones, 'keyword': keyword})
			html = t.render(c)
			return HttpResponse(html)

		if request.method == "POST":
			keyword = request.POST.get('keyword', '')
			
		return paginaBuscar(request, keyword)
	else:
		return HttpResponse('-1')




def buscadorUsuarios(request):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			yo = Usuario.objects.get(pk=mi_session);
			keyword = request.POST.get('destinatario-nuevo-mensaje', '')

			usuarios = Usuario.objects.filter(Q(nombre__contains=keyword) |Q(nombre__istartswith=keyword) |Q(nombre__iendswith=keyword)).exclude(pk=mi_session)

			t = loader.get_template('buscar-usuarios.html')
			c = Context({'usuarios': usuarios, 'keyword': keyword})
			html = t.render(c)
			return HttpResponse(html)
	else:
		return HttpResponse('-1')



'''
Función que carga un formulario para subir la foto de perfil, comprobamos que la peticion
ha sido POST y AJAX, validamos el formulario, ejecutamos la función para subir la foto,
y le pasamos 2 paremetros, el fichero y la petición. Si lo que devuelve (nombre del fichero)
es "-1", devolvemos un código de error. Si no, guardamos la RUTA en la BD y redimensionamos 
la imagen, pasandole la ruta y los tamaños (width, height), en orden.
'''
def cambiarFotoPerfil(request):
	if request.method == 'POST' and request.is_ajax():
		a = request.POST
		form = UploadFileForm(request.POST, request.FILES)
		if form.is_valid():

			permitidos = ['image/jpeg', 'image/png']
			f = SubirArchivo(request.FILES['file'], 1 , permitidos, 500000)
			if f.subir() == True:
				f.redimensionarImagen(290,230)
				updateImg = Usuario.objects.get(pk=request.session['persona'])
				updateImg.imagen = f.rutaFichero()
				updateImg.save()
				ruta = 	"http://disoner.com/static/fotos_perfil/%s" % f.rutaFichero()
				return HttpResponse(ruta)
			else:
				return HttpResponse("-2")
		else:
			return HttpResponse("-1")
				
	else:
		form = UploadFileForm()

	c = {'form': form}
	c.update(csrf(request))
	return render_to_response('foto-perfil.html', c)




'''
Cuando hay muchas canciones, no las cargamos todas a la vez. Cargamos 7 canciones y si
el usuario quiere ver más, se le iran cargando de 7 en 7. Esta función revuelve a jQuery
con AJAX la lista de canciones para que este las añada a las existentes sin necesidad de
recargar la página.
'''
def cargarCancionesAJAX(request, id, n1, n2):
	mi_session=request.session['persona'];
	id_perfil = int(id)
	num1 = int(n1)
	num2 = int(n2)
	canciones_dict = []
	id_list = []
	perfil = Usuario.objects.get(pk=id_perfil);
	compartidas = CancionesCompartidas.objects.filter(usuario=perfil)
	mias = Cancion.objects.filter(autor=perfil)
	for c in compartidas: canciones_dict.append([c.cancion, c.fecha])
	for m in mias: canciones_dict.append([m, m.fecha_subida])

	orden = sorted(canciones_dict, key=operator.itemgetter(1), reverse=True)
	orden_ite = orden[num1:num2]
	for c in orden_ite: id_list.append(c[0].id)

	all_songs = Cancion.objects.filter(id__in=id_list)
	all_songs = dict([(obj.id, obj) for obj in all_songs])
	sorted_objects = [all_songs[id] for id in id_list]

	t = loader.get_template('reproductor-cargar-ajax.html')
	c = Context({
		'canciones': sorted_objects, 
		'user_info': perfil, 
		'user_id': perfil.id,
		'session': int(mi_session)
	})
	
	html = t.render(c)
	resp = {'html': html,'max': len(orden)}
	return HttpResponse(json.dumps(resp), mimetype="application/json")





'''
Función que envia las lista de reproducción a jQuery para que las añada. Comprobamos que
el usuarios esta logueado, si lo esta comprobamos que la petición ha sido vía AJAX, si ha
sido vía AJAX, cogemos el contenido de 'tooltip-listas.html', lo renderizamos con las listas
del usuario logueado y se lo enviamos a jQuery.
'''
def cargarListas(request):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			listas = ListaReproduccion.objects.all().filter(usuario=mi_session)

			t = loader.get_template('tooltip-listas.html')
			c = Context({'listas': listas})
			html = t.render(c)
			return HttpResponse(html)
		else:
			return HttpResponse('-1')
	else:
		return HttpResponse('-1')





'''
Función que carga los mensajes en la plantilla mensajes-privados.html, que después vía AJAX se
cargara en el lightbox cuando el usuario haga click en "mensajes".
'''
def cargarMensajes(request):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			yo = Usuario.objects.get(pk=mi_session)

			mensajes = Mensaje.objects.filter(destinatario=yo).order_by('-fecha')
			mensajes.query.group_by = ['usuario_id']

			mensajes_enviados = Mensaje.objects.filter(usuario=yo).order_by('-fecha')
			mensajes_enviados.query.group_by = ['destinatario_id']

			t = loader.get_template('mensajes-privados.html')
			c = Context({'mensajes': mensajes, 'mensajes_enviados': mensajes_enviados})
			html = t.render(c)
			return HttpResponse(html)
		else:
			return HttpResponse('-1')
	else:
		return HttpResponse('-1')





'''
Función para compartir una canción de otro usuario en tu perfil. Promero comprobamos que la
canción no es del usuario que la quiere compartir, si lo es, enviamos un código de error a 
jQuery para mostrar una alerta diciendo que no puede compartir su propia canción, si no es 
su canción la guardamos en la base de datos.
'''
def compartirCancion(request, cancion):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			yo = Usuario.objects.get(pk=mi_session);
			song = Cancion.objects.get(pk=cancion)

			if song.autor.id != yo.id:
				compartida = CancionesCompartidas.objects.filter(usuario=yo, cancion=song).count()
				if compartida == 0:
					compartir = CancionesCompartidas(usuario=yo, cancion=song)
					compartir.save()
					return HttpResponse("1")
				else:
					return HttpResponse("-4")
			else:
				return HttpResponse("-3")

		else:
			return HttpResponse("-2")
	else:
		return HttpResponse('-1')





'''
Función que comprueba si tiene nuevas notificaciones, es una función que se le llama cada
X segundos, y esta responde con el numero total de notificaciones por leer. ATENCION, no
realizar llamadas cada pocos segundos porque el servidor puede colapsarse, hacer llamadas
cada 1-2 minutos.
'''
def comprobarNotificaciones(request):
	if 'persona' in request.session:
		mi_session = request.session['persona'];
		total = -1
		notificacion = Notificacion.objects.all().filter(receptor=mi_session, leido=0)
		total = notificacion.count()
		if notificacion:
			return HttpResponse(total)
			
		return HttpResponse('-1')
	else:
		return HttpResponse('-1')





'''
Función que sirve para confirmar el email. Al registrarse un usuario, se le envía un email con 
un enlace, este enlace tiene un código. Cuando hace click en ese enlace le lleva a esta página
que comprobamos que el código exista. Y si existe lo confirmamos.
'''
def confirmarEmail(request, codigo):
	correcto = Usuario.objects.filter(codigo=codigo).count() > 0
	if correcto:
		usuario = Usuario.objects.get(codigo=codigo)
		usuario.confirmado = 1
		usuario.save()
		return HttpResponseRedirect('/')





'''
Función para crear lista. Comprovamos que no hayan escrito un nombre vacío. Si no lo es
comprobamos que no tengamos ya una lista con ese nombre. Si no la tenemos guardamos la lista y 
mediante JSON devolvemos el ID de la lista, un codigo que nos servirá para comprobar el estado 
de la petición AJAX, y el nombre de la lista. Para añadirla con jQuery a las existentes.
'''
def crearLista(request):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			yo = Usuario.objects.get(pk=mi_session);
			nombre = request.POST.get('nombre-lista', '')

			if nombre != '':

				try:
				    a = ListaReproduccion.objects.get(usuario=yo, nombre=nombre)
				    existe = True
				except ObjectDoesNotExist:
					existe = False

				if not existe:
					total = ListaReproduccion.objects.filter(usuario=yo).count()
					if total < 10:
						lista = ListaReproduccion(usuario=yo, nombre=nombre)
						lista.save()
						response = {'codigo': 1,'nombre': lista.nombre, 'id': lista.id}
						return HttpResponse(json.dumps(response), mimetype="application/json")
					else:
						return HttpResponse("-5")
				else:
					return HttpResponse("-4")
				
			else:
				return HttpResponse("-3")
		else:
			return HttpResponse("-2")
	else:
		return HttpResponse('-1')





'''
Función para eliminar a un usuario de tus amigos. Comprobamos que si el usuario esta
autentificado, si lo estas comprobamos que los dos son amigos, si lo son, borramos la
relación y redirigimos al usuario devuelta al perfil.
'''
def eliminarAmigo(request, user):
	if 'persona' in request.session:
		amigo = Usuario.objects.get(slug=user)
		yo = Usuario.objects.get(pk=request.session['persona'])
		url_perfil = '/perfil/%s' % (user)

		try:
		    amistad = Amigo.objects.get(usuario=yo, amigo=amigo)
		    exist_amistad = True
		except ObjectDoesNotExist:
			exist_amistad = False

		if exist_amistad:
			friend = Amigo.objects.get(usuario=yo, amigo=amigo)
			friend.delete()
			return HttpResponseRedirect(url_perfil)
		else:
			return HttpResponseRedirect(url_perfil)
	else:
		return HttpResponseRedirect('/login/')





'''
Función para eliminar una canción, primero comprobamos si el usuario esta
autentificado, si lo esta comprobamos que la cancion que se quiere eliminar 
sea propiedad del usuario logueado, si lo es la eliminamos, sino devolvemos 
un código de error.
'''
def eliminarCancion(request, id):
	if 'persona' in request.session:
		
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)
		
		try:
		    cancion = Cancion.objects.get(pk=id, autor=yo)
		    soy_propietario = True
		except ObjectDoesNotExist:
			soy_propietario = False


		if soy_propietario:
			cancion = Cancion.objects.get(pk=id, autor=yo)
			cancion.delete()
			return HttpResponseRedirect("/perfil/%s" % yo.slug)
		else:
			song = Cancion.objects.get(pk=id)
			compartida = CancionesCompartidas.objects.filter(usuario=yo, cancion=song)

			if compartida.count() > 0:
				compartida.delete()
				return HttpResponseRedirect("/perfil/%s" % yo.slug)
			else:
				raise Http404
		
	else:
		return HttpResponseRedirect('/login/')





'''
Función para enviar a jquery los datos de una canción, para que al abrirse el pop-up de editar, 
salgan por defecto los valores de esa canción, y no salga vacio. Utilizamos la variable "img",
porque si le pasamos cancion.imagen directamente a JSON, no lo reconoce porque lo detecta como
un objeto FileField, de esta forma le pasamos una variable de texto con la ruta.
'''
def getInfoCancion(request, id):
	if 'persona' in request.session:
		if request.method == 'POST' and request.is_ajax():
			yo = Usuario.objects.get(pk=request.session['persona'])

			try:
			    cancion = Cancion.objects.get(pk=id, autor=yo)
			    es_mia = True
			except ObjectDoesNotExist:
				es_mia = False


			
			resp = {'nombre': 'error'}
			if es_mia:
				img = "%s" % cancion.imagen
				resp = {'nombre': cancion.nombre,'foto': img, 'genero': cancion.genero}
				
			return HttpResponse(json.dumps(resp), mimetype="application/json")

		else:
			raise Http404
	else:
		return HttpResponseRedirect('/login/')	





'''
Vista que valida el IPN que nos envian desde Paypal. Hace todas las comprobaciones necesarias, y si
es correto, guarda todos los datos en la base de datos por si necesitamos consultarlos mas adelante,
y actualiza la información del usuario que ha comprado.
'''
@csrf_exempt
def ipn(request):
    NOTIFY_EMAIL = 'marcos@aguayo.es'
    #PP_URL = "https://www.paypal.com/cgi-bin/webscr"
    # sandbox url
    PP_URL = "https://www.sandbox.paypal.com/cgi-bin/webscr"
 
    # post back to paypal for verification
    parameters = request.POST.copy()
    parameters['cmd']='_notify-validate'
    params = urllib.urlencode(parameters)
    req = urllib2.Request(PP_URL, params)
    req.add_header("Content-type", "application/x-www-form-urlencoded")
    try:
        response = urllib2.urlopen(req)
    except urllib2.URLError:
        # Network problem. Responding with a HTTP 500 will make PayPal try again later
        return HttpResponseServerError("Error")
 
    # Does paypal think the IPN is legit?
    res = response.read().strip()
    if res == "INVALID":
        # fraud logic goes here
        send_mail('Fraudster', str(parameters), NOTIFY_EMAIL, [NOTIFY_EMAIL])
        return HttpResponse("")
    elif res == "":
        # Paypal aveces también puede contestar con un string
        return HttpResponseServerError("Error")
 
    # Ok, so we got a valid IPN message...
 
    status = parameters['payment_status']
    # Canceled_Reversal, Completed, Created, Denied, Expired, Failed, Pending, Refunded, Reversed, Processed, Voided
 
    if status in ['Pending', 'Completed']:
        # Give the payer the benefit of the doubt, and process pending payments (and completed ones, of course)
        # Get some vars from the request full list: http://bit.ly/12cQvlq
        txn_id = parameters['txn_id']
        amount = parameters['mc_gross']
        email = parameters['payer_email']
        option = parameters.get('option_selection1', None)
        articulo_id = parameters['item_number']

        pago = Paypal(
	        protection_eligibility = parameters['protection_eligibility'],
			last_name = parameters['last_name'],
			txn_id = parameters['txn_id'],
			receiver_email = parameters['receiver_email'],
			payment_status = parameters['payment_status'],
			payment_gross = parameters['payment_gross'],
			tax = parameters['tax'],
			residence_country = parameters['residence_country'],
			cmd = parameters['cmd'],
			address_state = parameters['address_state'],
			payer_status = parameters['payer_status'],
			txn_type = parameters['txn_type'],
			address_street = parameters['address_street'],
			handling_amount = parameters['handling_amount'],
			payment_date = parameters['payment_date'],
			first_name = parameters['first_name'],
			item_name = parameters['item_name'],
			address_country = parameters['address_country'],
			charset = parameters['charset'],
			custom = parameters['custom'],
			notify_version = parameters['notify_version'],
			address_name = parameters['address_name'],
			test_ipn = parameters['test_ipn'],
			item_number = parameters['item_number'],
			receiver_id = parameters['receiver_id'],
			transaction_subject = parameters['transaction_subject'],
			business = parameters['business'],
			payer_id = parameters['payer_id'],
			verify_sign = parameters['verify_sign'],
			address_zip = parameters['address_zip'],
			address_country_code = parameters['address_country_code'],
			address_city = parameters['address_city'],
			address_status = parameters['address_status'],
			mc_currency = parameters['mc_currency'],
			shipping = parameters['shipping'],
			payer_email = parameters['payer_email'],
			payment_type = parameters['payment_type'],
			mc_gross = parameters['mc_gross'],
			ipn_track_id = parameters['ipn_track_id'],
			quantity = parameters['quantity']
		)
        pago.save()

        cuenta = Cuenta.objects.get(pk=parameters['item_number'])
        user = Usuario.objects.get(email=parameters['custom'])

        user.tipo_cuenta = cuenta
        user.save()

 
    elif status in ['Denied', 'Failed', 'Reversed']:
        txn_id = parameters['txn_id']
        cuenta = Cuenta.objects.get(pk=1)
        user = Usuario.objects.get(email=parameters['custom'])
        user.tipo_cuenta = cuenta
        user.save()
    else:
        send_mail('Strange payment status - handle it manually', str(parameters), NOTIFY_EMAIL, [NOTIFY_EMAIL])
 
    return HttpResponse("Ok")





'''
Función para hacer logout, elimina la session del usuario y hace una redirección 
hacia el Login
'''
def logout(request):
	del request.session['persona']
	return HttpResponseRedirect('/login/')





'''
Función para hacer "me gusta". Comprueba que has iniciado sesión. Comprueba que no 
hayas puesto me gusta anteriormente, y su no lo has hecho lo guarda en la BD. Si no
es una canción tuya envía una notificación al propietario. Si ya has votado, elimina 
el me gusta.
'''
def meGustaCancion(request, cancion):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];

			yo = Usuario.objects.get(pk=mi_session);
			obj_cancion = Cancion.objects.get(pk=cancion)

			try:
			    votado = MeGustaCancion.objects.get(usuario=yo, cancion=obj_cancion)
			    ya_has_votado = True
			except ObjectDoesNotExist:
				ya_has_votado = False

			if not ya_has_votado:
				votar = MeGustaCancion(usuario=yo, cancion=obj_cancion)
				votar.save()
				if yo != obj_cancion.autor:
					notificacion = Notificaciones(obj_cancion.autor, yo)
					notificacion.nuevoLike(obj_cancion)

				return HttpResponse("1")
			else:
				votar = MeGustaCancion.objects.get(usuario=yo, cancion=obj_cancion)
				votar.delete()
				return HttpResponse("2")

		else:
			return HttpResponse("-1")
	else:
		return HttpResponse('-1')





'''
Función que devuelve los amigos mediante a jQuery para que los muestre.
Comprobamos que el usuario esta autentificado, si lo está cogemos todos sus
amigos, "renderizamos" el template con sus amigos, y se lo devolvemos a jQuery.
'''
def paginaAmigos(request, id):
	if 'persona' in request.session:
		perfil = Usuario.objects.get(pk=id)
		mi_session=request.session['persona'];
		friend_list = Amigo.objects.filter(usuario=perfil).values_list('amigo', flat=True)
		amigos =  Usuario.objects.filter(id__in=friend_list)

		if request.is_ajax():
			t = loader.get_template('amigos.html')
			c = Context({'amigos': amigos})
			html = t.render(c)
			return HttpResponse(html)
		else:
			raise Http404
		
	else:
		return HttpResponseRedirect('/login/')





'''
Vista para cargar la página de bsucar, esta pagina es llamada cuando el usuario hace click en ver mas
o pulsa intro enviando el formulario. Primero se comprueba que existe una session con el usuario, después
comprobamos que la keyword que nos ha pasado no es -1, este -1 viene de distinguir cuando nos envian algunas
palabra para buscar o simplemente quieren entrar en la página de Buscar y realizar la busqueda allí. Después
Realizamos una busqueda de la "keyword" que nos han enviado. Si no nos han enviado nada devolveremos diccionarios
vacios. Finalmente cargaremos la plantilla HTML.
'''
def paginaBuscar(request, keyword):
	if 'persona' in request.session:
		mi_session=request.session['persona'];
		yo = Usuario.objects.get(pk=mi_session)

		canciones = ''
		usuarios = ''
		comentarios = ''

		if keyword != '-1':
			canciones = Cancion.objects.filter(Q(nombre__contains=keyword) | Q(nombre__istartswith=keyword) | Q(nombre__iendswith=keyword))
			usuarios = Usuario.objects.filter(Q(nombre__contains=keyword) | Q(nombre__istartswith=keyword) | Q(nombre__iendswith=keyword))

			comentarios = Comentarios.objects.all().filter(cancion__in=canciones)

		informacion_general = infoAdicional(mi_session)
		recomendaciones = getAmigosRecomendados(mi_session, 3)
		diccionario = {
			'session': int(mi_session),
			'pagina': 7,
			'canciones': canciones,
			'usuarios': usuarios,
			'comentarios': comentarios,
			'recomendaciones': recomendaciones,
			'keyword': keyword
		}
		diccionario.update(informacion_general)

		return render_to_response('buscar-pagina.html', diccionario, context_instance = RequestContext(request))
	else:
		return HttpResponseRedirect('/login/')





'''
Función que devuelve los fans a jQuery para que los muestre. Comprobamos que el 
usuario esta autentificado, si lo está cogemos todos sus fans, "renderizamos" 
el template con sus amigos, y se lo devolvemos a jQuery.
'''
def paginaFans(request, id):
	if 'persona' in request.session:
		perfil = Usuario.objects.get(pk=id)
		mi_session=request.session['persona'];
		friend_list = Amigo.objects.filter(amigo=perfil).values_list('usuario', flat=True)
		amigos =  Usuario.objects.filter(id__in=friend_list)

		if request.is_ajax():
			t = loader.get_template('amigos.html')
			c = Context({'amigos': amigos})
			html = t.render(c)
			return HttpResponse(html)
		else:
			raise Http404

	else:
		return HttpResponseRedirect('/login/')





'''
Función para publicar un comentario en una canción.
'''
def publicarComentario(request):
	if 'persona' in request.session:
		mi_session = request.session['persona'];
		if request.method == "POST" and request.is_ajax():
			texto = request.POST.get('texto-comentario', '-3')
			cancion_id = request.POST.get('id-cancion-comentario', '-5')
			cancion = Cancion.objects.get(pk=cancion_id)
			usuario = Usuario.objects.get(pk=mi_session)
			if texto != "-3" and len(texto) <= 220 and texto != "":
				if cancion_id != '-5' :
					comentario = Comentarios(cancion=cancion, usuario=usuario, comentario=texto)
					comentario.save()
					if usuario != cancion.autor:
						txt = u'%s ha comentado en tu canción "%s": %s' % (usuario.nombre, cancion.nombre, texto)
						notificacion = Notificaciones(cancion.autor, usuario)
						notificacion.nuevoComentario(cancion, txt)

					resp = {
						'id_comentario': comentario.id,
						'nombre': comentario.usuario.nombre,
						'foto': '%s' % comentario.usuario.imagen, 
						'comentario': comentario.comentario,
						'slug': comentario.usuario.slug
					}
					return HttpResponse(json.dumps(resp), mimetype="application/json")
				else:
					return HttpResponse("-6")
			else:
				return HttpResponse("-4")
		else:
			return HttpResponse("-2")
	else:
		return HttpResponse('-1')





'''
Función que te envía un email para que puedas recuperar la contraseña, cada vez
que lo haces, el sistema calcula 24h apartir de ese momento para que los emails 
de verificación solo tengan una validez de 1 día por seguridad.
'''
def recuperarPassword(request):
	email = request.POST.get('recuperar-email', '')
	codigo_aleatorio = randomString(50)
	hoy = datetime.datetime.now()

	if email != '':
		try:
		    usuario = Usuario.objects.get(email=email)
		    existe = True
		except ObjectDoesNotExist:
			existe = False

		if existe:
			usuario.codigo = codigo_aleatorio
			usuario.validez = hoy + datetime.timedelta(days=1)
			usuario.save()
			notificacion = Notificaciones(usuario)
			notificacion.recuperarPass()
			return HttpResponse("1")





'''
Función que se llama cuando el usuario ha hecho click en el enlace de su email que le 
decia de cambiar su contraseña. Aquí comprobamos que el código aun sigue válido porque
tiene una duración de 24h.
'''
def recuperarPasswordCambiar(request, codigo):
	if request.method == 'POST':
		hoy = datetime.datetime.now()
		hoy = t.mktime(hoy.timetuple())
		email = request.POST.get('email', '')
		password = request.POST.get('password', '')
		password2 = request.POST.get('password2', '')
		len_pass = len(password)

		if email != '':
			try:
			    usuario = Usuario.objects.get(email=email, codigo=codigo)
			    correcto = True
			except ObjectDoesNotExist:
				correcto = False

			if correcto and password != '' and password == password2 and len_pass >=8 and len_pass <= 12:
				max_time = usuario.validez
				max_time = t.mktime(max_time.timetuple())
				if max_time > hoy:
					usuario.password = encriptarString(password)
					usuario.codigo = randomString(30)
					usuario.save()
					return HttpResponse("1")
				else:
					return HttpResponse("-5")
			else:
				if password != password2: return HttpResponse("-4")
				if len_pass<8 or len_pass>12: return HttpResponse("-3")
				return HttpResponse("-2")
		else:
			return HttpResponse("-1")

	else:
		return render_to_response('recuperar-password.html', {'codigo': codigo}, context_instance = RequestContext(request))





'''
Función para sumar una reproducción a una canción. Se le llama vía AJAX para no interrumpir la reproducción.
Se comprueba que el usuario esta logueado, si lo esta se comprueba que ha sido vía AJAX y POST, y después se
comprueba que ese usuario no ha escuchado ya esta canción en los últimos 30 minutos, asi reducimos las opciones
de engañar al sistema.
'''
def sumarReproduccion(request, id):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			yo = Usuario.objects.get(pk=mi_session);
			
			cancion = Cancion.objects.get(pk=id)
			repro = Reproducciones(usuario=yo, cancion=cancion)
			repro.save()

			return HttpResponse('1')
		else:
			return HttpResponse("-2")
	else:
		return HttpResponse('-1')





'''
Función para ver una conversación que hayamos tenido o estemos teniendo con
un usuario, hay que ser amigo del usuario para mantener una conversacion.
'''
def verMensaje(request, id):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			yo = Usuario.objects.get(pk=mi_session);
			conversante = Usuario.objects.get(pk=id)

			mensajes = Mensaje.objects.all().filter((Q(destinatario=yo)|Q(destinatario=conversante)) & (Q(usuario=yo)|Q(usuario=conversante)))
			#mensajes = Mensaje.objects.all().filter(destinatario=yo)

			t = loader.get_template('single-mensajes.html')
			c = Context({'mensajes': mensajes})
			html = t.render(c)
			return HttpResponse(html)

		else:
			return HttpResponse("-2")
	else:
		return HttpResponse('-1')





'''
Función que se llama cuando el usuario puntua un perfil, en el sidebar con las estrellas, esta 
función mira si el usuario ha votado o no ese perfil, si lo ha votado devuelve un código de error.
Si aún no lo ha votado, comprueba que la puntuación va de 1 a 10 y si es así lo guarda en la DB.
'''
def votarPerfil(request, n1, n2):
	if 'persona' in request.session:
		if request.method == "POST" and request.is_ajax():
			mi_session = request.session['persona'];
			yo = Usuario.objects.get(pk=mi_session);
			perfil = Usuario.objects.get(pk=n1)
			has_votado = Puntos.objects.all().filter(usuario=yo, perfil=perfil).count()

			if int(n2) <= 10 and int(n2) > 0 and has_votado == 0:
				puntuar = Puntos(usuario=yo, perfil=perfil, puntos=n2)
				puntuar.save()
				return HttpResponse('1')
			else:
				return HttpResponse("-3")

		else:
			return HttpResponse("-2")
	else:
		return HttpResponse('-1')

