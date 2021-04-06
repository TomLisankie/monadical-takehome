import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class GameConsumer(WebsocketConsumer):
    x = 0
    def connect(self):
        game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.game_group_name = "group_" + game_id

        async_to_sync(self.channel_layer.group_add)(self.game_group_name, self.channel_name)

        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        self.x += 1
        self.send(text_data=json.dumps(text_data_json))
        async_to_sync(self.channel_layer.group_send)(
            self.game_group_name,
            {
                "type" : "game_board_update",
                "updated_board" : [["x"]]
            }
        )

    def game_board_update(self, event):
        updated_board = event["updated_board"]
        updated_board.append(["x"])
        print(updated_board)

        self.send(text_data=json.dumps(updated_board))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.game_group_name, self.channel_name)
        print("Disconnected with code: " + str(close_code))
