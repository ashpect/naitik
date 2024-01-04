import { useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [ colour, setcolour ] = useState('red');
  // var count = 0;

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active : true });
    // giving generic params to executeScript for handling args
    chrome.scripting.executeScript<string[],void>({
      target: { tabId: tab.id! },
      args: [colour],
      func: () => {
        // document.body.style.backgroundColor = colour;
        let count = 0;
        let allInputs = document.getElementsByTagName("input");
        if(allInputs.length > 0){
          for(let i=0; i<allInputs.length; i++){
            if (allInputs[i].type = 'checkbox'){
              allInputs[i].checked = true;
              count++;
            }
          }
        }
        alert("Unchecked the boxes : " + allInputs.length);
      }
    });
  }


  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Naitik</h1>
      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}> */}
        <input type="color" value={colour} onChange={(e) => setcolour(e.currentTarget.value)} />
        <button onClick={handleClick}>Uncheck All
        </button>
      </div>
      <p className="read-the-docs">
        Click on the logo to visit the website.
      </p>
    </>
  )
}

export default App
