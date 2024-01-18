function createDOMTreeAndUpdateAttributes(rootElement, parentId) {
    function traverseAndUpdate(element, parent) {
      for (var i = 0; i < element.children.length; i++) {
        var childElement = element.children[i];
        var childNid = parent + '-' + i;
  
        // Update the custom attribute
        childElement.setAttribute('naitik-id', childNid);
  
        // Recursively traverse and update child elements
        traverseAndUpdate(childElement, childNid);
      }
    }
  
    // Update the root element
    rootElement.setAttribute('naitik-id', parentId);
  
    // Create the DOM tree
    var tree = {
      nid: parentId,
      tag: rootElement.tagName,
      children: []
    };
  
    traverseAndUpdate(rootElement, parentId);
    return tree;
  }
  
  // Get the root element of the document
  var rootElement = document.documentElement;
  
  // Create the DOM tree and update attributes
  var domTree = createDOMTreeAndUpdateAttributes(rootElement, 'root');
  
  // Output the DOM tree
  console.log(JSON.stringify(domTree, null, 2));
  

function getElementByNaitikID(nid) {
    return document.querySelector(`[naitik-id="${nid}"]`);
}