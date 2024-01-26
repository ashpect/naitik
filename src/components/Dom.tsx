function Checkbox() {

    interface TreeNode {
      nid: string;
      tag: string;
      children: TreeNode[];
      content: string;
      nodeType: string; // adjust the type if needed
    }

    const handleClick = async () => {
      let [tab] = await chrome.tabs.query({ active : true });
      // giving generic params to executeScript for handling args
      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => {

            // ---- initiate variables ----
            var rootElement = document.documentElement;
            var node : TreeNode = {
                nid: 'root',
                tag: rootElement.tagName,
                children: [],
                content: rootElement.textContent ?? "",
                nodeType: "HTML_ELEMENT"
                }
            var nodeIdContentMap: { [key: string]: string } = {};
            var mapOfDarkTexts: { [key: string]: string } = {};
            const parentId = node.nid;
            var score = 0;
            var isDarkPattern = false;

            rootElement.setAttribute('naitik-id', parentId);
            traverseAndUpdate(rootElement, parentId, node);
            iterateAndPopulateMap(node);
            console.table(nodeIdContentMap);
            console.log('End of Node ID Content Map');
            //console.log(JSON.stringify(node, null, 2));
            console.log('DOM Tree:');

            // ---- TESTING, CAUSE HUGGING FACE RATE LIMIT ----
            //remove nodeIdContentmap entries with leaving only first 2 entries
            var count = 0;
            for (var key in nodeIdContentMap) {
              if (!(count >= 6 && count <= 8)) {
                delete nodeIdContentMap[key];
              }
              count++;
            }
            console.log('Node ID Content Map updated:', nodeIdContentMap);

            const promises = [];
            for (const key in nodeIdContentMap) {
              // Add a time delay of 1 second between iterations
              promises.push(
                  new Promise<void>(resolve => {
                      setTimeout(() => {
                          makeApiRequest(nodeIdContentMap[key])
                              .then(result => {
                                  console.log('Score:', result.score);
                                  console.log('Bool Value:', result.isDarkPattern);
                                  if (result.isDarkPattern) {
                                      mapOfDarkTexts[key] = nodeIdContentMap[key];
                                  }
                                  resolve(); // Resolve the promise after completion
                              })
                              .catch(error => {
                                  console.error('Error:', error.message);
                                  resolve(); // Resolve the promise even if there's an error
                              });
                      }, 1000); // 1000 milliseconds (1 second) delay
                  })
              );
            }
            Promise.all(promises)
              .then(() => {
                console.log('mapOfDarkTexts:', mapOfDarkTexts);
              })
              .catch(error => {
                console.error('Error:', error.message);
              });

            console.log("OHOOO BHAIYA");
            console.log('Score:', score);
            console.log('Bool Value:', isDarkPattern);

            // ---- Helper Functions ----
            function traverseAndUpdate(element:any, parent:any, node:any) {
              for (var i = 0; i < element.children.length; i++) {

                var childElement = element.children[i];
                var childNid = parent + '-' + i;
                var IGNORE_ELEMENTS = ["SCRIPT", "STYLE", "LINK", "NOSCRIPT", "IFRAME", "OBJECT", "EMBED", "PARAM", "SOURCE", "CANVAS", "SVG", "USE", "TRACK", "INPUT", "TEXTAREA", "SELECT", "OPTION", "OPTGROUP", "BUTTON", "LABEL", "FIELDSET", "LEGEND", "BR", "HR"];
                var BLOCK_ELEMENTS = ["DIV", "P", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "LI", "DL", "DT", "DD", "TABLE", "THEAD", "TBODY", "TFOOT", "TR", "TH", "TD", "FORM", "HEADER", "FOOTER", "NAV", "SECTION", "ARTICLE", "ASIDE", "DETAILS", "DIALOG", "SUMMARY", "FIGURE", "FIGCAPTION", "ADDRESS", "MAIN", "HR", "PRE", "BLOCKQUOTE"];
                var INLINE_ELEMENTS = ["SPAN", "A", "STRONG", "B", "I", "EM", "MARK", "SMALL", "DEL", "INS", "SUB", "SUP", "Q", "CITE", "DFN", "ABBR", "TIME", "CODE", "VAR", "SAMP", "KBD", "STRONG", "B", "I", "EM", "MARK", "SMALL", "DEL", "INS", "SUB", "SUP", "Q", "CITE", "DFN", "ABBR", "TIME", "CODE", "VAR", "SAMP", "KBD", "S", "U", "WBR", "IMG", "BR", "INPUT", "TEXTAREA", "SELECT", "OPTION", "OPTGROUP", "BUTTON", "LABEL", "FIELDSET", "LEGEND", "IFRAME", "OBJECT", "EMBED", "PARAM", "SOURCE", "CANVAS", "SVG", "USE", "TRACK", "INPUT", "TEXTAREA", "SELECT", "OPTION", "OPTGROUP", "BUTTON", "LABEL", "FIELDSET", "LEGEND"];
                var contents = [];
    
                childElement.setAttribute('naitik-id', childNid);
                node.children.push({
                    nid: childElement.getAttribute('naitik-id'),
                    tag: childElement.tagName,
                    children: [],
                    content: !IGNORE_ELEMENTS.includes(childElement.tagName) ? cleanText(childElement.textContent) : "",
                    nodeType: IGNORE_ELEMENTS.includes(childElement.tagName) ? "IGNORE_ELEMENT" : BLOCK_ELEMENTS.includes(childElement.tagName) ? "BLOCK_ELEMENT" : INLINE_ELEMENTS.includes(childElement.tagName) ? "INLINE_ELEMENT" : "TEXT_NODE"
                    });
                if (node.nodeType == "TEXT_NODE" || node.nodeType == "INLINE_ELEMENT" || node.nodeType == "BLOCK_ELEMENT" || node.nodeType == "IGNORE_ELEMENT"){
                    contents.push(node.content);
                }
                traverseAndUpdate(childElement, childNid, node.children[i]);
              }
            }

            function cleanText(text:any) {
              const continuousSpaceOverTwoCharactorRule = /\s{2,}/g;
              const newText = text.replace(continuousSpaceOverTwoCharactorRule, ' ').replace('\n', '');
              return newText;
            }

            function iterateAndPopulateMap(node:TreeNode) : void {
              //clean logic
              if(validContent(node.content))
              {nodeIdContentMap[node.nid] = node.content;}
  
              for (var i = 0; i < node.children.length; i++) {
              iterateAndPopulateMap(node.children[i]);
              }
          }

          function validContent(content:string) : boolean {
            
            // write cleaning logic here
            if(content == null || content == "")
            {
              return false;
            }
            return true;

          }

          async function makeApiRequest(inputData:string) {
            const apiUrl = 'https://api-inference.huggingface.co/models/h4shk4t/darkpatternLLM';
            const accessToken = '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'; // Replace with your actual access token
        
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(inputData)
            };
        
            try {
                const response = await fetch(apiUrl, requestOptions);
        
                if (!response.ok) {
                    throw new Error(`API request failed with status: ${response.status}`);
                }
        
                const responseData = await response.json();
                // console.log('API Response:', responseData);
                //parse the api response
                var apiResponse = JSON.parse(JSON.stringify(responseData));
                if(apiResponse[0][0].label == "LABEL_1")
                {
                  // possible dark pattern detected
                  console.log("Possible Dark Pattern Detected");
                  score = apiResponse[0][0].score;
                  isDarkPattern = true;
                }
                else
                {
                  // no dark pattern detected
                  console.log("No Dark Pattern Detected");
                  score = apiResponse[0][0].score;
                }
                return { score , isDarkPattern };

            } catch (error:any) {
                console.error('Error making API request:', error.message);
                return { score , isDarkPattern };
            }
        }

        }
      });
    }

    return (
      <>
        <div className="card">
          <button onClick={handleClick}>Get DOM
          </button>
        </div>
      </>
    )
  }
  
  export default Checkbox