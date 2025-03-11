import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

const Buttons = () => {
    const navigate = useNavigate(); 

    const handleRedirect = async (event) => {
        event.preventDefault();  
        navigate("/note");  
    };

    const handleRedirectCoffee = async (event) => {
        event.preventDefault();  
        navigate("/coffee");  
    };

    return (
        <div className="buttons">
            <form onSubmit={handleRedirectCoffee}>
                <button className="learn-more"><b>More details ...</b></button>
            </form>
            <form onSubmit={handleRedirect}>
                <button className="try-now"><b>Join now ►</b></button>
            </form>
        </div>
    );
};

export default Buttons;
