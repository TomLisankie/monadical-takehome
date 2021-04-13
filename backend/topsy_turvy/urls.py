from django.urls import path

from . import views

urlpatterns = [
    # path("", views.index, name="index"),
    path("api/player/sign-up", views.new_player, name="sign up a new player"),
    path("api/player/log-in", views.log_in_player, name="log in an existing player"),
    path("api/player/get-info", views.get_player_info, name="get info about a particular player"),
    path("api/game/retrieve-id", views.new_game_id, name="get new game ID")
]
