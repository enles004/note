import React from 'react';
import Buttons from './Button';
import ImageGallery from './ImageGallery';

const Intro = () => {
    return (
        <main>
            <div className="intro-dashboard">
                    <h1>Welcome to my app!!!</h1>
                    <p>
                        <b>Notes app.</b> Free, simple and intuitive.
                    </p>
                    <Buttons />
                    <ImageGallery />
            </div>
        </main>
    );
};

export default Intro;
