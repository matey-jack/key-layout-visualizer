// @ts-ignore
import './app.css'
import './model'
import {LayoutNames, LayoutType} from "./model.ts";

export function App() {
  return (
    <>
        <TopBar/>
    </>
  )
}

const TopBar = () =>
  <div className="grid-container">
    <TopBarBlank/>
    <TopBarKeyboardTab layoutType={LayoutType.IBM}/>
    <TopBarKeyboardTab layoutType={LayoutType.Ortho}/>
    <TopBarKeyboardTab layoutType={LayoutType.Harmonic}/>
    <TopBarBlank/>
  </div>


const TopBarBlank = () =>
  <div className="blank"></div>

const TopBarKeyboardTab = (props: {layoutType: LayoutType}) =>
  <div>
    <div className="top-bar-keyboard-tab-label">{LayoutNames[props.layoutType]}</div>
  </div>