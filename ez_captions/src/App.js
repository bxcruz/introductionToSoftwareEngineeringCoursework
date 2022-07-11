import React, { useRef, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Captions from "./containers/Captions";
import NewCaption from "./containers/NewCaption";
import SubmitFile from "./containers/SubmitFile";
import Login from "./containers/Login";
import Header from "./containers/Header";
import "./containers/RegisterStyle.css"
import Form from "./containers/RegisterForm";

import VideoPlaybackWindow from "./containers/VideoPlaybackWindow";
import "./App.css";
import { parseSRT } from "./containers/SubmitFile";

const App = () => {
    const [captions, setCaptions] = useState([
        // default starting captions
        {
            id: 1,
            start: "00:00",
            end: "00:03",
            text: "[Off-screen voice] Hello there!",
            edit: false,
        },
        {
            id: 2,
            start: "00:07",
            end: "00:12",
            text: "I am talking to you right now,",
            edit: false,
        },
        {
            id: 3,
            start: "00:12",
            end: "00:16",
            text: "on the internet!!",
            edit: false,
        },
    ]);

    let capFile = null;

    // add a new caption and give it a random ID
    const addCaption = (caption) => {
        const id = Math.floor(Math.random() * 10000) + 1; // give the new caption a random ID
        const newCaption = { id, ...caption };
        setCaptions((captions) => [...captions, newCaption]); // update the captions list as the previous list AND the new caption
    };
    
    const deleteCaption = (id) => {
        // filters by keeping all captions that aren't the deleted captions ID
        setCaptions((captions) => captions.filter((caption) => caption.id !== id));
    };

    // allows the pop up for the editing prompt
    const handleEditCaption = (id) => {
        setCaptions((captions) =>  captions.map((caption) => caption.id === id
            ? { ...caption, edit: !caption.edit } : caption ) );
        // setCaptions(captions.map((caption) => caption.id ===
        // id ? updatedCaption : caption))
    };

    // actually does the editing!
    const editCaption = (updatedCaption) => {
        setCaptions((captions) =>  captions.map((caption) => caption.id ===
        updatedCaption.id ? updatedCaption : caption ) );
    };

    // delete all captions function
    const deleteAllCaptions = () => {
        setCaptions((captions) => []);
    }
    
    const downloadCaptions = (captions) => {
        const text = captions.map( (caption, counter) =>
            `${counter + 1}\n00:${caption.start},000 --> 00:${ caption.end },000\n${caption.text}\n\n`).join("");
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const elem = document.createElement("a");
        elem.href = url;
        elem.download = "captions.srt";
        elem.click();
        URL.revokeObjectURL(url);
    };

    const savePreviewCaptions = (prevCaptions) => {
        setCaptions((captions) => [...captions, ...prevCaptions]);
    };

    const setCaptionFile = (file) => {
        capFile = file;
    };

    const importCaptionFile = () => {
        const newCaptions = parseSRT(capFile);
        setCaptions((captions) => newCaptions);
    };

    return (
        <div className="row">
            <div className="login">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Login} />
                    </Switch>
                </BrowserRouter>
                <div className="RegisterStyle">
                <Form />
            </div>
            </div>

            <div className="container">
                <Header onClick={() => downloadCaptions(captions)}> Download Captions </Header>
                <NewCaption onAdd={addCaption} />
                {/* submission form with onAdd prop for the submit button */}
                {captions.length > 0 ? ( // Check if there are no captions in the tool
                    <Captions captions={captions} onDelete={deleteCaption} onToggle={handleEditCaption} onEdit={editCaption} /> )
                    : ( "Please input caption info!" )}
                <SubmitFile onChange={setCaptionFile} onClick={importCaptionFile} />
            </div>
            <VideoPlaybackWindow savePrev={savePreviewCaptions} />
        </div>
    );
};

export default App;
