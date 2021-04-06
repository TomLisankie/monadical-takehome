from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("player/new", views.new_player_id, name="get new player ID"),
    path("game/retrieve-id", views.new_game_id, name="get new game ID")
]
