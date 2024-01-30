import './App.css';
import Checkbox from './components/Checkbox';
import Dom from './components/Dom';
import Checkprice from './components/CheckPrice';
import logo from "./logo.png";
import { useState } from 'react';

function App() {
  interface Item {
    Image: string;
    Price: string;
    URL: string;
    Name: string
  }
  const [data, setData] = useState<[Item[], Item[]]>([[], []]);
  const [l, setL] = useState(0)
  chrome.storage.local.get(["data"], (result: { data?: string }) => {
    const parsedData = JSON.parse(result?.data || '[]');
    setData(parsedData)
    setL(Math.min(Object.keys(parsedData[0]).length, Object.keys(parsedData[1]).length));  });

  const handleClick = () => {
    chrome.storage.local.remove(["data"]);
  };

  const openlink = (link:string) =>{
    chrome.tabs.create({url: link});
  }
  return (
    <div style={{ background: "white", minHeight: "25rem", display: "flex", flexDirection: "column" }}>
      {l == 0 ? (
        <>        
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
          <img src={logo} style={{ height: "2.125rem" }} alt="Logo" />
          <h1>Naitik</h1>
        </div>
          <div style={{ display: "flex" }}>
            <Checkbox />
            <Dom />
            <Checkprice />
          </div>
          <p className="read-the-docs">
            Click on the logo to visit the website.
          </p>
          </>

          ) : (
        <div style={{width:"35rem"}}>
          <button style={{ height: "2rem", margin: "8px" }} onClick={handleClick}>
            Go Back
          </button>
            <table>
              <thead>
                <tr>
                  <th style={{backgroundColor:"#53389E", color:"white"}}> Flipkart Image</th>
                  <th style={{backgroundColor:"#53389E", color:"white"}}>Flipkart Price</th>
                  <th style={{backgroundColor:"#53389E", color:"white"}}>Check it Out!</th>
                  <th style={{backgroundColor:"#53389E", color:"white"}}>Amazon Image</th>
                  <th style={{backgroundColor:"#53389E", color:"white"}}>Amazon Price </th>
                  <th style={{backgroundColor:"#53389E", color:"white"}}>Check it Out!</th>

                </tr>
              </thead>
              <tbody>
              {Array.from({ length: l }).map((_, index) => (
              <tr key={index}>
                <td><img style={{width:"4rem",height:"4rem"}}src={data[1][index]?.Image}/></td>
                <td>{data[1][index]?.Price}</td>
                <td>  <button style={{ height: "2rem", margin: "8px" }} 
                                    onClick={() => openlink(data[1][index]?.URL)} >Flipkart it!</button></td>
                <td><img style={{width:"4rem",height:"4rem"}} src={data[0][index]?.Image}/></td>
                <td>{data[0][index]?.Price}</td>
                <td>  <button style={{ height: "2rem", margin: "8px" }} 
                                    onClick={() => openlink(data[0][index]?.URL)} >Amazon it!</button></td>

              </tr>
            ))}
              </tbody>
            </table>
            </div>
      )}
    </div>
  );
}

export default App;
