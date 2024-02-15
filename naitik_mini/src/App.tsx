import './App.css';
import Checkbox from './components/Checkbox';
import Dom from './components/Dom';
import Checkprice from './components/CheckPrice';
import logo from "./logo.png";
import FakeRevew from './components/bruh';
import Scrapper from './components/scrap';
function App() {

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active : true });
    // giving generic params to executeScript for handling args
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
          var hoveredElement: EventTarget | null = null;

          document.addEventListener('mouseover', function(event) {
              hoveredElement = event.target;
          });

            document.addEventListener('click', function() {
              if (hoveredElement) {
                console.log(hoveredElement);
                // You can display the element details in a popup or any other way you prefer
                // For example, you can use the browser's console to log the element details
                //add a popup hereh
                alert("You have reported the element. Thank you for your contribution.");
              }
            });

            document.removeEventListener('mouseover', function(event) {
              hoveredElement = event.target;
            });
      }
    });
    // chrome.tabs.executeScript(tab.id!, {
    //   code: `
    //     document.removeEventListener('mouseover', function(event) {
    //       hoveredElement = event.target;
    //     });
    //     document.removeEventListener('click', function() {
    //       if (hoveredElement) {
    //         console.log(hoveredElement);
    //       }
    //     });
    //   `
    // });
  }

  return (
    <div style={{ background: "white", minHeight: "25rem", display: "flex", flexDirection: "column", overflow:"auto", minWidth:"20rem"}}>  
  <div style={{ background: "white", minHeight: "25rem", display: "flex", flexDirection: "column",borderRadius:"8px", overflow:"auto" }}>
  <div style={{justifyContent:"space-between",display:"flex",height:"2rem",padding:"1rem"}}>        
  <div style={{ display: "flex", justifyContent: "left", alignItems: "center", gap: "1rem"}}>
    <img src={logo} style={{ height: "2em" }} alt="Logo" />
    <h1>Naitik</h1>
  </div>
  <div style={{color:"#9599A1",display:"flex",alignItems:"center",fontSize:"1.75rem",marginLeft:"1rem"}}>
    X
  </div>
  </div>
    <div style={{ display: "flex", flexDirection:"column"}}>
    <Checkprice />
      <Checkbox />
      <Dom/>
      <FakeRevew/>
      <Scrapper/>
    </div>

    <p className="read-the-docs">
      Click on the logo to visit the website.
    </p>
</div>
<div style={{color:'black',flexDirection:"row",justifyContent:"space-between", display:"flex",alignItems:"center"}} >
      <b>Detected something unusual? </b>
      <button className='tertiary-button' onClick={handleClick}>Report</button>
    </div>
    </div>
  );
}

export default App;


// import './App.css';
// import Checkbox from './components/Checkbox';
// import Dom from './components/Dom';
// import Checkprice from './components/CheckPrice';
// import logo from "./logo.png";
// import FakeRevew from './components/bruh';

// // Define event handlers globally
// let hoveredElement: EventTarget | null = null;

// const handleMouseover = (event: MouseEvent) => {
//     hoveredElement = event.target;
//     document.removeEventListener('mouseover', handleMouseover);
// };

// const handleClick = () => {
//     if (hoveredElement !== null) {
//         console.log(hoveredElement);
//         // You can display the element details in a popup or any other way you prefer
//         // For example, you can use the browser's console to log the element details

//         // Send message to background script to remove the content script
//         chrome.runtime.sendMessage({ removeScript: true });
//     }
//     document.removeEventListener('click', handleClick);
// };

// const handleClickScript = async () => {
//     let [tab] = await chrome.tabs.query({ active: true });
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id! },
//         func: () => {
//             document.addEventListener('mouseover', handleMouseover);
//             document.addEventListener('click', handleClick);
//         }
//     });
//     console.log("You were reported bitch");
// }

// // Listen for messages from the content script
// chrome.runtime.onMessage.addListener((message, sender) => {
//   // If message contains instruction to remove script, remove it
//   if (message.removeScript) {
//     chrome.scripting.executeScript({
//       target: { tabId: sender?.tab?.id ?? 0 },
//       func: () => {
//         // Remove event listeners
//         document.removeEventListener('mouseover', handleMouseover);
//         document.removeEventListener('click', handleClick);
//       }
//     });
//   }
// });

// function App() {
//     return (
//         <div style={{ background: "white", minHeight: "25rem", display: "flex", flexDirection: "column", overflow:"auto", minWidth:"20rem"}}>
//             <div style={{ background: "white", minHeight: "25rem", display: "flex", flexDirection: "column",borderRadius:"8px", overflow:"auto" }}>
//                 <div style={{justifyContent:"space-between",display:"flex",height:"2rem",padding:"1rem"}}>
//                     <div style={{ display: "flex", justifyContent: "left", alignItems: "center", gap: "1rem"}}>
//                         <img src={logo} style={{ height: "2em" }} alt="Logo" />
//                         <h1>Naitik</h1>
//                     </div>
//                     <div style={{color:"#9599A1",display:"flex",alignItems:"center",fontSize:"1.75rem",marginLeft:"1rem"}}>
//                         X
//                     </div>
//                 </div>
//                 <div style={{ display: "flex", flexDirection:"column"}}>
//                     <Checkprice />
//                     <Checkbox />
//                     <Dom/>
//                     <FakeRevew/>
//                 </div>

//                 <p className="read-the-docs">
//                     Click on the logo to visit the website.
//                 </p>
//             </div>
//             <div style={{color:'black',flexDirection:"row",justifyContent:"space-between", display:"flex",alignItems:"center"}} >
//                 <b>Detected something unusual? </b>
//                 <button className='tertiary-button' onClick={handleClickScript}>Report</button>
//             </div>
//         </div>
//     );
// }

// export default App;
