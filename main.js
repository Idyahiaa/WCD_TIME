if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpc3NkcmRveGkiLCJhIjoiY2xhbGVudjByMDFpeTN2a2R1N3o4ejFieCJ9.fScK3YiEEJcw0Dyuoscnew';

  const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // stylesheet
    center: [position.coords.longitude, position.coords.latitude, ], // starting position [lng, lat]
    zoom: 13.5 // starting zoom
  });

  // Target the params form in the HTML
  const params = document.getElementById('params');

  // Correcting for arabic text direction for street names
  mapboxgl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  null,
  true // Lazy load the plugin
  );

  // Create variables to use in getIso()
  const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
  
const lat = position.coords.latitude;
const lon = position.coords.longitude; 
  let profile = 'cycling';
  let minutes = 10;

  // Set up a marker that you can use to show the query's coordinates
  const marker = new mapboxgl.Marker({
    'color': '#ff0000 '
  });
 


  // Create a LngLat object to use in the marker initialization
  // https://docs.mapbox.com/mapbox-gl-js/api/#lnglat
  const lngLat = {
    lon: lon,
    lat: lat
  };

  

  // Create a function that sets up the Isochrone API query then makes a fetch call
  async function getIso() {
    const query = await fetch(
      `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const data = await query.json();
    // Set the 'iso' source's data to what's returned by the API query
    map.getSource('iso').setData(data);
  }

  // When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again
  params.addEventListener('change', (event) => {
    if (event.target.name === 'profile') {
      profile = event.target.value;
    } else if (event.target.name === 'duration') {
      minutes = event.target.value;
    }
    getIso();
  });

  map.on('load', () => {
    // When the map loads, add the source and layer
    map.addSource('iso', {
      type: 'geojson',
      data: {
        'type': 'FeatureCollection',
        'features': []
      }
    });

    map.addLayer(
      {
        'id': 'isoLayer',
        'type': 'fill',
        'source': 'iso',
        'layout': {},
        'paint': {
          'fill-color': '#5a3fc0',
          'fill-opacity': 0.3
        }
      },
      'poi-label'
    );

    // Initialize the marker at the query coordinates
    marker.setLngLat(lngLat).addTo(map);

    // Make the API call
    getIso();
  });
  //  // Fonction pour exporter les isochrones au format GeoJSON
  //  function exportGeoJSON(data) {
  //   const geoJSONData = JSON.stringify(data);
  //   const blob = new Blob([geoJSONData], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   // Crée un lien de téléchargement pour le fichier GeoJSON
  //   const downloadLink = document.createElement('a');
  //   downloadLink.href = url;
  //   downloadLink.download = 'isochrones.geojson';
  //   downloadLink.innerText = 'Télécharger GeoJSON';

  //   // Ajoute le lien de téléchargement à la page
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();

  //   // Clean up the link and URL object after the download
  //   document.body.removeChild(downloadLink);
  //   URL.revokeObjectURL(url);
  // }

  // Associez la fonction d'exportation au bouton Export GeoJSON
  // const exportButton = document.getElementById('exportGeoJSON');
  // exportButton.addEventListener('click', () => {
  //   exportGeoJSON(map.getSource('iso')._data);
    
  // });
  });}
  else {

    alert("Geolocation is not supported by this browser.");
  }
