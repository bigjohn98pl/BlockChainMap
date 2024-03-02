var nodeConnections = new Map();
var selectedNode = null;
var selectedNodes = []; // To keep track of the selected nodes for connection

function addNode() {
  var networkMap = document.getElementById('map-contents');
  var newNode = document.createElement('div');
  var newNodeCount = document.querySelectorAll('.account-node').length + 1;
  
  newNode.classList.add('account-node');
  newNode.classList.add('draggable-node');
  
  // Assign default data attributes for address and tag
  newNode.setAttribute('data-address', 'Address ' + newNodeCount);
  newNode.setAttribute('data-tag', 'Tag ' + newNodeCount);
  newNode.textContent = newNode.getAttribute('data-tag') // Set default text as a tag
  newNode.id = 'Address ' + newNodeCount;
  // Assign an onclick event to open the menu bar and keep track of the selected node
  newNode.onclick = function() {
    openNav(this); // Pass 'this' as the current node to the openNav function
    nodeClicked(this);
  };
  makeDraggable(newNode);
  networkMap.appendChild(newNode);
}

function makeDraggable(node) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  node.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    // Get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Set the element's new position
    node.style.top = (node.offsetTop - pos2) + "px";
    node.style.left = (node.offsetLeft - pos1) + "px";
    node.style.cursor = 'grab';
    // Call updateLines whenever the node moves
    updateLines(node);
  }

  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function updateNodeConnections(node, line) {
  if (!nodeConnections.has(node.id)) {
    nodeConnections.set(node.id, []);
  }
  nodeConnections.get(node.id).push(line);
}

function connectNodes(node1, node2) {
  var svg = document.getElementById('svg-connect');
  var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  
  // Calculate the center of each node
  var x1 = node1.offsetLeft + node1.offsetWidth / 2;
  var y1 = node1.offsetTop + node1.offsetHeight / 2;
  var x2 = node2.offsetLeft + node2.offsetWidth / 2;
  var y2 = node2.offsetTop + node2.offsetHeight / 2;

  // Set the attributes for the SVG line element
  newLine.setAttribute('x1', x1);
  newLine.setAttribute('y1', y1);
  newLine.setAttribute('x2', x2);
  newLine.setAttribute('y2', y2);
  newLine.setAttribute('stroke', 'red'); // The color of the line
  newLine.setAttribute('stroke-width', '2'); // The width of the line
  newLine.dataset.sourceNodeId = node1.id;
  newLine.dataset.targetNodeId = node2.id;
  svg.appendChild(newLine);

  // Track the connection for each node
  
  updateNodeConnections(node1, newLine);
  updateNodeConnections(node2, newLine);
}

function updateLines(node) {
  var nodeRect = node.getBoundingClientRect();
  var svgRect = document.getElementById('svg-connect').getBoundingClientRect();
  var lines = nodeConnections.get(node.id) || [];
  
  lines.forEach(function(line) {
    var x = nodeRect.left - svgRect.left + node.offsetWidth / 2 + window.scrollX;
    var y = nodeRect.top - svgRect.top + node.offsetHeight / 2 + window.scrollY;

    if (line.dataset.sourceNodeId === node.id) {
      line.setAttribute('x1', x);
      line.setAttribute('y1', y);
    } else if (line.dataset.targetNodeId === node.id) {
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
    }
  });
}

function updateAllLines() {
  var svg = document.getElementById('svg-connect');
  var svgRect = svg.getBoundingClientRect();

  // Update the viewBox to the new position of the map
  svg.setAttribute('viewBox', `${-networkMap.offsetLeft} ${-networkMap.offsetTop} ${svgRect.width} ${svgRect.height}`);

  var lines = svg.querySelectorAll('line');
  lines.forEach(function(line) {
    var sourceNodeId = line.dataset.sourceNodeId;
    var targetNodeId = line.dataset.targetNodeId;
    var sourceNode = document.getElementById(sourceNodeId);
    var targetNode = document.getElementById(targetNodeId);

    if (sourceNode && targetNode) {
      // Get the positions of the nodes relative to the page
      var sourceNodeRect = sourceNode.getBoundingClientRect();
      var targetNodeRect = targetNode.getBoundingClientRect();

      // Update the line's attributes relative to the SVG's coordinate system
      line.setAttribute('x1', sourceNodeRect.left - svgRect.left + sourceNode.offsetWidth / 2);
      line.setAttribute('y1', sourceNodeRect.top - svgRect.top + sourceNode.offsetHeight / 2);
      line.setAttribute('x2', targetNodeRect.left - svgRect.left + targetNode.offsetWidth / 2);
      line.setAttribute('y2', targetNodeRect.top - svgRect.top + targetNode.offsetHeight / 2);
    }
  });
}


function nodeClicked(node) {
  // Toggle node selection on click
  if (selectedNodes.includes(node)) {
    selectedNodes = selectedNodes.filter(n => n !== node);
    node.classList.remove('selected'); // Optional: add some styling for selected nodes
  } else {
    if (selectedNodes.length < 2) {
      selectedNodes.push(node);
      node.classList.add('selected'); // Optional: add some styling for selected nodes
    }
  }

  // Enable the Connect button if two nodes are selected
  document.getElementById('connectNodesButton').disabled = selectedNodes.length !== 2;
}

function connectSelectedNodes() {
  if (selectedNodes.length === 2) {
    connectNodes(selectedNodes[0], selectedNodes[1]);
    // Clear the selected nodes after connecting
    selectedNodes.forEach(node => node.classList.remove('selected'));
    selectedNodes = [];
    // Disable the Connect button again
    document.getElementById('connectNodesButton').disabled = true;
  }
}
document.querySelectorAll('.account-node').forEach(makeDraggable);
document.querySelectorAll('.account-node').forEach(node => {
  node.onclick = function() {
    nodeClicked(this);
  };
  node.classList.add('draggable-node')
});
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('connectNodesButton').disabled = true;
});


document.getElementById('post-address-btn').addEventListener('click', function() {
  var paramValue = document.getElementById('accountAddressInput').value;
  
  fetch('/post-address', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken // Replace csrfToken with your actual token variable
      },
      body: JSON.stringify({ address: paramValue }) // Send the parameter as JSON
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
  })
  .then(data => {
      console.log('Success:', data);
      // Handle the success response here, e.g., updating the UI
  })
  .catch((error) => {
      console.error('Error:', error);
  });
});

document.getElementById('get-transactions-btn').addEventListener('click', function() {
  fetch('/get-transactions', {
      method: 'GET',
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
  })
  .then(data => {
      console.log('Success:', data);
      // Handle the success response here, e.g., updating the UI
  })
  .catch((error) => {
      console.error('Error:', error);
  });
});