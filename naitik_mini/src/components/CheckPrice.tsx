import { useState } from "react";
function CheckPrice() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [productName, setProductName] = useState("kreo keyboard");

  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    const productInput = document.getElementById("productInput") as HTMLInputElement | null;

    if (productInput) {
      const finalRequestBody = {
        product: productInput.value,
      };

      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: (requestBody: any) => {
          console.log("Sending req");
          makeApiRequest(requestBody);
          console.log("Request sent");

          async function makeApiRequest(requestBody: any) {
            const apiUrl = 'http://127.0.0.1:5000/search';

            const requestOptions = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            };

            try {
              const response = await fetch(apiUrl, requestOptions);

              if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
              }

              const responseData = await response.json();

              // Convert the response data and update the state
              const apiResponse = JSON.parse(JSON.stringify(responseData));
              const convertedData: any[] = [];
              for (const key in apiResponse) {
                if (apiResponse.hasOwnProperty(key)) {
                  convertedData.push(JSON.parse(apiResponse[key]));
                }
              }
              console.log(convertedData);
              chrome.storage.local.set({"data":JSON.stringify(convertedData)})
            } catch (error: any) {
              console.error('Error making API request:', error.message);
            }
          }
        },
        args: [finalRequestBody],
      });
    }
  };
  return (
    <>
      <div className="card">
        <button onClick={handleSearchClick}>Check Price</button>
        {searchVisible && (
          <div style={{ display: "flex", flexDirection: "row", marginLeft: "-15rem", marginTop: "2rem" }}>
            <input
              type="text"
              id="productInput"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={{
                borderRadius: '8px',
                backgroundColor: 'white',
                color: 'grey',
                fontSize: '1.2em',
                padding: '8px',
                margin: '8px',
              }}
            />
            <button style={{ height: "2rem", margin: "8px" }} onClick={handleClick}>
              Search
            </button>
            </div>
          )}
      </div>
    </>
  );
}

export default CheckPrice;
