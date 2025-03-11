import React, { useEffect } from "react";
import Header from "../Header";
import Intro from "./Intro";
import { useLocation } from 'react-router-dom';
import '../../static/dashboard.css';

const Dashboard = () => {
    const location = useLocation();
    useEffect(() => {
    }, [location]);
    return (
        <div>
            <Header />
            <Intro />
        </div>
    );
};

export default Dashboard