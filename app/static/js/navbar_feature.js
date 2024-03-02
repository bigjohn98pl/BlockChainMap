function openNav(node) {
    selectedNode = node; // Set the selected node
    document.getElementById('accountAddressInput').value = node.getAttribute('data-address');
    document.getElementById('accountTagInput').value = node.getAttribute('data-tag');
    document.getElementById("mySidenav").style.width = "250px";
  }
  
    
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  
  function showTransactions() {
    // Logic to show transactions goes here
    // This could involve fetching transaction data and updating the DOM, showing a modal, etc.
    alert('Transactions will be shown here.');
  }
  
  function setAccountDetails() {
    if (selectedNode) {
      var accountAddress = document.getElementById('accountAddressInput').value;
      var accountTag = document.getElementById('accountTagInput').value;
  
      // Update the selected node's data attributes and text content
      selectedNode.setAttribute('data-address', accountAddress);
      selectedNode.setAttribute('data-tag', accountTag);
      selectedNode.textContent = accountTag; // You might want to display the tag or some identifier on the node itself
    } else {
      alert('Please select a node first.');
    }
  }