from django.db import models

class Player(models.Model):
    uuid = models.CharField(max_length=36, unique=True, primary_key=True)
    wins = models.PositiveIntegerField(default=0)
    def __str__(self):
        return self.uuid

class Game(models.Model):
    uuid = models.CharField(max_length=36, unique=True, primary_key=True)
    player_1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="first_player", null=True)
    player_2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="second_player", null=True)
    winner = models.ForeignKey(Player, on_delete=models.CASCADE, null=True)
    won = models.BooleanField(default=False)
    def __str__(self):
        return self.uuid
