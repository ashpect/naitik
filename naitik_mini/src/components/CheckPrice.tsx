function CheckPrice() {

    const handleClick = async () => {
      let [tab] = await chrome.tabs.query({ active : true });
      // giving generic params to executeScript for handling args
      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => {

            console.log("Sending req")
            makeApiRequest()
            console.log("Request sent")

          async function makeApiRequest() {
            const apiUrl = 'http://127.0.0.1:5000/search';
            const finalRequestBody = {
              product: "kreo Keyboard"  
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
        
                const responseData = await response.json();
                var apiResponse = JSON.parse(JSON.stringify(responseData));
                console.log(apiResponse)

            } catch (error:any) {
                console.error('Error making API request:', error.message);
            }
        }

        }
      });
    }

    return (
      <>
        <div className="card">
          <button onClick={handleClick}>Check Price
          </button>
        </div>
      </>
    )
  }
  
  export default CheckPrice