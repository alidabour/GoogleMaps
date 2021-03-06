 var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
// Constructor creates a new map - only center and zoom are required.
map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 40.7413549, lng: -73.9980244},
  zoom: 13,
  mapTypeControl: false
});

// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
var locations = [
{title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
{title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
{title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
{title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
{title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
{title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

var largeInfowindow = new google.maps.InfoWindow();

// The following group uses the location array to create an array of markers on initialize.
for (var i = 0; i < locations.length; i++) {
  // Get the position from the location array.
  var position = locations[i].location;
  var title = locations[i].title;
  // Create a marker per location, and put into markers array.
  var marker = new google.maps.Marker({
    position: position,
    title: title,
    animation: google.maps.Animation.DROP,
    id: i
  });
  // Push the marker to our array of markers.
  markers.push(marker);
  // Create an onclick event to open an infowindow at each marker.
  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfowindow);
  });
}
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
// Check to make sure the infowindow is not already opened on this marker.
if (infowindow.marker != marker) {
  infowindow.marker = marker;
  console.log("Xxx");
  console.log(marker.title);  
  $.getJSON(filcker+marker.title+"&jsoncallback=?",function(data){
    var photo = null
    if(data.photos.photo[0] != null){
      console.log(data.photos.photo[0].id);
      photo = data.photos.photo[0];
      infowindow.setContent('<img src='+'https://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'.jpg'+' height="400" width="400">');
    }else {
      infowindow.setContent('<div>'+"No photo found"+'</div');

    }
    infowindow.open(map, marker);
  }).done(function(){console.log("Done");})
  .fail(function(jqxhr, textStatus, error) {
   var err = textStatus + ", " + error;
   console.log( "Request Failed: " + err );
   console.log( "error" );
 })
  .always(function() {
    console.log( "complete" );
  });
  
  // Make sure the marker property is cleared if the infowindow is closed.
  infowindow.addListener('closeclick', function() {
    infowindow.marker = null;
  });
}
}

// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

var locations = [
{title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
{title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
{title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
{title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
{title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
{title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

var filcker = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=b92192ecb9bb119080e0cb812f88cf32&format=json&text=";
var newPlace =function(data){
  this.name= ko.observable(data.title);
  this.nameClicked= function(clickedData){
    for(var i=0; i<markers.length; i++){
      if (markers[i].title.toLowerCase().startsWith(clickedData.name().toLowerCase())) {
        markers[i].setMap(map);
      }else{
        markers[i].setMap(null);
      }
    }
  }
}
$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("active");
});

var viewModel = {
	places:[new newPlace(locations[0]),
  new newPlace(locations[1]),
  new newPlace(locations[2]),
  new newPlace(locations[3]),
  new newPlace(locations[4]),
  new newPlace(locations[5]) ]
};
viewModel.Query = ko.observable('');

viewModel.searchResults = ko.computed(function() {
  var q = viewModel.Query();
  console.log(q);
  for(var i=0; i<markers.length; i++){
    if (markers[i].title.toLowerCase().indexOf(q.toLowerCase())>=0) {
      markers[i].setMap(map);
    }else{
      markers[i].setMap(null);
    }
  }
  return viewModel.places.filter(function(i) {
    return i.name().toLowerCase().indexOf(q.toLowerCase()) >= 0;
  });
});

ko.applyBindings(viewModel);
