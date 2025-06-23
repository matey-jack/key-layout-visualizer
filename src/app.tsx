// @ts-ignore
import './app.css'
import './model'
import {LayoutType, LayoutNames, LayoutElements, LayoutDescriptions} from "./model.ts";
import {KeyboardSvg} from "./KeyboardSvg.tsx";
import {QwertyMapping} from "./KeyMapping.tsx";
import {useState} from "react";
import {TruncatedText} from "./TruncatedText.tsx";

export function App() {
    const [selectedLayout, setLayout] = useState(LayoutType.Harmonic);
    const KeyboardElement = LayoutElements[selectedLayout]!!;

    return (
        <>
            <TopBar selectedLayout={selectedLayout} setLayout={setLayout}/>
            <KeyboardSvg>
                <KeyboardElement mapping={QwertyMapping.mapping}/>
            </KeyboardSvg>
            <div className="layout-description">
                <TruncatedText text={LayoutDescriptions[selectedLayout]} />
            </div>
        </>
    )
}


interface TopBarProps {
    selectedLayout: LayoutType;
    setLayout: (layoutType: LayoutType) => void;
}

function TopBar(props: TopBarProps) {
    const layoutOrder = [LayoutType.ANSI, LayoutType.Harmonic, LayoutType.Ortho];
    return <div className="grid-container">
        <TopBarBlank/>
        {layoutOrder.map((layoutType) =>
            <TopBarKeyboardTab
                layoutType={layoutType}
                setLayoutType={props.setLayout}
                isSelected={layoutType === props.selectedLayout}
            />
        )}
        <TopBarBlank/>
    </div>
}

const TopBarBlank = () =>
    <div className="blank"></div>

interface TopBarKeyboardTabProps {
    layoutType: LayoutType,
    setLayoutType: (layoutType: LayoutType) => void,
    isSelected: boolean
}

const TopBarKeyboardTab = (props: TopBarKeyboardTabProps) =>
    <div
        onClick={() => props.setLayoutType(props.layoutType)}
    >
        <button className={"top-bar-keyboard-tab-label " + (props.isSelected ? "selected" : "")}>
            {LayoutNames[props.layoutType]}
        </button>
    </div>
