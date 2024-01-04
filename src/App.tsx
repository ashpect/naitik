import { useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [ colour, setcolour ] = useState('red');

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active : true });
    // giving generic params to executeScript for handling args
    chrome.scripting.executeScript<string[],void>({
      target: { tabId: tab.id! },
      args: [colour],
      func: (colour) => {
        alert('hello world');
        document.body.style.backgroundColor = colour;
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
        <button onClick={handleClick}>Click Me
        </button>
      </div>
      <p className="read-the-docs">
        Click on the logo to visit the website.
      </p>
    </>
  )
}

export default App
