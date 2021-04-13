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
    solo = False

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
            if not self.solo:
                current_game.winner = self.player
                self.player.wins += 1;
            self.player.save()
            async_to_sync(self.channel_layer.group_send)(
                self.game_group_name,
                {
                    "type" : "game_won",
                    "winner" : str(current_game.winner)
                }
            )
            return True
        return False

    def update_board_with_random_move_by_bot(self, side, row):
        left = True
        right = False
        new_row = ["O"]
        row_list = self.board[row]
        if side == left:
            index_to_leave = 0
            while row_list[index_to_leave] != "___":
                index_to_leave += 1
                if index_to_leave == BOARD_SIZE:
                    self.update_board_with_random_move_by_bot(random_side(), random_row())
                    return
            for i in range(0, len(row_list)):
                if i != index_to_leave:
                    new_row.append(row_list[i])
        else:
            index_to_leave = BOARD_SIZE - 1
            while row_list[index_to_leave] != "___":
                index_to_leave -= 1
                if index_to_leave < 0:
                    self.update_board_with_random_move_by_bot(random_side(), random_row())
                    return
            row_range = list(range(0, BOARD_SIZE))
            row_range.reverse()
            for i in row_range:
                if i != index_to_leave:
                    piece = row_list.pop(i)
                    new_row.insert(0, piece)
        self.board[row] = new_row
        self.handle_possible_win()


    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if "perma_cookie" in text_data_json:
            self.player = Player.objects.get(perma_cookie=text_data_json["perma_cookie"])
            self.solo = text_data_json["solo"]

        self.board = text_data_json["updated_board"]

        if self.solo:
            if not self.handle_possible_win():
                # if there wasn't a win, the bot will make a move
                side = random_side()
                row = random_row()
                self.update_board_with_random_move_by_bot(side, row)
                async_to_sync(self.channel_layer.group_send)(
                    self.game_group_name,
                    {
                        "type" : "game_state_update",
                        "sender_channel_name" : self.channel_name,
                        "updated_board" : self.board,
                        "updated_turn" : not self.turn
                    }
                )
            else:
                print("No winner yet")
        else:
            async_to_sync(self.channel_layer.group_send)(
                self.game_group_name,
                {
                    "type" : "game_state_update",
                    "updated_board" : self.board,
                    "updated_turn" : not self.turn
                }
            )
            self.handle_possible_win()

    def game_state_update(self, event):
        self.board = event["updated_board"]
        if not self.solo:
            self.turn = event["updated_turn"]
        self.send(text_data=json.dumps(event))
        # if self.channel_name != event["sender_channel_name"]:

    def game_won(self, event):
        self.won = True
        self.send(text_data=json.dumps(event))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.game_group_name, self.channel_name)
        print("Disconnected with code: " + str(close_code))
