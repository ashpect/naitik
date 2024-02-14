import tag from "../Tag.png"
import Card from "./card";

const handleClick = () => async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id!},
    func: async () => {
      const apiUrl = 'http://127.0.0.1/getsentiment';

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData);
        chrome.storage.local.set({ "data": JSON.stringify(responseData) });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
  })
};

function FakeRevew() {
  return (
    <>
      <Card heading="Fake Reviews Alert" primaryButton="Clear all fake reviews" secondaryButton="Summarize reviews" content="We have detected fake reviews on this page." imageSrc={tag} onPrimaryButtonClick={handleClick}></Card>
    </>
  );
}

export default FakeRevew;
