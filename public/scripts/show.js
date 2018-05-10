var address = document.querySelector('#hero-location').textContent;

var geocoder = new google.maps.Geocoder();

geocoder.geocode({
  'address': address
}, function(results, status) {
  if(status == google.maps.GeocoderStatus.OK) {
    var map = new google.maps.Map(document.getElementById('map'), { 
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: 6
    });
    new google.maps.Marker({
      position: results[0].geometry.location,
      map: map
    });
    map.setCenter(results[0].geometry.location);
  } else {
    document.querySelector('#map').classList.add('notfound');
    document.querySelector('#notfoundmsg').textContent = 'Superhero location was not found (on Earth)';
  }
});