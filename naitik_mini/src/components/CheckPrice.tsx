import { useState } from "react";

function CheckPrice() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [productName, setProductName] = useState("kreo keyboard");
  const [convertedData, setConvertedData] = useState<any[]>([]); // State to store the converted data

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
          console.log(requestBody);
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
              setConvertedData(convertedData); // Update the state
              displayPopup(convertedData)
            } catch (error: any) {
              console.log(error)
              console.error('Error making API request:', error.message);
            }
          }
        },
        args: [finalRequestBody],
      });
    }
  };

  const displayPopup = (data: any[]) => {
    // Create a popup window
    const popupWindow = window.open("", "_blank", "width=800, height=600");
  
    // Create the content of the popup
    const popupContent = document.createElement("div");
  
    // Create and append the table to the popup content
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "20px";
  
    // Create table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
  
    ["Amazon Image", "Amazon Price", "Flipkart Image", "Flipkart Price"].forEach((headerText) => {
      const th = document.createElement("th");
      th.style.border = "1px solid #dddddd";
      th.style.padding = "8px";
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
  
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    // Create table body
    const tbody = document.createElement("tbody");
    data.forEach((item) => {
      const tr = document.createElement("tr");
  
      // Amazon data
      const amazonTd = document.createElement("td");
      const amazonLink = document.createElement("a");
      amazonLink.href = item.amazon.Url;
      amazonLink.target = "_blank";
      amazonLink.rel = "noopener noreferrer";
      const amazonImage = document.createElement("img");
      amazonImage.src = item.amazon.Image;
      amazonImage.alt = "Amazon Product";
      amazonLink.appendChild(amazonImage);
      amazonTd.appendChild(amazonLink);
      tr.appendChild(amazonTd);
  
      const amazonPriceTd = document.createElement("td");
      amazonPriceTd.textContent = item.amazon.Price;
      tr.appendChild(amazonPriceTd);
  
      // Flipkart data
      const flipkartTd = document.createElement("td");
      const flipkartLink = document.createElement("a");
      flipkartLink.href = item.flipkart.Url;
      flipkartLink.target = "_blank";
      flipkartLink.rel = "noopener noreferrer";
      const flipkartImage = document.createElement("img");
      flipkartImage.src = item.flipkart.Image;
      flipkartImage.alt = "Flipkart Product";
      flipkartLink.appendChild(flipkartImage);
      flipkartTd.appendChild(flipkartLink);
      tr.appendChild(flipkartTd);
  
      const flipkartPriceTd = document.createElement("td");
      flipkartPriceTd.textContent = item.flipkart.Price;
      tr.appendChild(flipkartPriceTd);
  
      tbody.appendChild(tr);
    });
  
    table.appendChild(tbody);
  
    // Append the table to the popup content
    popupContent.appendChild(table);
  
    // Append the popup content to the popup window
    popupWindow?.document.body.appendChild(popupContent);
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

      {convertedData.length > 0 && ( // Check if there is data before rendering the table
        <table>
          <thead>
            <tr>
              <th>Amazon Image</th>
              <th>Amazon Price</th>
              <th>Flipkart Image</th>
              <th>Flipkart Price</th>
            </tr>
          </thead>
          <tbody>
            {convertedData.map((item, index) => (
              <tr key={index}>
                <td>
                  <a href={item.amazon.Url} target="_blank" rel="noopener noreferrer">
                    <img src={item.amazon.Image} alt="Amazon Product" />
                  </a>
                </td>
                <td>{item.amazon.Price}</td>
                <td>
                  <a href={item.flipkart.Url} target="_blank" rel="noopener noreferrer">
                    <img src={item.flipkart.Image} alt="Flipkart Product" />
                  </a>
                </td>
                <td>{item.flipkart.Price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default CheckPrice;
