// var node_types = ["IGNORE_ELEMENT", "BLOCK_ELEMENT", "INLINE_ELEMENT", "TEXT_NODE", "COMMENT_NODE"];

//FIXME: Which elements should be ignored??? All the elements are Copilot's suggestions
var IGNORE_ELEMENTS = ["SCRIPT", "STYLE", "LINK", "NOSCRIPT", "IFRAME", "OBJECT", "EMBED", "PARAM", "SOURCE", "CANVAS", "SVG", "USE", "TRACK", "INPUT", "TEXTAREA", "SELECT", "OPTION", "OPTGROUP", "BUTTON", "LABEL", "FIELDSET", "LEGEND", "BR", "HR"];
//FIXME: META HEAD YEH sab daalna hai??

var BLOCK_ELEMENTS = ["DIV", "P", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "LI", "DL", "DT", "DD", "TABLE", "THEAD", "TBODY", "TFOOT", "TR", "TH", "TD", "FORM", "HEADER", "FOOTER", "NAV", "SECTION", "ARTICLE", "ASIDE", "DETAILS", "DIALOG", "SUMMARY", "FIGURE", "FIGCAPTION", "ADDRESS", "MAIN", "HR", "PRE", "BLOCKQUOTE"];

var INLINE_ELEMENTS = ["SPAN", "A", "STRONG", "B", "I", "EM", "MARK", "SMALL", "DEL", "INS", "SUB", "SUP", "Q", "CITE", "DFN", "ABBR", "TIME", "CODE", "VAR", "SAMP", "KBD", "STRONG", "B", "I", "EM", "MARK", "SMALL", "DEL", "INS", "SUB", "SUP", "Q", "CITE", "DFN", "ABBR", "TIME", "CODE", "VAR", "SAMP", "KBD", "S", "U", "WBR", "IMG", "BR", "INPUT", "TEXTAREA", "SELECT", "OPTION", "OPTGROUP", "BUTTON", "LABEL", "FIELDSET", "LEGEND", "IFRAME", "OBJECT", "EMBED", "PARAM", "SOURCE", "CANVAS", "SVG", "USE", "TRACK", "INPUT", "TEXTAREA", "SELECT", "OPTION", "OPTGROUP", "BUTTON", "LABEL", "FIELDSET", "LEGEND"];

// Isko set banado to avoid redundant data
var contents = [];

function cleanText(text) {
    const continuousSpaceOverTwoCharactorRule = /\s{2,}/g;
    // const textsReplaced = text.replace(continuousSpaceOverTwoCharactorRule, ' ')).replace('\n', ''));
    const newText = text.replace(continuousSpaceOverTwoCharactorRule, ' ').replace('\n', '');
    return newText;
}

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
            content: !IGNORE_ELEMENTS.includes(childElement.tagName) ? cleanText(childElement.textContent) : "",
            //FIXME: Yeh kuchh gadbad hai to be fixed
            nodeType: IGNORE_ELEMENTS.includes(childElement.tagName) ? "IGNORE_ELEMENT" : BLOCK_ELEMENTS.includes(childElement.tagName) ? "BLOCK_ELEMENT" : INLINE_ELEMENTS.includes(childElement.tagName) ? "INLINE_ELEMENT" : "TEXT_NODE"
            });
        if (node.nodeType == "TEXT_NODE" || node.nodeType == "INLINE_ELEMENT" || node.nodeType == "BLOCK_ELEMENT"){
            contents.push(node.content);
        }
        // Recursively traverse and update child elements
        traverseAndUpdate(childElement, childNid, node.children[i]);
      }
    }
  
    // Update the root element
    rootElement.setAttribute('naitik-id', parentId);
  
    traverseAndUpdate(rootElement, parentId, node);
    return node;
  }

// Get the root element of the document
var rootElement = document.documentElement;

var node = {
nid: 'root',
tag: rootElement.tagName,
children: [],
content: rootElement.textContent,
nodeType: "HTML_ELEMENT"
}

// Create the DOM tree and update attributes
var domTree = createDOMTreeAndUpdateAttributes(rootElement, node.nid, node);

// Output the DOM tree
console.log('DOM Tree:');
console.log(JSON.stringify(domTree, null, 2));
console.log('DOM Tree 2:');
console.log(contents);
console.log('DOM Tree 3:');
  

function getElementByNaitikID(nid) {
    return document.querySelector(`[naitik-id="${nid}"]`);
}