import React from 'react';

const ImageGallery = () => {
    return (
        <div className="image-gallery">
            <div className="image-box">
                <img src="../../static/images/appnote.png" alt="Image 1" />
            </div>
            <div className="image-box">
                <img src="../../static/images/appnote2.png" alt="Image 2" />
            </div>
            <div className="image-box">
                <img src="../../static/images/appnote3.png" alt="Image 3" />
            </div>
        </div>
    );
};

export default ImageGallery;
