import Card from "./card";
import tag from "../CheckSquare.png";
function Checkbox() {

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active : true });
    // giving generic params to executeScript for handling args
    chrome.scripting.executeScript<string[],void>({
      target: { tabId: tab.id! },
      args: [],
      func: uncheckAllCheckboxes
    });
  }

  const uncheckAllCheckboxes = () => {
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

  return (
    <>
    <Card heading="Checkboxes on this website were pre-checked" tertiaryButton="Revert back changes" content="We have unchecked all the checkboxes in this page." imageSrc={tag} onTertiaryButtonClick={handleClick}></Card>
        </>
  )
}

export default Checkbox