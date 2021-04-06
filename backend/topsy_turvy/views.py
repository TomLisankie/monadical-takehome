from django.shortcuts import render
from django.http import HttpResponse
from uuid import uuid4
from .models import Player, Game

# Create your views here.
def index(request):
    return HttpResponse("Hey, welcome to the Topsy Turvy game!\n")

def new_player_id(request):
    # Generate new uuid4
    player_id = str(uuid4())
    # Add new player to db
    player = Player(uuid=player_id)
    player.save()
    # return the uuid generated earlier
    return HttpResponse(player_id)

def new_game_id(request):
    # Generate new uuid
    game_id = str(uuid4())
    # Add new game to the db
    game = Game(uuid=game_id, player_1=None, player_2=None, winner=None)
    game.save()
    # return the uuid from earlier
    return HttpResponse(game_id)
