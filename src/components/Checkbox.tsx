function Checkbox() {

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active : true });
    // giving generic params to executeScript for handling args
    chrome.scripting.executeScript<string[],void>({
      target: { tabId: tab.id! },
      args: [],
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
        alert("Unchecked " + allInputs.length + "boxes , which were a potential to be misled to be used.");
      }
    });
  }


  return (
    <>
      <div className="card">
        <button onClick={handleClick}>Uncheck All The Checkboxes
        </button>
      </div>
    </>
  )
}

export default Checkbox