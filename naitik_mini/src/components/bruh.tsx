import tag from "../Tag.png"
import Card from "./card";
function FakeRevew() {
  return (
    <>
      <Card heading="Fake Reviews Alert" primaryButton="Clear all fake reviews" secondaryButton="Summarize reviews" content="We have detected fake reviews on this page." imageSrc={tag}></Card>
    </>
  );
}

export default FakeRevew;
