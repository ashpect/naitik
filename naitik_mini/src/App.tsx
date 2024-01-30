import './App.css'
import Checkbox from './components/Checkbox'
import Dom from './components/Dom'
import Checkprice from './components/CheckPrice'
import logo from "./logo.png"
function App() {

  return (
    <div style={{background:"white", minHeight:"25rem", display:"flex", flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"1rem"}}>
        <img src={logo} style={{height:"2.125rem"}}/>
      <h1>Naitik</h1>
      </div>
      <div style={{display:"flex"}}>
      <Checkbox />
      <Dom />
      <Checkprice />
      </div>
      <p className="read-the-docs">
        Click on the logo to visit the website.
      </p>
    </div> 
  )
}

export default App
