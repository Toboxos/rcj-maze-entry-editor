# RoboCup Junior Maze Entry Editor
This is a tool which allows to plan and operate one or more RoboCup Junior Maze Entry competitions.

# Usage
## Server
Execute ```npm run create-database``` first to create an empty database.
After that start the server by ```npm run server```. 
The server listens to port 5001 on default. You can change this in ```server/server.js```

## Client
First create a .env.local file with following entry:
````
VITE_API_URL=http://localhost:5001
````
Change the url so it points to the server.

Start the webserver by running ```npm run dev```.