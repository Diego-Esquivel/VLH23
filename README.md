# Take Me Here WebApp
## The Take Me Here WebApp serves one purpose: To take you where you need to go!
### Running the App:
1. Ensure you have a stable internet connection.
1. Double click index.html.
1. Enter a location in the box and click 'Search'
### Alternate:
1. Ensure you have a stable internet connection.
1. Go to: https://diego-esquivel.github.io/VLH23/
1. Enter a lcoation in the box and click 'Search'

### Exploring the code:
1. Function
    - clearMap(): Removes all of the objects from the map. Includes navigation lines and dot markers. Return: Nothing.
    - getLocation(): Queries the navigator to watch for updated geolocation. Return: Geolocation object.
    - showPosition(): Sets the vehicles origin to the geolocation object passed in as an arguement and add it to the map as a marker. Return: Geolocation object.
    - setEVorigin(): Sets the vehicle origin according to the passed in route arguement and add it to the map. Return: Nothing. 
    - setEVdestination(): Sets the navigation destination according to the passed in geolocation object. Return: Nothing.
    - createOGandD(): Create geocoder and destination parameter. Return: Nothing.
    - keeptrackofstep(): Monitor position and route to ensure the right directions are read aloud to the driver in a timerly and orderly style.
    - calculateRouteFromAtoB(): Send HERE API request for navigation information. Return: Nothing.
    - onSuccess(): Decorate the map and panel with successfull return information. Return: Nothing.
    - onError(): Inform driver of error. Return: Nothing.
    - addRouteShapeToMap(): Add navigation lines to map. Return: Nothing.
    - addManueversToMap(): Add departure, arrival, and mandatory stops to map. Return: Nothing.
    - addWaypointsToPanel(): Add directions to panel. Return: Nothing.
    - addSummaryToPanel()
    - addManueversToPanel(): Add mandatory charging stops to panel. Return: Nothing.
    - toHHMMSS(): Convert ms to HH:MM:SS time. Return: Converted time.
    - changeminmaxState(): Change panel display.
1. Event Listeners
    - window load listener: When the window loads, get the current location.
    - minmaxButton click listener: When the minmaxButton is clicked, change the panel displayed.
    - searchButton click listener: When the search button is clicked, build then send the HERE API request.
    - dotMarker tap even listener: When a dot marker is clicked, log the details to the console.
    - Directions Panel click event listener: When an instruction in the directions is clicked, zoom to the location of the instruction on the map.
    - map resize even listener: When the screen size changes, change the map size.
1. Global Variables
    - EVorigin: Stores the current location of the vehicle.
    - EVdestination: Stores the location of the destination searched for.
    - hoverzoneLabels: Stores the content displayed in Directions.
    - originobject: Stores the origin dot marker object.
    - mostrecentbattery: Stores the most recent battery level read.
    - counter: Stores the step number the driver is in on the navigation.
    - mapCountainer: Stores the container object for the map.
    - platform: Stores the HERE platform object.
    - defaultLayers: Stores the default layers used in the map.
    - map: Store the map object.
    - behavior: Default value.
    - ui: Default value.
1. navigator
    - getBattery(): Navigator API to get battery level.
    - geolocation: Navigator API to get geolocation.