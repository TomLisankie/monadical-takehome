import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .game_logic import check_for_win
from .models import Game, Player
import random

BOARD_SIZE = 7

def random_side():
    choices = [True, False]
    return random.choice(choices)

def random_row():
    choices = range(0, 6)
    return random.choice(choices)


class GameConsumer(WebsocketConsumer):
    board = None
    turn = False
    player = None
    piece = None
    won = False
    game_id = None

    def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.game_group_name = "group_" + self.game_id

        async_to_sync(self.channel_layer.group_add)(self.game_group_name, self.channel_name)

        self.accept()

    def handle_possible_win(self):
        if check_for_win(self.board.copy()):
            print("~~~~~~~~~~~~~A player has won~~~~~~~~~~~~~~~")
            current_game = Game.objects.get(uuid=self.game_id)
            current_game.won = True
            current_game.winner = self.player
            self.player.wins += 1;
            self.player.save()
            async_to_sync(self.channel_layer.group_send)(
                self.game_group_name,
                {
                    "type" : "game_won",
                    "winner" : str(self.player)
                }
            )
            return True

    def update_board_with_random_move_by_bot(side, row):
        left = True
        right = False
        new_row = ["O"]
        row_list = self.board[row]
        if side == left:
            index_to_leave = 0
            while row_list[index_to_leave]:
                index_to_leave += 1
                if index_to_leave == BOARD_SIZE:
                    update_board_with_random_move_by_bot(random_side(), random_row())
            for i in range(0, len(row_list)):
                if i != index_to_leave:
                    new_row.append(row_list[i])
                else: #juan@monadical.com

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if "perma_cookie" in text_data_json:
            self.player = Player.objects.get(perma_cookie=text_data_json["perma_cookie"])

        self.board = text_data_json["updated_board"]

        async_to_sync(self.channel_layer.group_send)(
            self.game_group_name,
            {
                "type" : "game_state_update",
                "updated_board" : self.board,
                "updated_turn" : not self.turn
            }
        )

        if not self.handle_possible_win():
            # add logic for bot
            side = random_side()
            row = random_row()
            self.update_board_with_random_move_by_bot(side, row)
            pass
        else:
            # no bot logic

    def game_state_update(self, event):
        self.board = event["updated_board"]
        self.turn = event["updated_turn"]
        self.send(text_data=json.dumps(event))

    def game_won(self, event):
        self.won = True
        self.send(text_data=json.dumps(event))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.game_group_name, self.channel_name)
        print("Disconnected with code: " + str(close_code))
