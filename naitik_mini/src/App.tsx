import './App.css';
import Checkbox from './components/Checkbox';
import Dom from './components/Dom';
import Checkprice from './components/CheckPrice';
import logo from "./logo.png";
import FakeRevew from './components/bruh';
function App() {
  const handleClick = () => {
    console.log("You Were reported bitch")
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
