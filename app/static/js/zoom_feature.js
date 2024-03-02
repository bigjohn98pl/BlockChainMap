var zoomLevel = 1; // Start with a default zoom level of 100%
var mapContents = document.getElementById('map-contents');

function applyZoom() {
  // Apply the scale transformation to the contents of the map
  mapContents.style.transform = 'scale(' + zoomLevel + ')';
  // No need to adjust the SVG viewBox here, as it will scale with its container
}

function zoomIn() {
  zoomLevel *= 1.1; // Increase the zoom level by 10%
  applyZoom();
}

function zoomOut() {
  zoomLevel /= 1.1; // Decrease the zoom level by 10%
  applyZoom();
}