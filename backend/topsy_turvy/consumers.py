import json
from channels.generic.websocket import WebsocketConsumer

class GameConsumer(WebsocketConsumer):
    x = 0
    def connect(self):
        game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        self.x += 1
        self.send(text_data=json.dumps({
            'x' : self.x
        }))

    def disconnect(self, close_code):
        print("Disconnected with code: " + str(close_code))
