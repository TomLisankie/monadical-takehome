import json
from channels.generic.websocket import WebsocketConsumer

class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        self.send(text_data=json.dumps({
            'json_received' : text_data_json
        }))

    def disconnect(self, close_code):
        pass
