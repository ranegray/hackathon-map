import token from "./important.js";
mapboxgl.accessToken = token;

// add current user location to add pin from there
const userLocation = navigator.geolocation.getCurrentPosition((position) => {
  console.log('success')
  let data = [position.coords.latitude, position.coords.longitude];
});

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v12",
  center: userLocation ? userLocation : [-96, 37.8],
  zoom: 4,
});

let geojson = {
  type: "FeatureCollection",
  features: [],
};

if (localStorage.getItem("pins")) {
  let geojson = JSON.parse(localStorage.getItem("pins"));
  console.log(geojson);
  geojson.features.forEach((feature) => {
    let element = document.createElement("div");
    element.className = "marker";

    new mapboxgl.Marker(element)
      .setLngLat(feature.geometery.coordinates)
      .addTo(map);
  });
}

map.on("contextmenu", (e) => {
  console.log(e);

  let data = checkExisting(e);

  let element = document.createElement("div");
  element.className = "marker";

  new mapboxgl.Marker(element)
    .setLngLat([e.lngLat.lng, e.lngLat.lat])
    .addTo(map);

  localStorage.setItem("pins", JSON.stringify(data));
  console.log(data);
});

function checkExisting(e) {
  let existing = localStorage.getItem("pins");
  if (existing) {
    existing = JSON.parse(existing);
    existing.features.push({
      type: "Feature",
      geometery: { type: "Point", coordinates: [e.lngLat.lng, e.lngLat.lat] },
    });
    return existing;
  } else {
    geojson.features.push({
      type: "Feature",
      geometery: { type: "Point", coordinates: [e.lngLat.lng, e.lngLat.lat] },
    });
    return geojson;
  }
}
