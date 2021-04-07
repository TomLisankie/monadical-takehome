import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .game_logic import check_for_win

class GameConsumer(WebsocketConsumer):
    board = None
    turn = False
    player_id = None
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
            current_game = Game.objects.get(uuid=self.game_id)
            current_game.won = True
            current_game.winner = self.player_id
            async_to_sync(self.channel_layer.group_send)(
                self.game_group_name,
                {
                    "type" : "game_won",
                    "winner" : str(player_id)
                }
            )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)

        self.board = text_data_json["updated_board"]
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
        self.turn = event["updated_turn"]
        self.send(text_data=json.dumps(event))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.game_group_name, self.channel_name)
        print("Disconnected with code: " + str(close_code))
