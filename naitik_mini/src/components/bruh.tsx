import tag from "../Tag.png"
import Card from "./card";

const lmao  = () =>{ 
  console.log("Jbjiref")
}
const handleClick = async () => {
  console.log("clicked for fake reviews")
  const [tab] = await chrome.tabs.query({active: true});
  chrome.scripting.executeScript({
    target: { tabId: tab.id!},
    func: async () => {
      console.log("----fake reviews detection, lessgoo----")
      const apiUrl = 'http://127.0.0.1:5000/getsentiment';
      console.log("----test1----")
      let elements = document.getElementsByClassName('a-section review-views celwidget')[0].getElementsByClassName("a-section review aok-relative")
      console.log("----test2----")
      for (let i = 0; i < elements.length; i++) {
        console.log("----test3----")
        let reviewElement = elements[i] as HTMLElement;
        console.log("----test4----")
        let review = elements[i].getElementsByClassName("a-expander-content reviewText review-text-content a-expander-partial-collapse-content")[0].getElementsByTagName("span")[elements[i].getElementsByClassName("a-expander-content reviewText review-text-content a-expander-partial-collapse-content")[0].getElementsByTagName("span").length-1].textContent;
        console.log("----test5----")
        let accountURL = elements[i].getElementsByClassName("a-row a-spacing-mini")[0].getElementsByTagName("a")[0].getAttribute("href");
        if(accountURL= null){
          continue;
        }
        console.log(accountURL)
        console.log("----test6----")
        let data = {
          "review": review?.toString().replace('\n', ''),
          "accountURL":"https://www.amazon.in"+accountURL
        }
        console.log(JSON.stringify(data));
        try{
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          const responseData = await response.json();
          const val = responseData["Single review score"];
          if(Math.abs(val)>0.7){
            reviewElement.style.position = 'relative'; // Set position to relative to enable absolute positioning of the text element
            reviewElement.style.border = '2px solid blue';

            // Create and append text element
            let textElement = document.createElement('div');
            textElement.textContent = `Probability of wrong is ${Math.abs(val)}`;
            textElement.style.position = 'absolute';
            textElement.style.top = '0';
            textElement.style.left = '100%';
            textElement.style.padding = '2px 5px';
            textElement.style.background = 'blue';
            textElement.style.color = 'white';
            reviewElement.appendChild(textElement);
          }
        }
        catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }
    }
  })
};

function FakeRevew() {
  return (
    <>
      <Card heading="Fake Reviews Alert: potential to be misled." primaryButton="Mark all fake reviews" secondaryButton="Summarize reviews" content="We have detected fake reviews on this page." imageSrc={tag} onPrimaryButtonClick={handleClick} onSecondaryButtonClick={lmao}></Card>
    </>
  );
}

export default FakeRevew;
