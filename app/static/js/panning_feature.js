var networkMap = document.getElementById('network-map');
var panning = false;
var startX, startY;
var currentX = 0, currentY = 0;

networkMap.addEventListener('mousedown', function(e) {
  if (!e.target.classList.contains('draggable-node')) {
    panning = true;
    startX = e.clientX - (currentX * zoomLevel);
    startY = e.clientY - (currentY * zoomLevel);
    e.preventDefault();
    this.style.cursor = 'grabbing';
  }
});

document.addEventListener('mousemove', function(e) {
  if (panning) {
    // Adjust the delta by the zoom level
    var deltaX = (e.clientX - startX) / zoomLevel;
    var deltaY = (e.clientY - startY) / zoomLevel;

    // Update the current position
    currentX += deltaX;
    currentY += deltaY;

    // Move the network map based on the delta and zoom level
    networkMap.style.transform = `translate(${currentX}px, ${currentY}px) scale(${zoomLevel})`;

    // Prepare for the next move
    startX = e.clientX;
    startY = e.clientY;

    // You would need to update your lines here, if necessary
    updateAllLines(); // Assuming you have a function that updates the lines
  }
});

document.addEventListener('mouseup', function() {
  panning = false;
  networkMap.style.cursor = 'move'; // Change cursor back to grab
});
