# MMM-Ratp
Local transport in Paris module for MagicMirror², a projet created by Michael Teeuw (https://github.com/MichMich/MagicMirror)

It will give the timetable of the next bus/rer/metro of the station of your choice


# RATP OpenData 

A law was voted to force public companies to open some of their data to the public. If the RATP opened their data for years, some data like real-time timetable are not avaiable for the moment (they may arrive during 2017 (source RATP)).
Until then, the only way to get real time data is to parse the RATP WAP website. A french developer (Pierre Grimaud) developed a custom API to interrogate this WAP website in a easy way.

The API is available here and this module is based on this API: http://api-ratp.pierre-grimaud.fr


# Installation 




# Configuration 

To get bus timetable, you'll need to specify the transport line, the station and the destination. These information will have to be specified in the configuration ([https://github.com/lgmorand/MMM-Ratp/blob/master/MMM-Ratp.js#L14-L23]())

First you need to specify which kind of line of transport you want to retrieve. You can have:
- Bus (transporttype: bus, [bus lines](http://api-ratp.pierre-grimaud.fr/v2/bus/))
- RER (transporttype: rers, [RER lines](http://api-ratp.pierre-grimaud.fr/v2/rers/))
- Metro (metros, [metros lines](http://api-ratp.pierre-grimaud.fr/v2/metros/))
- Noctilien (noctilien, [noctilien lines](http://api-ratp.pierre-grimaud.fr/v2/noctiliens/))
- Tramway (tramways, [tramways lines](http://api-ratp.pierre-grimaud.fr/v2/tramways/))

Each URL listed before will help you to get the type of the desired line, the ID of the line and even the direction which will be used to build the API URL

Then, you must find the station you want to watch out. You need to find your line API and suffix the URL with the "stations" keyword: [http://api-ratp.pierre-grimaud.fr/v2/[TRANSPORT TYPE]/[TRANSPORT LINE]/stations]()

Example: http://api-ratp.pierre-grimaud.fr/v2/bus/176/stations


# Samples 

Here are some screenshot


# Further information and support 

Please use the forum of magic mirror² https://forum.magicmirror.builders/