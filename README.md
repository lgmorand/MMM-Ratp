# MMM-Ratp

## Presentation

Local transport in Paris module for MagicMirror², a projet created by Michael Teeuw ([https://github.com/MichMich/MagicMirror](https://github.com/MichMich/MagicMirror))
This module is working thanks to the great help of [fewieden](https://github.com/fewieden)

This module gives and displays the timetable of the next bus/rer/metro of the station of your choice

![demo](https://raw.githubusercontent.com/lgmorand/MMM-Ratp/master/screenshots/ratp.png)

### /!\ Warning

This module uses some features of Magic Mirror like getHeader() and thus require a recent version of Magic Mirror (January 2017). Please update your Magic Mirror to ensure the module is fully working. Behavior in case of bad version is the header of the module remaining static.

## RATP OpenData

A law was voted to force public companies to open some of their data to the public. If the RATP opened their data for years, some data like real-time timetable are not avaiable for the moment (they may arrive during 2017 (source RATP)).
Until then, the only way to get real time data is to parse the RATP WAP website. A french developer (Pierre Grimaud) developed a custom API to interrogate this WAP website in a easy way.

The API is available here and this module is based on this API: [http://api-ratp.pierre-grimaud.fr](http://api-ratp.pierre-grimaud.fr)

## Installation

Clone the git in the /modules folder of Magic Mirror, go in the module folder and run the "npm install" command. Declare and configure the module in the file config.js of Magic Mirror.

## Configuration

To get bus timetable, you'll need to specify the transport line, the station and the destination. These information will have to be specified in the configuration ([https://github.com/lgmorand/MMM-Ratp/blob/master/MMM-Ratp.js#L14-L23](https://github.com/lgmorand/MMM-Ratp/blob/master/MMM-Ratp.js#L14-L23))

First you need to specify which kind of line of transport you want to retrieve. You can have:

- Bus (transporttype: bus, [bus lines](http://api-ratp.pierre-grimaud.fr/v2/bus/))
- RER (transporttype: rers, [RER lines](http://api-ratp.pierre-grimaud.fr/v2/rers/))
- Metro (metros, [metros lines](http://api-ratp.pierre-grimaud.fr/v2/metros/))
- Noctilien (noctilien, [noctilien lines](http://api-ratp.pierre-grimaud.fr/v2/noctiliens/))
- Tramway (tramways, [tramways lines](http://api-ratp.pierre-grimaud.fr/v2/tramways/))

Each URL listed before will help you to get the type of the desired line, the ID of the line and even the direction which will be used to build the API URL

Then, you must find the station you want to watch out. You need to find your line API and suffix the URL with the "stations" keyword: [http://api-ratp.pierre-grimaud.fr/v2/[TRANSPORT TYPE]/[TRANSPORT LINE]/stations](http://api-ratp.pierre-grimaud.fr/v2/[TRANSPORT TYPE]/[TRANSPORT LINE]/stations)

Example: [http://api-ratp.pierre-grimaud.fr/v2/bus/176/stations](http://api-ratp.pierre-grimaud.fr/v2/bus/176/stations)

The final configuration should look like this

``` javascript
{
     module: 'MMM-Ratp',
     position: 'top_right',
     header: 'RATP', // please leave this value, it will be replaced anyway
     config:{
         apiURL:'http://api-ratp.pierre-grimaud.fr/v2/bus/176/stations/5138?destination=pont+de+neuilly', // more info about API documentation : https://github.com/pgrimaud/horaires-ratp-api
        }
}
```

## Screenshot

Here are some screenshots

![demo](https://raw.githubusercontent.com/lgmorand/MMM-Ratp/master/screenshots/ratp.png)

## Further information and support

Please use the forum of magic mirror² [https://forum.magicmirror.builders/](https://forum.magicmirror.builders/)

## Troubleshooting

The first thing to do in to set a debbuging setting in the config file because it will enable more verbose trace. Ensure that any setting is followed by a comma (that's the common mistake with Magic Mirror²)

``` javascript
{
     module: 'MMM-Ratp',
     position: 'top_right',
     header: 'RATP' // please leave this value, it will be replaced anyway,
     config:{
         debugging:true,
         apiURL:'http://api-ratp.pierre-grimaud.fr/v2/bus/176/stations/5138?destination=pont+de+neuilly',
        }
}
```

### My module displays: "loading connections..."

After few seconds (refresh is made every 60 sec), the module will contact an api and then load the data. In case the loading fails, then the message "loading connections" remains present. The first thing to try is to open the URL of the API in your browser and see if a JSON response is diplayed. If not, your issue if here. If yes, please contact me on the forum and I'll try to help you.