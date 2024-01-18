function createDOMTreeAndUpdateAttributes(rootElement, parentId, node) {
    function traverseAndUpdate(element, parent, node) {
      for (var i = 0; i < element.children.length; i++) {
        var childElement = element.children[i];
        var childNid = parent + '-' + i;
  
        // Update the custom attribute
        childElement.setAttribute('naitik-id', childNid);
        node.children.push({
            nid: childElement.getAttribute('naitik-id'),
            tag: childElement.tagName,
            children: [],
            content: childElement.textContent
            });
  
        // Recursively traverse and update child elements
        traverseAndUpdate(childElement, childNid, node.children[i]);
      }
    }
  
    // Update the root element
    rootElement.setAttribute('naitik-id', parentId);
  
    // Create the DOM tree
    // var tree = {
    //   nid: parentId,
    //   tag: rootElement.tagName,
    //   children: []
    // };
  
    traverseAndUpdate(rootElement, parentId, node);
    return node;
  }
  
  // Get the root element of the document
  var rootElement = document.documentElement;

  var node = {
    nid: 'root',
    tag: rootElement.tagName,
    children: [],
    content: rootElement.textContent
  }
  
  // Create the DOM tree and update attributes
  var domTree = createDOMTreeAndUpdateAttributes(rootElement, node.nid, node);
  
  // Output the DOM tree
  console.log(JSON.stringify(domTree, null, 2));
  

function getElementByNaitikID(nid) {
    return document.querySelector(`[naitik-id="${nid}"]`);
}