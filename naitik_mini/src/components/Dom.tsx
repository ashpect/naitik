import Card from "./card";
import tag from "../Tag.png"
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
            const parentId = node.nid

            // set naitik id
            rootElement.setAttribute('naitik-id', parentId);
            traverseAndUpdate(rootElement, parentId, node);
            // create map
            iterateAndPopulateMap(node);
            console.log("Node id content Map")
            console.log(nodeIdContentMap);
            
            // TODO ?? Basic clean map abhi (doable) or clean from backend? Depends on size of req and shit as poora content tree bhejna umm.

            // make request
            makeApiRequest(nodeIdContentMap)
              .then(results => {
                for (const key in results) {
                  if (results.hasOwnProperty(key)) {
                      const value = results[key];
                      console.log(`${key}: ${value}`);
                      //inject css with value
                      const element = document.querySelector(`[naitik-id="${key}"]`) as HTMLElement;
                      if (element) {

                        element.style.border = '3px solid red';
                        console.log(element.innerText);
                        const boxDiv = document.createElement('div');
                        boxDiv.style.border = '3px solid blue';
                        boxDiv.style.position = 'absolute';
                        boxDiv.style.left = `${element.offsetLeft + element.offsetWidth + 10}px`;
                        boxDiv.style.top = `${element.offsetTop}px`;
                        boxDiv.innerText = value;
                        const textWidth = boxDiv.offsetWidth;
                        boxDiv.style.width = `${textWidth}px`;

                        // element.style.border = '3px solid red';
                        // console.log(element.innerText);
                        // const boxDiv = document.createElement('div');
                        // boxDiv.style.width = '50px'; 
                        // boxDiv.style.height = '50px'; 
                        // boxDiv.style.border = '3px solid blue';
                        // boxDiv.style.position = 'absolute';
                        // boxDiv.style.left = `${element.offsetLeft + element.offsetWidth + 10}px`;
                        // boxDiv.style.top = `${element.offsetTop}px`;
                        // boxDiv.innerText = value;
                        // document.body.appendChild(boxDiv);

                        if (element.parentNode) {
                          element.parentNode.appendChild(boxDiv);
                        }
                        console.log(element.innerText);
                    } else {
                        console.log('Element not found');
                    }
                  }
              }
                console.log("Kuch to chala hai");
            })
            .catch(error => {
              console.error('Error:', error.message);
            });

            console.log("OHOOO BHAIYA");

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
              if(cleanContent(node.content))
              {nodeIdContentMap[node.nid] = node.content;}
  
              for (var i = 0; i < node.children.length; i++) {
              iterateAndPopulateMap(node.children[i]);
              }
          }

          async function makeApiRequest(requestbody:{ [key: string]: string }) {
            const apiUrl = 'http://127.0.0.1:5000/checkdarkpattern';

            console.log(requestbody)

          //   const allowedValues = [
          //     "LIMITED TIME>> Best Deals of The Year",
          //     "Best Deals of The Year",
          //     "HURRY>> Offer Ends Jan 30th",
          //     "Offer Ends Jan 30th",
          //     "EASY RETURNS: **30 Days Money Back Guaranteed** FREE SHIPPING: **All Continental USA** GUARANTEE: **We will BEAT OR MATCH any Price on This Unit!** QUICK FINANCING APPLICATION: 0% APR available* TRADE & VOLUME DISCOUNTS: ** Call or Chat for Details**",
          //     "EASY RETURNS: **30 Days Money Back Guaranteed**",
          //     "FREE SHIPPING: **All Continental USA**",
          //     "GUARANTEE: **We will BEAT OR MATCH any Price on This Unit!**",
          //     "QUICK FINANCING APPLICATION: 0% APR available*",
          //     "TRADE & VOLUME DISCOUNTS: ** Call or Chat for Details**",
          // ];
          
            // const filteredRequestBody = Object.fromEntries(
            //   Object.entries(requestbody).filter(([_, value]) => allowedValues.includes(value))
            // );

            // console.log("filteredReqBody")
            // console.log(filteredRequestBody)

            const finalRequestBody = {
              website_url: window.location.href,
              data: requestbody
            };

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalRequestBody)
            };
        
            try {
                const response = await fetch(apiUrl, requestOptions);
                if (!response.ok) {
                    throw new Error(`API request failed with status: ${response.status}`);
                }
                return response.json();

            } catch (error:any) {
                console.error('Error making API request:', error.message);
            }
        }

        function cleanContent(content:string) : boolean {
          // write cleaning logic here
          if(content == null || content == "")
          {
            return false;
          }
          return true;
        }

        }
      });
    }

    return (
      <>
          <Card heading="Get Dark Patterns" primaryButton="Show Dark Patterns" content="This website has potential dark patterns present. Utilise a trained model to detect them" imageSrc={tag} onPrimaryButtonClick={handleClick}></Card>
      </>
    )
  }
  
  export default Checkbox