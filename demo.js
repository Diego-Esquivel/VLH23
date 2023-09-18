var EVorigin, EVdestination = {lat:41.775669,lng:-88.142876};
var hoverzoneLabels = [];
var originobject = [];
const waypoints = [

];
var mostrecentbattery = "100";
navigator.getBattery().then((battery) => {
  let temp = document.getElementById("batterytext");
  temp.innerHTML = "<b>Battery: " + (battery.level * 100)+"%</b>" ;
  mostrecentbattery = (battery.level * 100).toString()
  console.log(mostrecentbattery)
})
navigator.getBattery().then((battery) => {
  battery.onlevelchange = () => {
    document.getElementById("batterytext").innerText = "Battery: " + (battery.level * 100)+"%";
    mostrecentbattery = (battery.level * 100)
    console.log(mostrecentbattery)
  };
});

function clearMap(){
  map.removeObjects(map.getObjects());
}
function getLocation() {
  if (navigator.geolocation) {
    return navigator.geolocation.watchPosition(showPosition,()=>{console.log("Geolocation is not supported by this browser.")},{enableHighAccuracy: true, maximumAge:0});
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  
  EVorigin = {lat:position.coords.latitude, lng:position.coords.longitude};
  console.log(EVorigin)
  map.setCenter(EVorigin);
  var dotMarkup = '<svg width="18" height="18" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<circle cx="8" cy="8" r="8" ' +
    'fill="#1b468d" stroke="white" stroke-width="1" />' +
  '</svg>',
    dotIcon = new H.map.Icon(dotMarkup, {anchor: {x:8, y:8}})
  var dotMarker = new H.map.Marker({
    lat: EVorigin.lat,
    lng: EVorigin.lng},
    {icon: dotIcon});
    dotMarker.instruction = "Departing from Home";
    if(originobject.length)
      map.removeObject(originobject.pop());
    console.log(dotMarker);
    console.log(originobject);
    originobject.push(map.addObject(dotMarker));
    
  if(hoverzoneLabels.length > 1)
    keeptrackofstep();
  return EVorigin;
}

function setEVorigin(result){
  EVorigin =  {lat:result.items[0].position.lat,lng:result.items[0].position.lng};
  var dotMarkup = '<svg width="18" height="18" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<circle cx="8" cy="8" r="8" ' +
    'fill="#1b468d" stroke="white" stroke-width="1" />' +
  '</svg>',
    dotIcon = new H.map.Icon(dotMarkup, {anchor: {x:8, y:8}})
  var dotMarker = new H.map.Marker({
    lat: EVorigin.lat,
    lng: EVorigin.lng},
    {icon: dotIcon});
    dotMarker.instruction = "Departing from Home";
    if(originobject.length)
      map.removeObject(originobject.pop());
    console.log(dotMarker);
    console.log(originobject);
    originobject.push(map.addObject(dotMarker));
    
  if(hoverzoneLabels.length > 1)
    keeptrackofstep();
}
function setEVdestination(result){
  EVdestination = result.items[0].position.lat + "," + result.items[0].position.lng;
  clearMap();
  calculateRouteFromAtoB(platform);
}

function createOGandD(platform, location) {
  var geocoder = platform.getSearchService(),
  geocoderParameters = {
    q: location
  };
  geocoder.geocode(geocoderParameters,setEVdestination);
}
var counter = 1;

function keeptrackofstep(){
  //map.setCenter({lat:hoverzoneLabels[temp.id].lat,lng:hoverzoneLabels[temp.id].lng})
  if(Math.abs(EVorigin.lat - hoverzoneLabels[counter].lat) < .0007 && Math.abs(EVorigin.lng - hoverzoneLabels[counter].lng) < .0007){
    counter++;
    let temp = document.getElementById(counter-2);
    temp.style.fontWeight = 300;
    temp = document.getElementById(counter-1);
    temp.style.fontWeight = 700;
    let utterance = new SpeechSynthesisUtterance(temp.innerText);
    speechSynthesis.speak(utterance);
    temp.scrollIntoView(false);
  }
}
function calculateRouteFromAtoB(platform) {
  var router = platform.getRoutingService(null, 8),
      routeRequestParams = {
      'transportMode': 'car',
      'origin': EVorigin.lat + "," + EVorigin.lng,
      'via': new H.service.Url.MultiValueQueryParameter(waypoints), 
      'destination': EVdestination,
      'return': 'polyline,turnByTurnActions,actions,instructions,travelSummary', 
      'ev[freeFlowSpeedTable]':'0,0.239,27,0.239,45,0.259,60,0.196,75,0.207,90,0.238,100,0.26,110,0.296,120,0.337,130,0.351,250,0.351',
      'ev[trafficSpeedTable]':'0,0.349,27,0.319,45,0.329,60,0.266,75,0.287,90,0.318,100,0.33,110,0.335,120,0.35,130,0.36,250,0.36',
      'ev[auxiliaryConsumption]':'1.8',
      'ev[ascent]':'9',
      'ev[descent]':'4.3',
      'ev[initialCharge]':mostrecentbattery,
      'ev[maxCharge]':'99',
      'ev[chargingCurve]':'0,239,32,199,56,167,60,130,64,111,68,83,72,55,76,33,78,17,80,1',
      'ev[maxChargingVoltage]':'400',
      'ev[maxChargeAfterChargingStation]':'75',
      'ev[minChargeAtChargingStation]':'8',
      'ev[minChargeAtDestination]':'8',
      'ev[chargingSetupDuration]':'300',
      'ev[makeReachable]':'true',
      'ev[connectorTypes]':'iec62196Type1Combo,iec62196Type2Combo,Chademo,Tesla'
      };

  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}

/**
 * This function will be called once the Routing REST API provides a response
 * @param {Object} result A JSONP object representing the calculated route
 *
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
 */
function onSuccess(result) {
  var route = result.routes[0];
  var tbytactions = result.routes[0].sections[0].actions
  tbytactions.forEach((element)=>{element.instruction = String(element.instruction).replace(" m."," meters.")})
  console.log(tbytactions);
  /*
   * The styling of the route response on the map is entirely under the developer's control.
   * A representative styling can be found the full JS + HTML code of this example
   * in the functions below:
   */
  addRouteShapeToMap(route);
  addManueversToMap(route);
  addWaypointsToPanel(tbytactions);
  addSummaryToPanel(route);
  addManueversToPanel(route);
  console.log(EVorigin)
  map.setCenter(EVorigin);
  map.setZoom(20);
  let temp = document.getElementById("batteryestimate");
  temp.innerHTML = "<b>Estimated Use: " + Math.floor((result.routes[0].sections[0].departure.charge - result.routes[0].sections[0].arrival.charge)+1)+"%</b>" ;
  // ... etc.
  
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param {Object} error The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map + panel
var mapContainer = document.getElementById('map'),
  routeInstructionsContainer = document.getElementById('directionPanel');

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: "-f0fpTTrfk8L72KFcj_O0ivxuNiNDcXHyfuDtlpL9kk"
});

