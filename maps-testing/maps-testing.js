EventsList = new Mongo.Collection("events");

if (Meteor.isClient) {

  var geocoder;
  var map;

  function initialize(location) {

    console.log(location);
    var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

    var mapOptions = {
      center: currentLocation,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

    var infoWindowContent = '<div class="info_content">' +
      '<h3>Title Here</h3>' +
      '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente totam exercitationem molestiae possimus.</p>' +
      '</div>';

    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    geocoder = new google.maps.Geocoder();

    var marker = new google.maps.Marker({
      position: currentLocation,
      map: map,
      icon: 'http://i.stack.imgur.com/Kbx0I.png'
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map, marker);
    });
  }

  function codeAddress() {
    var address = document.getElementById("address").value;
    geocoder.geocode( {'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  $(document).ready(function()
  {
    navigator.geolocation.getCurrentPosition(initialize);
  });

  Template.addLocation.events({
    'submit form': function(event){
      event.preventDefault();
      codeAddress();
      var eventNameVar = event.target.locationName.value
      var eventAddressVar = event.target.address.value
      EventsList.insert({name: eventNameVar, address: eventAddressVar});
      console.log(EventsList);
    }
  });

  Template.addEvents.helpers({

    eachEvent: function() {
      return EventsList.find({}).fetch();
    },

    eventName: function() {
      return EventsList.findOne({_id: this._id});
    }

  });

  Template.addEvents.events({
    "click .delete": function() {
      EventsList.remove(this._id);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


// var joe = EventsList.find({name: "joe"}).fetch();
// joe[0].lat, joe[0].lon




  // Meteor.startup(function() {
  //   GoogleMaps.load();


  // Meteor.startup(function() {
  //   GoogleMaps.load();
  // });

  // Template.map.onStart({})

  // Template.map.helpers({
  //   mapOptions: function() {
  //     if (GoogleMaps.loaded()) {
  //       return {
  //         center: new google.maps.LatLng(37.78452, -122.39719),
  //         zoom: 8
  //       };
  //     }
  //   }
  // });

  // Template.map.onStart({})

  // Template.map.helpers({
  //   mapOptions: function() {
  //     if (GoogleMaps.loaded()) {
  //       return {
  //         center: new google.maps.LatLng(37.78452, -122.39719),
  //         zoom: 8
  //       };
  //     }
  //   }
  // });