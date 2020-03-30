
# TS3 web troller

A web interface to troll your friends in your teamspeak server
## Installation
**highly recommended to run on the same server of ts3 one**


1) Clone the repository to your server
2) Setup a `.env` file with:
```
PORT=3000
```
3) `npm start` to run the server


## How to get an apikey for teamspeak server

0) if you are running a ts3server from zero the initial setup will give you the serveradmin api key i suggest to not use it for security reasons


1) TS3 server must have been started with the following parameters to enable the http(s) requests `query_protocols=raw,ssh,http,https`
```
./ts3server query_protocols=raw,ssh,http,https
```
2) connect to the server through Telnet or ssh: `ssh -p 10022 <user>@<host>`
and run these commands to create and apikey:
```
use <yourVirtualServerID>
apikeyadd scope=manage lifetime=0
```
this command will return the apikey (unlimited lifetime)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
