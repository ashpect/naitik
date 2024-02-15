import Card from "./card";
import tag from "../Tag.png";
import { useEffect, useState } from "react";

interface Item {
  Image: string;
  Price: string;
  URL: string;
  Name: string;
}

function Scrapper() {
  const [data, setData] = useState<[Item[], Item[]] | null>(null);
  const [l, setL] = useState(0);
  useEffect(() => {
    chrome.storage.local.get(["data"], (result: { data?: string }) => {
      const parsedData = JSON.parse(result?.data || "[]") as [Item[], Item[]];
      setData(parsedData);
      setL(0)
      setL(Math.min(parsedData[0].length, parsedData[1].length));
      if (parsedData[0].length === 0 && parsedData[1].length === 0) {
        setData(null);
      } else {
        setData(parsedData);
      }
      console.log(data)
    });
  }, []);
  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    {
      const finalRequestBody = {
        url: tab.url,
      };
      console.log(finalRequestBody);
      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: (requestBody: any) => {
          makeApiRequest(requestBody);

          async function makeApiRequest(requestBody: any) {
            const apiUrl = "http://127.0.0.1:5000/search";

            const requestOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            };

            try {
              const response = await fetch(apiUrl, requestOptions);

              if (!response.ok) {
                throw new Error(
                  `API request failed with status: ${response.status}`
                );
              }

              const responseData = await response.json();

              const apiResponse = JSON.parse(JSON.stringify(responseData));
              const convertedData: any[] = [];
              for (const key in apiResponse) {
                if (apiResponse.hasOwnProperty(key)) {
                  convertedData.push(JSON.parse(apiResponse[key]));
                }
              }
              chrome.storage.local.set({ data: JSON.stringify(convertedData) });
            } catch (error: any) {
              console.error("Error making API request:", error.message);
            }
          }
        },
        args: [finalRequestBody],
      });
    }
    ;
  };

  const handleRemoveData = () => {
    chrome.storage.local.remove(["data"]);
    setData(null)
  };

  const openlink = (link: string) => {
    chrome.tabs.create({ url: link });
  };

  return (
    <>
      {l == 0 ? (
        <Card
          imageSrc={tag}
          primaryButton="Check Price"
          heading="Check prices of similar products!"
          content="Like something you see? are you sure it's not being bloated on this website and same everywhere and accross all products?"
          onPrimaryButtonClick={handleClick}
        />
      ) : (
        <div style={{width:"35rem"}}>
          <table>
            <thead>
              <tr>
                <th style={{ backgroundColor: "#53389E", color: "white" }}> Flipkart Image</th>
                <th style={{ backgroundColor: "#53389E", color: "white" }}>Flipkart Price</th>
                <th style={{ backgroundColor: "#53389E", color: "white" }}>Check it Out!</th>
                <th style={{ backgroundColor: "#53389E", color: "white" }}>Amazon Image</th>
                <th style={{ backgroundColor: "#53389E", color: "white" }}>Amazon Price </th>
                <th style={{ backgroundColor: "#53389E", color: "white" }}>Check it Out!</th>
              </tr>
            </thead>
            <tbody>
              {data && data[0] && data[1] && Array.from({ length: l }).map((_, index) => (
                <tr key={index}>
                  <td><img style={{ width: "4rem", height: "4rem" }} src={data[1][index]?.Image} /></td>
                  <td style={{color:"black"}}>{data[1][index]?.Price}</td>
                  <td> <button className="primary-button"
                    onClick={() => openlink(data[1][index]?.URL)} >Flipkart it!</button></td>
                  <td><img style={{ width: "4rem", height: "4rem" }} src={data[0][index]?.Image} /></td>
                  <td style={{color:"black"}}>{data[0][index]?.Price}</td>
                  <td> <button className="primary-button"
                    onClick={() => openlink(data[0][index]?.URL)} >Amazon it!</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="secondary-button" onClick={handleRemoveData}> Go Back!</button>
        </div>
      )}
    </>
  );
}

export default Scrapper;
