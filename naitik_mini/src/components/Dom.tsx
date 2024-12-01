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

// Define the input format type
interface InputData {
  [id: string]: string;
}

// Function to process each sentence and get the response
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


            console.log("Declaring mock content map");
          //   nodeIdContentMap = {
          //     "root-1-3-1-3-1-2-0-0-3-2-6-3-2": "LIMITED TIME>> Harvest Season Specials",
          //     "root-1-3-1-3-1-2-0-0-3-2-6-3-3": "HURRY>> Offer Ends Nov 30th",
          //     "root-1-3-1-3-1-2-0-0-3-2-6-4": "88 Viewing This Product",
          // }
            
            // TODO ?? Basic clean map abhi (doable) or clean from backend? Depends on size of req and shit as poora content tree bhejna umm.

            // make request
            askNano(nodeIdContentMap)
              .then(results => {
                console.log(results);
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

                        if (element.parentNode) {
                          element.parentNode.appendChild(boxDiv);
                        }
                        console.log(element.innerText);
                    } else {
                        console.log('Element not found');
                    }
                  }
              }
            })
            .catch(error => {
              console.error('Error:', error.message);
            });

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

          var session: ai.languageModel.Session | null = null;

          async function analyzeDarkPatterns(inputData: InputData): Promise<{ [id: string]: string }> {
            console.log('Analyzing dark patterns...somyaaaaaaaaaaaaaaaaaaa');
            const results: { [id: string]: string } = {};
          
            // Iterate through each sentence with its ID
            for (const [id, sentence] of Object.entries(inputData)) {
              const prompt = sentence.trim();
              
              // Prepare parameters for API call
              const params = {
                //systemPrompt: 'Analyze the given text to identify whether it contains any dark patterns, which are deceptive or manipulative tactics aimed at influencing user behavior.\nCategorize the text as either "None (Safe)" if it does not appear to be a dark pattern, or "Dark Pattern" if it seems to be manipulative, even if the statement is technically true. Do not provide any explaination. \nConsider factors like creating false urgency, emotional manipulation, scarcity tactics, or attempts to mislead users.\nBe especially vigilant for subtle tactics that might exploit psychological biases or create a sense of urgency or fear of missing out.\nExamples of dark patterns include:\n"Hurry! Only 2 items left at this price!"\n"You have already saved $50! Complete your purchase now."\n"Thousands of people are viewing this product right now!"\n"Limited time offer: 10 minutes remaining!"',

                systemPrompt: 'Analyze the given text to identify whether it employs any dark patterns, which are deceptive or manipulative tactics aimed at influencing user behavior.\nClassify the text into one of the following categories:\n\nforced_action: Requires users to take an action they might not want to in order to proceed.\nmisdirection: Distracts or misleads users to make them take actions they might not otherwise take.\nnot_dark_pattern: Safe and does not contain manipulative tactics.\nobstruction: Makes it deliberately difficult for users to complete a task or opt-out of something.\nscarcity: Creates a false sense of limited availability to pressure users.\nsneaking: Hides information or sneaks something into the user’s experience without their knowledge.\nsocial_proof: Uses peer pressure or perceived popularity to influence decisions.\nfake_urgency: Instills a sense of time pressure to push immediate action.\n\nDo not provide any explanation; simply classify the text into one of the above categories. Be especially vigilant for subtle tactics that exploit psychological biases, such as creating urgency, fear of missing out, or leveraging social proof.\n\nExamples:\n1. Forced Action\n"To access your account, you must agree to receive promotional emails."\n\n2. Misdirection\n"Click here to confirm your refund." (Button actually signs up for a subscription instead of processing a refund.)\n\n3. Not Dark Pattern\n"Your session will expire in 10 minutes for security reasons. Please log in again to continue."\n\n4. Obstruction\n"To unsubscribe, please send a handwritten letter to our office."\n\n5. Scarcity\n"Only 3 items left in stock—order now to avoid missing out!"\n\n6. Sneaking\n"By clicking Accept, you also agree to a free trial subscription that auto-renews after 7 days."\n\n7. Social Proof\n"1,000 people have purchased this product in the last hour!"\n\n8. Fake Urgency\n"Hurry! This offer expires in the next 5 minutes!"',
                temperature: parseFloat('1'),  // Default to 0 if null
                topK: parseInt('3'),  // Default to 0 if null
              };
          
              try {
                const response = await runPrompt('The given string is: ' + prompt, params);
                results[id] = response;  // Store response with the ID
              } catch (e) {
                results[id] = 'Error: ' + (e instanceof Error ? e.message : 'Unknown error');  // Handle error and return it for this sentence
              }
            }
          
            return results;
          }
          
          async function runPrompt(prompt: string, params: any): Promise<string> {
            try {
              if (!session) {
                console.log('Creating new session');
                session = await ai.languageModel.create(params);
              }

              console.log('Running prompt:', prompt);
              return session.prompt(prompt);
            } catch (e) {
              console.log('Prompt failed');
              console.error(e);
              console.log('Prompt:', prompt);
              // Reset session
              await reset();
              throw e;
            }
          }
          
          async function reset(): Promise<void> {
            if (session) {
              session.destroy();
            }
            session = null;
          }
          
          

          //First I will assume that I have an askNano function that takes the content map and returns the dark patterns ka map
          async function askNano(requestbody:{ [key: string]: string }) {

            const allowedValues = [
              "LIMITED TIME>> Harvest Season Specials ",
              "HURRY>> Offer Ends Nov 30th ",
            ];

            const filteredRequestBody = Object.fromEntries(
              Object.entries(requestbody).filter(([_, value]) => allowedValues.includes(value))
            );
            console.log("-----------------filteredReqBody-----------------------");
            console.log(filteredRequestBody);
            console.log("-------------------------------------------------------");
            const cleanedMap = cleanup(filteredRequestBody);
            console.log("-----------------cleanedMap-----------------------");
            console.log(cleanedMap);
            console.log("-------------------------------------------------------");
            


            if (requestbody) {
              var resultMap: { [key: string]: string } = {};
              
              
              try {
                const darkPatternsResults = await analyzeDarkPatterns(cleanedMap);
                console.log("-----------------darkPatternsResults-----------------------");
            
                // Populate resultMap with the responses from analyzeDarkPatterns
                for (const key in cleanedMap) {
                  if (cleanedMap.hasOwnProperty(key)) {
                    resultMap[key] = darkPatternsResults[key] || 'Unknown';  // Use the result or 'Unknown' if no result
                  }
                }
            
                return resultMap;
              } catch (e) {
                // Handle any errors that occur during the analysis

                return { error: 'Error analyzing dark patterns: ' + (e instanceof Error ? e.message : 'Unknown error') };
              }
            }
          }
            

          function cleanup(inputDict: { [key: string]: string }) {
            var filteredDict: { [key: string]: string } = {};
        
            for (var key in inputDict) {
                if (!inputDict.hasOwnProperty(key)) continue;
        
                var value = inputDict[key];
        
                // Skip if value is a single space, contains '{', or is longer than 156 characters
                if (value === " " || value.indexOf('{') !== -1 || value.length > 156) {
                    continue;
                }
        
                // Check if value starts with an alphanumeric character, a letter, or a space
                if (value && (value[0].match(/^[a-zA-Z0-9 ]$/) || value[0] === ' ')) {
                    filteredDict[key] = value;
                }
            }
        
            // Further filter out keys where '{' is in the first 30 characters of the value
        
            // Call cleanusingtries on the filtered dictionary
            var cleanedMap = cleanUsingTries(filteredDict);
        
            return cleanedMap;
        }

        function cleanUsingTries(A: { [key: string]: string }): { [key: string]: string } {
          // Strip whitespace from values
          for (const a in A) {
              if (A.hasOwnProperty(a)) {
                  A[a] = A[a].trim();
              }
          }
      
          // Sort the keys
          const L = Object.keys(A).sort();
      
          // Initialize root and B
          const root: { [key: number]: [Record<number, any>, string] } = {};
          const B: { [key: string]: string } = {};
      
          // Process each key in L
          for (const l of L) {
              const V = l.split('-');
              if (V.length < 2) {
                  continue; // Skip keys without '-'
              }
      
              let pre: { [key: number]: [Record<number, any>, string] } | null = null;
              let cur: Record<number, any> = root;
      
              for (let i = 1; i < V.length; i++) {
                  const v = parseInt(V[i]);
                  if (isNaN(v)) {
                      continue; // Skip invalid numbers
                  }
                  if (v in cur) {
                      if (cur[v][1] === A[l]) {
                          break;
                      }
                      pre = cur;
                      cur = cur[v][0];
                      continue;
                  } else {
                      cur[v] = [{}, "INVALID"];
                      pre = cur;
                      cur = cur[v][0];
                      continue;
                  }
              }
      
              // If the loop didn't break, update the last node
              if (pre !== null) {
                  const lastV = parseInt(V[V.length - 1]);
                  if (!isNaN(lastV) && pre.hasOwnProperty(lastV)) {
                      pre[lastV][1] = A[l];
                      B[l] = A[l];
                  }
              }
          }
      
          return B;
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