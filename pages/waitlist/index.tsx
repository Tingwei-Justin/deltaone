import React, { useEffect, useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Join from "./Join/Join";
import { ThemeProvider } from "@material-ui/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { createTheme } from "@material-ui/core/styles";

const Waitlist = () => {
    const theme = createTheme({
        overrides: {
            MuiBackdrop: {
                root: {
                    color: "rgba(0,0,0,0.2)",
                },
            },
        },
    });

    const deltaOneMarquee = () => (
        <>
            <div>
                <img src="deltaLogo.png" />
            </div>
            <div>
                <img src="deltaLogo.png" />
            </div>
            <div>
                <img src="deltaLogo.png" />
            </div>
            <div>
                <img src="deltaLogo.png" />
            </div>
            <div>
                <img src="deltaLogo.png" />
            </div>
            <div>
                <img src="deltaLogo.png" />
            </div>
            <div>
                <img src="deltaLogo.png" />
            </div>
            <div>
                <img src="deltaLogo.png" />
            </div>
        </>
    );

    const [open, setOpen] = useState(false);

    const [hasJoined, setHasJoined] = useState(false);

    const handleAlreadyJoined = () => {
        setHasJoined(true);
        setOpen(true);
    };

    const handleClickOpen = () => {
        setHasJoined(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleReadMore = () => {
        // window.open('https://www.notion.so/Mission-21c534081ee14304b0e762519357bc0e', '_blank');
    };

    const textList = ["Delta One"];

    useEffect(() => {
        const cycle = document.querySelector("#cycle");
        if (cycle === null) {
            return;
        }
        let i = 0;
        const cycleText = () => {
            cycle.innerHTML = textList[i];
            i = ++i % textList.length;
        };
        cycleText();
        setInterval(cycleText, 1000);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <div className="scroll top">{deltaOneMarquee()}</div>
            <div className="max-h-screen flex flex-col justify-center  min-h-screen">
                <p className="cults">Earn APY with</p>
                <div className="highlight-container" style={{ textAlign: "center" }}>
                    <p className="cults highlighted" id="cycle"></p>
                </div>
                <p className="access">
                    <span style={{ opacity: "0.7" }}>Join the waitlist</span> 👇
                </p>
                <div>
                    <div className="flex flex-col items-center">
                        <div>
                            <button className="text-5xl my-20 underline" onClick={() => handleClickOpen()}>
                                SIGN UP
                            </button>
                        </div>
                        <div style={{ opacity: "0.7" }} onClick={() => handleAlreadyJoined()}>
                            already joined? check your position
                        </div>
                    </div>
                </div>
            </div>
            <div className="scroll bottom">{deltaOneMarquee()}</div>
            <Dialog style={{ backgroundColor: "black", maxWidth: "100%" }} fullScreen open={open}>
                <Toolbar style={{ maxWidth: "90%" }}>
                    <IconButton edge="start" style={{ color: "black" }} onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
                <Join alreadyJoined={hasJoined} />
            </Dialog>
        </ThemeProvider>
    );
};
export default Waitlist;
