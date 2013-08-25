from main.models import MeGustaCancion, Cancion, Comentarios
from django import template
from django.template import RequestContext, loader, Context, Template
from django.core.exceptions import ObjectDoesNotExist
import datetime

register = template.Library()
 
@register.simple_tag
def isLiked(id, persona):
	per = str(persona)
	sng = str(id)
	try:
	    votado = MeGustaCancion.objects.get(usuario=per, cancion=sng)
	    liked = "active"
	except ObjectDoesNotExist:
		liked = ""
	return liked

@register.simple_tag
def secondsToTime(seg):
	m, s = divmod(seg, 60)
	h, m = divmod(m, 60)
	tiempo = "%02d:%02d" % (m, s)
	return tiempo
	
@register.simple_tag
def segundosToHoras(seg):
	m, s = divmod(seg, 60)
	h, m = divmod(m, 60)
	tiempo = "%02d:%02d" % (h, m)
	if seg > 20000: tiempo = '&infin;'
	return tiempo

@register.simple_tag
def numCancionesLista(l1, l2):
	contador = 0
	for li_can in l2:
		if l1.id == li_can.lista.id: contador +=1

	if contador >= 3: 
		return "animacion"
	else:
		return " "

@register.simple_tag
def noHayCanciones(l1, l2):
	contador = 0
	for li_can in l2:
		if l1.id == li_can.lista.id: contador +=1

	if contador == 0: 
		return '<img src="http://disoner.com/static/img/lista-vacia.jpg"/>'
	else:
		return ""

@register.simple_tag
def comentariosCancion(id, yo):
	song = Cancion.objects.get(pk=id)
	comentarios = Comentarios.objects.all().filter(cancion=song)
	t = loader.get_template('comentarios.html')
	c = Context({'comentarios': comentarios, 'yo': yo})
	html = t.render(c)
	return html

