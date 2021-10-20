import React, { MouseEventHandler, useState } from "react";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import TextField from "@material-ui/core/TextField";
import axios, { AxiosResponse } from "axios";
import confetti from "canvas-confetti";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://cqptxdjgwcytroptgdip.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

//import CloseIcon from '@material-ui/icons/Close';

export interface JoinProps {
    alreadyJoined: boolean;
}

export interface WaitlistData {
    total_referrals: number;
    current_priority: number;
}
function Join({ alreadyJoined }: JoinProps) {
    const [showConfetti, setShowConfetti] = useState(true);
    const [email, setEmail] = useState("");
    const [currentPriority, setCurrentPriority] = useState<number | null>(null);
    const [referralLink, setReferralLink] = useState<string>("");
    const [referrals, setReferrals] = useState<number | null>(null);

    const [snackOpen, setSnackOpen] = React.useState(false);

    const handleSnackClose = (
        event: React.SyntheticEvent<any> | MouseEventHandler<HTMLAnchorElement>,
        reason: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackOpen(false);
    };

    const handleChange = (event: any) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event: any) => {
        supabase.auth
            .signUp({
                email: "someone@email.com",
                password: "VHhZkyCuzhiOwtJxFHHW",
            })
            .then(data => console.log(data))
            .catch(error => console.log(error));

        let contactData = {
            email: "pramceod@shailesh.com",
            preSaleInterest: "Yes",
            api_key: "W8139D",
            referral_link: document.URL,
        };

        axios
            .post<AxiosResponse<WaitlistData>>("https://getwaitlist.com/api/v1/waitlists/submit", contactData)
            .then(data => {
                window.history.replaceState(null, "", contactData.referral_link); // or pushState

                setReferralLink(contactData.referral_link);
                // @ts-ignore
                setCurrentPriority(data.current_priority);
                // @ts-ignore
                setReferrals(data.total_referrals);
                setReferralLink(contactData.referral_link);
                setShowConfetti(true);

                confetti({
                    zIndex: 10000,
                    particleCount: 200,
                    colors: ["#09188D", "#00C4FF", "#FF00F3", "#FF0076"],
                    //scalar: 1.25,
                });
            })
            .catch(error => {
                console.error("Error:", error);
            });
    };

    function copyLink() {
        navigator.clipboard.writeText(referralLink);
        setSnackOpen(true);
    }

    function tweet() {
        var url =
            "https://twitter.com/intent/tweet?" +
            "via=deltafarming&text=I%27m%20%23" +
            currentPriority +
            "%20on%20the%20Delta%20One%20Waitlist%20%F0%9F%91%80%0A%F0%9F%91%89%20" +
            encodeURIComponent(referralLink) +
            "%0A%0A";

        console.log(url);
        window.open(url);
    }

    return (
        <div>
            {showConfetti ? (
                <div id="showInfo">
                    <p className="info" style={{ fontSize: "2vh", marginBottom: "25px" }}>
                        You are
                    </p>
                    <h1>
                        <b className="info" id="waitNFT" style={{ fontSize: "10vh" }}>
                            #{currentPriority && currentPriority > 1 ? currentPriority : 1}
                        </b>
                    </h1>
                    <p className="info" style={{ fontSize: "2vh", lineHeight: "150%" }}>
                        The top 10 will get:
                    </p>
                    <p className="info" style={{ fontSize: "2.5vh", lineHeight: "150%" }}>
                        👉 first access to earning APY with{" "}
                        <b id="waitNFT" style={{ fontWeight: 900 }}>
                            Delta One.
                        </b>
                    </p>
                    <p className="info" style={{ fontSize: "2.5vh", lineHeight: "150%" }}>
                        👉 spots in presale for the
                        <b id="waitNFT" style={{ fontWeight: 900 }}>
                            Delta DAO token.
                        </b>
                    </p>
                    <p className="info" style={{ fontSize: "2vh", lineHeight: "150%" }}>
                        To move up in line, share this link 👇
                    </p>

                    <button id="twitter-button" className="custom-button" onClick={() => tweet()}>
                        TWEET
                    </button>
                    <p style={{ cursor: "pointer" }} onClick={() => copyLink()}>
                        <u id="already-joined">copy link to clipboard</u>
                    </p>

                    <div className="info-bottom">
                        <p className="info" style={{ fontSize: "2vh", lineHeight: "150%" }}>
                            Each person you refer will bump you up <b>25</b> spaces.
                        </p>
                        <p className="info" style={{ fontSize: "2vh", lineHeight: "150%" }}>
                            ( You have referred{" "}
                            <b id="waitNFT-background" style={{ fontWeight: 900 }}>
                                {referrals && referrals > 0 ? referrals : 0}
                            </b>{" "}
                            )
                        </p>
                    </div>
                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        open={snackOpen}
                        autoHideDuration={3000}
                        onClose={handleSnackClose}>
                        <SnackbarContent
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                borderRadius: "10px",
                            }}
                            message="copied to clipboard"
                            action={
                                <React.Fragment>
                                    <Button
                                        color="secondary"
                                        size="small"
                                        onClick={event => handleSnackClose(event, "clickaway")}>
                                        close
                                    </Button>
                                    <IconButton
                                        size="small"
                                        aria-label="close"
                                        color="inherit"
                                        onClick={event => handleSnackClose(event, "clickaway")}>
                                        {/* <CloseIcon fontSize="small" /> */}
                                    </IconButton>
                                </React.Fragment>
                            }
                        />
                    </Snackbar>
                </div>
            ) : alreadyJoined ? (
                <form onSubmit={handleSubmit} className="email-form" noValidate autoComplete="off">
                    <div id="form">
                        <TextField
                            autoFocus
                            style={{ maxWidth: "70%" }}
                            id="standard-basic"
                            label="Email"
                            onChange={handleChange}
                            inputProps={{ style: { fontSize: 30 } }}
                            InputLabelProps={{ style: { fontSize: 20 } }}
                        />
                        <button id="go" className="custom-button" type="submit">
                            GO
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="email-form" noValidate autoComplete="off">
                    <div id="form">
                        <TextField
                            autoFocus
                            style={{ maxWidth: "70%" }}
                            id="standard-basic"
                            label="Email"
                            onChange={handleChange}
                            inputProps={{ style: { fontSize: 30 } }}
                            InputLabelProps={{ style: { fontSize: 20 } }}
                        />
                        <br></br>
                        <TextField
                            style={{ maxWidth: "70%" }}
                            id="standard-basic"
                            label="Twitter"
                            onChange={handleChange}
                            inputProps={{ style: { fontSize: 30 } }}
                            InputLabelProps={{ style: { fontSize: 20 } }}
                        />
                        <br></br>
                        <TextField
                            style={{ maxWidth: "70%" }}
                            id="standard-basic"
                            label="How much are you interested in farming through Delta One?"
                            onChange={handleChange}
                            inputProps={{ style: { fontSize: 30 } }}
                            InputLabelProps={{ style: { fontSize: 20 } }}
                        />
                        <br></br>
                        <TextField
                            style={{ maxWidth: "70%" }}
                            id="standard-basic"
                            label="Would you like to join the presale for our Delta DAO token?"
                            onChange={handleChange}
                            inputProps={{ style: { fontSize: 30 } }}
                            InputLabelProps={{ style: { fontSize: 20 } }}
                        />
                        <br></br>
                        <TextField
                            style={{ maxWidth: "70%" }}
                            id="standard-basic"
                            label="Interested in contributing to Delta One? Link your LinkedIn or GitHub."
                            onChange={handleChange}
                            inputProps={{ style: { fontSize: 30 } }}
                            InputLabelProps={{ style: { fontSize: 20 } }}
                        />
                        <button id="go" className="custom-button" type="submit">
                            GO
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Join;