var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map - this map is centered over Bangkok
var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.map, {
  center: {lat:41.775669, lng:-88.142876},
  zoom: 16,
  pixelRatio: window.devicePixelRatio || 1
});

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);
window.addEventListener("resize", () => map.getViewPort().resize());

document.getElementById('searchButton').addEventListener('click', function() {
  var location = document.getElementById('locationInput').value;
  createOGandD(platform, location);
});
/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route) {
  route.sections.forEach((section) => {
    // decode LineString from the flexible polyline
    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

    // Create a polyline to display the route:
    let polyline = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });

    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
      bounds: polyline.getBoundingBox()
    });
  });
}
/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addManueversToMap(route) {
  hoverzoneLabels = []
  var svgEVMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ev-station-fill" viewBox="0 0 16 16"><path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V9c0-.258-.104-.377-.357-.635l-.007-.008C13.379 8.096 13 7.71 13 7V4a.5.5 0 0 1 .146-.354l.5-.5a.5.5 0 0 1 .708 0l.5.5A.5.5 0 0 1 15 4v8.5a1.5 1.5 0 1 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V2Zm2 .5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5Zm2.631 9.96H4.14v-.893h1.403v-.505H4.14v-.855h1.49v-.54H3.485V13h2.146v-.54Zm1.316.54h.794l1.106-3.333h-.733l-.74 2.615h-.031l-.747-2.615h-.764L6.947 13Z"/></svg>',
  dotMarkup = '<svg width="18" height="18" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<circle cx="8" cy="8" r="8" ' +
    'fill="#1b468d" stroke="white" stroke-width="1" />' +
  '</svg>',
    dotIcon = new H.map.Icon(dotMarkup, {anchor: {x:8, y:8}}),
    EVIcon = new H.map.Icon(svgEVMarkup, {anchor: {x:8, y:8}}),
    group = new H.map.Group(),
    i,
    j;
    
  //adding departing marker
    var dotMarker = new H.map.Marker({
      lat: EVorigin.lat,
      lng: EVorigin.lng},
      {icon: dotIcon});
      dotMarker.instruction = "Departing from Home";
      //if(originobject.length)
        //map.removeObject(originobject.pop());
      console.log(dotMarker);
      console.log(originobject);
      originobject.push(group.addObject(dotMarker));
      
  
  route.sections.forEach((section, index, theArray) => {
    let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();
    let actions = section.actions;
    let action = actions[actions.length-1];
    for(let i = 0; i < actions.length; i++){
      let dotMark = new H.map.Marker({
        lat: poly[actions[i].offset * 3],
        lng: poly[actions[i].offset * 3 + 1]},
        {icon: dotIcon});
        hoverzoneLabels.push({lat:dotMark.a.lat,lng:dotMark.a.lng})
    }
      var EVMarker = new H.map.Marker({
        lat: poly[action.offset * 3],
        lng: poly[action.offset * 3 + 1]},
        {icon: EVIcon});
        var dotMarker = new H.map.Marker({
          lat: poly[action.offset * 3],
          lng: poly[action.offset * 3 + 1]},
          {icon: dotIcon});
      
    if (index < theArray.length -1 && index >-1 && section.postActions){
    
      EVMarker.instruction = section.postActions[1].action + " " 
      + "Arrival Charge: " + section.postActions[1].arrivalCharge + "% " 
      + "Consumable Power: " + section.postActions[1].consumablePower + " " 
      + "Duration: " + toMMSS(section.postActions[1].duration) + " " 
      + "Target Charge: " + section.postActions[1].targetCharge + "% ";
      group.addObject(EVMarker);
      
    }else{
      dotMarker.instruction = action.instruction;
      
      group.addObject(dotMarker);
      
    }
    

    group.addEventListener('tap', function (evt) {
      //map.setCenter(evt.target.getGeometry());
      console.log(evt.target.instruction);
    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
  });
}
/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addWaypointsToPanel(route) {
  var nodeH3 = document.createElement('ul'),
    labels = [];
    
  routeInstructionsContainer.innerHTML = '';
  var subTitle = document.createElement('p');
  subTitle.innerHTML= "<p><b>Directions: </b></p>";
  routeInstructionsContainer.appendChild(subTitle);
  //hoverzoneLabels = hoverzoneLabels.reverse();
  for(var i = 0; i < route.length; i++){
    labels.push(route[i].action + ": " + route[i].instruction);
    
  };
  for(var i = 0; i < labels.length; i++){
    let temp = document.createElement('li')
    temp.id = i;
    if(temp.addEventListener) temp.addEventListener("click",()=>{map.setCenter({lat:hoverzoneLabels[temp.id].lat,lng:hoverzoneLabels[temp.id].lng})},false)
    else if(temp.attachEvent) temp.attachEvent("onclick",()=>{map.setCenter({lat:hoverzoneLabels[i].lat,lng:hoverzoneLabels[i].lng})})
    temp.innerText = labels[i]
    nodeH3.append(temp)
  }
  routeInstructionsContainer.appendChild(nodeH3);

}
/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addSummaryToPanel(route) {
  var directionSubtitle = document.createElement('p');
  directionSubtitle.innerHTML= "<h3>Summary:</h3>";
  routeInstructionsContainer.appendChild(directionSubtitle);


  let duration = 0,
  chargingDuration = 0,
    distance = 0;

  route.sections.forEach((section, index, theArray) => {
    distance += section.travelSummary.length;
    duration += section.travelSummary.duration;
    //adding charging time 
    if (index < theArray.length -1 && section.postActions) {
      chargingDuration += section.postActions[0].duration + section.postActions[1].duration;
      duration += section.postActions[0].duration + section.postActions[1].duration;}
  });

  var summaryDiv = document.createElement('div'),
    content = '<b>Total distance</b>: ' + (distance/1000*0.62137).toFixed(2) + ' miles. <br />' +
    '<b>Charging Time</b>: ' + toHHMMSS(chargingDuration) + '<br />' +
      '<b>Travel Time</b>: ' + toHHMMSS(duration) + ' (in current traffic)';

  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft = '5%';
  summaryDiv.style.marginRight = '5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}
/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addManueversToPanel(route) {
  var directionSubtitle = document.createElement('p');
  directionSubtitle.innerHTML= "<h3>Charging Stops:</h3>";
  routeInstructionsContainer.appendChild(directionSubtitle);

  var nodeOL = document.createElement('ol');

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';
  nodeOL.className = 'directions';

  route.sections.forEach((section, sid, theSArray) => {
    section.actions.forEach((action, idx, theArray) => {
      var li = document.createElement('li'),
        spanArrow = document.createElement('span'),
        spanInstruction = document.createElement('span');
      
      //removing turn-by-turn driving directions
      //spanArrow.className = 'arrow ' + (action.direction || '') + action.action;
      //spanInstruction.innerHTML = section.actions[idx].instruction;
      //li.appendChild(spanArrow);
      //li.appendChild(spanInstruction);

      //nodeOL.appendChild(li);

      //charging stops details
      if (idx == theArray.length-1 && sid < theSArray.length - 1 && section.postActions) {
        //spanInstruction.innerHTML = "<b>Location:</b> " + section.arrival.place.location.lat + "," + section.arrival.place.location.lng + ". <br>";
        spanArrow.className = 'arrow ' + section.postActions[1].action;
        spanInstruction.innerHTML += "<b>Details:</b> " + " " 
      + "Arrival Charge: " + (section.postActions[1].arrivalCharge).toFixed(1) + "%, " 
      + "Consumable Power: " + section.postActions[1].consumablePower + ", " 
      + "Duration: " + toMMSS(section.postActions[1].duration) + ", " 
      + "Target Charge: " + section.postActions[1].targetCharge + "%, ";
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
      }      
    });
  });

  routeInstructionsContainer.appendChild(nodeOL);
  var temp = document.getElementById("0");
  temp.style.fontWeight = 700;
  let utterance = new SpeechSynthesisUtterance(temp.innerText);
  speechSynthesis.speak(utterance);
  if(minmaxbutton.innerText == "+"){
    temp.scrollIntoView(false);
  }
}
function toMMSS(duration) {
  return Math.floor(duration / 60) + ' minutes ' + (duration % 60) + ' seconds.';
}

function toHHMMSS(duration) {
  return Math.floor(duration / 3600) + ' hours ' + Math.floor(duration % 3600 /60) + ' minutes ' + (duration % 60) + ' seconds.';
}

function changeminmaxState() {
  if(minmaxbutton.innerText == '-'){
    minmaxbutton.innerText = "+";
    //document.getElementById("userPanel").hidden = true;
    document.getElementById("test").style.height = "10%";
    let temp = document.getElementById(counter-1);
    temp.scrollIntoView(false);
  }
  else{
    minmaxbutton.innerText = "-";
    //document.getElementById("userPanel").hidden = false;
    document.getElementById("test").style.height = "80%"
  }
}

if(window.addEventListener) window.addEventListener("load",getLocation, false);
else if(window.attachEvent) window.attachEvent("onload", getLocation);
minmaxbutton = document.getElementById("minmaxButton");

if(minmaxbutton.addEventListener) minmaxbutton.addEventListener("click", changeminmaxState, false)
else if(minmaxbutton.attachEvent) minmaxbutton.attachEvent("onclick", changeminmaxState)