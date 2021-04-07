# Topsy-Turvy Game

## Why is it called Topsy-Turvy?
The game is just Connect4 if you rotated it 90 degrees and laid it down flat instead of having it stand upright (aka, no gravity involved). So it's basically "disoriented Connect4".

## What's the stack?
- Django (with Django Channels for WebSocket communication and SQLite for the relational database)
- Redis (for dealing with channel layer groups in Django Channels)
- React on the frontend

## How can I install and run it?
- Make sure you have Python >=3.8 installed. Then install the required packages by running `pip install -r backend/requirements.txt`.
- Make sure you have Redis installed and running on port 6379.
- Navigate into `./backend` and run `python manage.py makemigrations`, `python manage.py migrate`, and `python manage.py runserver` to start the Django server.
- Open a separate shell window/tab in the current directory and navigate to `./frontend`. Run `npm i` to install all JS dependencies.
- Run `npm run start`. This should open the game in a browser tab. Then, to play against yourself, open a separate window/tab and start playing!
