# -*- coding: utf-8 -*-
'''
    Autor: Marcos Aguayo y Xavi Güell
    Fecha de inicio: 10/04/2013
    Fecha de finalización: 01/06/2013
    Objetivo: Fichero que contiene las rutas de la aplicación.
'''

from django.conf.urls import patterns, include, url


handler404 = 'main.views.pagina404'
handler500 = 'main.views.pagina404'

# URLS LÓGICAS Y AJAX
urlpatterns = patterns('',
    url(r'^add-cancion/$', 'main.ajax.addCancion', name="addCancion"),
    url(r'^add-foto-cancion/', 'main.ajax.addFotoCancion', name="addFotoCancion"),
    url(r'^add-info/$', 'main.ajax.addInfoCancion', name="addInfoCancion"),
    url(r'^add_user_ajax/$', 'main.ajax.agregarUsuarioAJAX', name="agregarUsuarioAJAX" ),
    url(r'^agregar/(?P<user>[-\w ]+)/', 'main.ajax.agregarAmigo', name="agregarAmigo"),
    url(r'^amigos/(?P<id>\w+)/', 'main.ajax.paginaAmigos', name="paginaAmigos"),
    url(r'^auth/$', 'main.ajax.auth', name='auth'),
    url(r'^borrar-cancion/(?P<id>\w+)/', 'main.ajax.eliminarCancion', name="eliminarCancion"),
    url(r'^borrar-comentario/(?P<id>\w+)/', 'main.ajax.borrarComentario', name="borrarComentario"),
    url(r'^borrar-lista/(?P<id>\w+)/', 'main.ajax.borrarLista', name="borrarLista"),
    url(r'^buscar/$', 'main.ajax.buscar', name='buscar'),
    url(r'^buscar-usuarios/$', 'main.ajax.buscadorUsuarios', name='buscadorUsuarios'),
    url(r'^cambiar-foto/$', 'main.ajax.cambiarFotoPerfil', name="cambiarFotoPerfil"),
    url(r'^cancion(?P<n1>\w+)/lista(?P<n2>\w+)/', 'main.ajax.addCancionLista', name="addCancionLista"),
    url(r'^cargar-canciones/(?P<id>\w+)/(?P<n1>\w+)/(?P<n2>\w+)/', 'main.ajax.cargarCancionesAJAX', name="cargarCancionesAJAX"),
    url(r'^cargar-listas/', 'main.ajax.cargarListas', name="cargarListas"),
    url(r'^cargar-mensajes/', 'main.ajax.cargarMensajes', name="cargarMensajes"),
    url(r'^compartir-cancion/(?P<cancion>\w+)/', 'main.ajax.compartirCancion', name="compartirCancion"),
    url(r'^comprobar-notificaciones/', 'main.ajax.comprobarNotificaciones', name="comprobarNotificaciones"),
    url(r'^confirmar/(?P<codigo>[-\w ]+)', 'main.ajax.confirmarEmail', name="confirmarEmail"),
    url(r'^crear-lista/', 'main.ajax.crearLista', name="crearLista"),
    url(r'^editar-cancion/(?P<id>\w+)/', 'main.ajax.getInfoCancion', name="getInfoCancion"),
    url(r'^eliminar/(?P<user>[-\w ]+)/', 'main.ajax.eliminarAmigo', name="eliminarAmigo"),
    url(r'^enviar-nuevo-mensajes/', 'main.ajax.addMensaje', name="addMensaje"),
    url(r'^fans/(?P<id>\w+)/', 'main.ajax.paginaFans', name="paginaFans"),
    url(r'^ipn/paypal/disoner/15/', 'main.ajax.ipn', name="ipn"),
    url(r'^logout/$', 'main.ajax.logout', name='logout'),
    url(r'^me-gusta/(?P<cancion>\w+)/', 'main.ajax.meGustaCancion', name="meGustaCancion"),
    url(r'^publicar-comentario/', 'main.ajax.publicarComentario', name="publicarComentario"),
    url(r'^recuperar-password/$', 'main.ajax.recuperarPassword', name="recuperarPassword"),
    url(r'^recuperar-password/(?P<codigo>[-\w ]+)', 'main.ajax.recuperarPasswordCambiar', name="recuperarPasswordCambiar"),
    url(r'^sumar-reproduccion/(?P<id>\w+)/', 'main.ajax.sumarReproduccion', name="sumarReproduccion"),
    url(r'^ver-conversacion/(?P<id>\w+)/', 'main.ajax.verMensaje', name="verMensaje"),
    url(r'^votar/(?P<n1>\w+)/(?P<n2>\w+)/', 'main.ajax.votarPerfil', name="votarPerfil")
)


# URLS PARA CARGAR LAS PÁGINAS
urlpatterns += patterns('',
    url(r'^$', 'main.views.home', name='home'),
    url(r'^404/', 'main.views.pagina404', name="pagina404"),
    url(r'^aviso-legal/', 'main.views.paginaAvisoLegal', name="paginaAvisoLegal"),
    url(r'^bienvenido/', 'main.views.paginaBienvenido', name="paginaBienvenido"),
    url(r'^buscar/(?P<keyword>[-\w ]+)/$', 'main.views.paginaBuscar', name='paginaBuscar'),
    url(r'^cancion/(?P<id>\w+)/', 'main.views.paginaCancion', name="paginaCancion"),
    url(r'^descubre/$', 'main.views.paginaDescrubre', name="paginaDescrubre"),
    url(r'^descubre/(?P<string>[-\w ]+)/$', 'main.views.paginaDescrubreTag', name="paginaDescrubreTag"),
    url(r'^editar-perfil/$', 'main.views.editarPerfil', name="editarPerfil"),
    url(r'^editar-privacidad/$', 'main.views.paginaEditarPrivacidad', name="paginaEditarPrivacidad"),
    url(r'^faq/', 'main.views.paginaFAQ', name="paginaFAQ"),
    url(r'^listas-reproduccion/$', 'main.views.paginaListasReproduccion', name='paginaListasReproduccion'),
    url(r'^listas-reproduccion/(?P<id>\w+)/$', 'main.views.paginaListasReproduccionSingle', name='paginaListasReproduccionSingle'),
    url(r'^login/$', 'main.views.login', name='login'),
    url(r'^notificaciones/', 'main.views.paginaNotificaciones', name="paginaNotificaciones"),
    url(r'^perfil/(?P<user>[-\w ]+)/', 'main.views.perfil', name="perfil"),
    url(r'^politica-privacidad/', 'main.views.paginaPoliticaPrivacidad', name="paginaPoliticaPrivacidad"),
    url(r'^premium/', 'main.views.paginaPremium', name="paginaPremium"),
    url(r'^ranking/$', 'main.views.paginaRanking', name="paginaRanking"),
    url(r'^ranking/(?P<genero>[-\w ]+)/$', 'main.views.paginaRankingGenero', name="paginaRankingGenero"),
    url(r'^sugerir-amigos/', 'main.views.paginaSugerirAmigos', name="paginaSugerirAmigos"),
) 