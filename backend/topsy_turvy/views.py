from django.shortcuts import render
from django.http import HttpResponse
from uuid import uuid4
from .models import Player, Game
import json
from django.views.decorators.csrf import csrf_exempt

# def index(request):
#     return render(request, "index.html", {})
#     # return HttpResponse("Hey, welcome to the Topsy Turvy game!\n")

def new_player_id(request):
    # Generate new uuid4
    player_id = str(uuid4())
    # Add new player to db
    player = Player(uuid=player_id)
    player.save()
    # return the uuid generated earlier in a stringified JSON object
    id_payload = {"id" : player_id}
    return HttpResponse(json.dumps(id_payload))

def new_game_id(request):
    # Look for games that need a player
    needs_a_player = Game.objects.filter(player_2=None)
    if len(needs_a_player) != 0:
        game = needs_a_player[0]
        player_2_id = json.loads(request.body)["player_id"]
        player_2 = Player.objects.get(uuid=player_2_id)
        game.player_2 = player_2
        game.save()
        game_id_payload = {"id" : str(needs_a_player[0]), "piece" : "O"}
        return HttpResponse(json.dumps(game_id_payload))
    else:
        # Generate new uuid
        game_id = str(uuid4())
        # Add new game to the db
        game = Game(uuid=game_id)
        player_1_id = json.loads(request.body)["player_id"]
        player_1 = Player.objects.get(uuid=player_1_id)
        game.player_1 = player_1
        game.save()
        # return the uuid from earlier
        game_id_payload = {"id" : str(game), "piece" : "X"}
        return HttpResponse(json.dumps(game_id_payload))
