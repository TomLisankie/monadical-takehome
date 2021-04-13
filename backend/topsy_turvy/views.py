from django.shortcuts import render
from django.http import HttpResponse
from uuid import uuid4
from .models import Player, Game
import json
from django.views.decorators.csrf import csrf_exempt
import hashlib

# def index(request):
#     return render(request, "index.html", {})
#     # return HttpResponse("Hey, welcome to the Topsy Turvy game!\n")

def new_player(request):
    # Make a new player
    player = Player()
    player.username = json.loads(request.body)["username"]
    player.email = json.loads(request.body)["email"]
    player_password_plain_text = json.loads(request.body)["password"]
    player.password = hashlib.md5(player_password_plain_text.encode()).hexdigest()
    # Give that player a perma-cookie
    player.perma_cookie = str(uuid4())
    player.save()
    # return the uuid generated earlier in a stringified JSON object
    perma_cookie_payload = {"perma_cookie" : player.perma_cookie}
    return HttpResponse(json.dumps(perma_cookie_payload))

def log_in_player(request):
    player_username = json.loads(request.body)["username"]
    player_password_plain_text = json.loads(request.body)["password"]
    player_password = hashlib.md5(player_password_plain_text.encode()).hexdigest()
    try:
        player = Player.objects.get(username=player_username)
        if player.password == player_password:
            return HttpResponse(json.dumps({"perma_cookie" : player.perma_cookie}))
        else:
            return HttpResponse(json.dumps({"error" : "Wrong password"}))
    except:
        return HttpResponse(json.dumps({"error" : "User doesn't exist"}))

def get_player_info(request):
    included_perma_cookie = json.loads(request.body)["perma_cookie"]
    player = Player.objects.get(perma_cookie=included_perma_cookie)
    player_payload = {
        "username" : player.username,
        "email" : player.email,
        "wins" : player.wins
    }
    return HttpResponse(json.dumps(player_payload))

def new_game_id(request):
    # Look for games that need a player
    needs_a_player = Game.objects.filter(player_2=None)
    request_data = json.loads(request.body)


    if request_data["solo"]:
        game_id = str(uuid4())
        game = Game(uuid=game_id)
        player_perma_cookie = request_data["perma_cookie"]
        player = Player.object.get(perma_cookie=player_perma_cookie)
        game.player_1 = player
        game.player_2 = player
        game.save()
        game_id_payload = {"id" : str(game), "piece" : "X"}
        return HttpResponse(json.dumps(game_id_payload))

    if len(needs_a_player) != 0:
        game = needs_a_player[0]
        player_2_perma_cookie = request_data["perma_cookie"]
        player_2 = Player.objects.get(perma_cookie=player_2_perma_cookie)
        game.player_2 = player_2
        game.save()
        game_id_payload = {"id" : str(needs_a_player[0]), "piece" : "O"}
        return HttpResponse(json.dumps(game_id_payload))
    else:
        # Generate new uuid
        game_id = str(uuid4())
        # Add new game to the db
        game = Game(uuid=game_id)
        player_1_perma_cookie = request_data["perma_cookie"]
        player_1 = Player.objects.get(perma_cookie=player_1_perma_cookie)
        game.player_1 = player_1
        game.save()
        # return the uuid from earlier
        game_id_payload = {"id" : str(game), "piece" : "X"}
        return HttpResponse(json.dumps(game_id_payload))
