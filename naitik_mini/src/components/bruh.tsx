import tag from "../Tag.png"
import Card from "./card";

const lmao  = () =>{ 
  console.log("Jbjiref")
}
const handleClick = async () => {
  const [tab] = await chrome.tabs.query({active: true});
  chrome.scripting.executeScript({
    target: { tabId: tab.id!},
    func: async () => {
      const apiUrl = 'http://127.0.0.1:5000/getsentiment';
      let elements = document.getElementsByClassName('a-section review-views celwidget')[0].getElementsByClassName("a-section review aok-relative")
      for (let i = 0; i < elements.length; i++) {
        let review = elements[i].getElementsByClassName("a-expander-content reviewText review-text-content a-expander-partial-collapse-content")[0].getElementsByTagName("span")[elements[i].getElementsByClassName("a-expander-content reviewText review-text-content a-expander-partial-collapse-content")[0].getElementsByTagName("span").length-1].textContent;
        let accountURL = elements[i].getElementsByClassName("a-row a-spacing-mini")[0].getElementsByTagName("a")[0].getAttribute("href");
        // console.log(revi)
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
          console.log(responseData);
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
      <Card heading="Fake Reviews Alertotential to be misled to be used." primaryButton="Clear all fake reviews" secondaryButton="Summarize reviews" content="We have detected fake reviews on this page." imageSrc={tag} onPrimaryButtonClick={handleClick} onSecondaryButtonClick={lmao}></Card>
    </>
  );
}

export default FakeRevew;
