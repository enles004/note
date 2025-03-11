import React, { useState, useEffect, useRef } from 'react';
import { deleteNote } from '../api/noteApi';
import { updateNote } from '../api/noteApi';
import { SketchPicker } from 'react-color'; 
import {HexColorPicker} from 'react-colorful';
import '../../static/pickr.css';
import Swal from 'sweetalert2';

const StickyNote = ({ noteData, onUpdate }) => {
    const [expanded, setExpanded] = useState(false);
    const [title, setTitle] = useState(noteData.title);
    const [content, setContent] = useState(noteData.content);
    const [color, setColor] = useState(noteData.color);
    const [isPinned, setIsPinned] = useState(noteData.pined);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef(null);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [expanded, title, content]);

    const handlePinClick = (e) => {
        e.stopPropagation();
        setIsPinned(!isPinned);
        noteData.pined = !isPinned;

        const updatedNote = { ...noteData, pined: !isPinned };
        onUpdate(updatedNote);
    };

    const handleColorChange = (color) => {
        setColor(color);
        noteData.color = color;
    };

    const handleClickOutside = (event) => {
        if (Swal.isVisible()) {
            return; 
        }

        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
            setShowColorPicker(false);
        }

        if (expanded) {
            updateNote(noteData, title, content, noteData.color, noteData.pined);
            setExpanded(false);
            const overlay = document.querySelector('.blur-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    };

    return (
        <div
            id={`note-${noteData.id}`}
            className={`sticky-note ${expanded ? 'expanded' : ''}`}
            style={{ backgroundColor: color }}
            onClick={(e) => {
                if (!expanded) {
                    document.querySelectorAll('.sticky-note').forEach(n => n.classList.remove('expanded'));
                }
                let overlay = document.querySelector('.blur-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'blur-overlay';
                    document.body.appendChild(overlay);
                }
                setExpanded(true);
                e.stopPropagation();
            }}
        >
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title..."
                className="title"
                readOnly={!expanded}
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content..."
                className="content"
                readOnly={!expanded}
            />

            <button
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(noteData);
                }}
            >
            <img
                src="../../static/images/bin.png"
                alt="Delete"
                style={{ width: '30px', height: '30px' }}
            />
            </button>

            {expanded && (
                <button
                    className="edit-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowColorPicker(!showColorPicker);
                    }}
                    >
                    <img
                        src="../../static/images/wheel.png"
                        alt="Edit"
                        style={{ width: '30px', height: '30px' }}
                    />
                </button>
            )}

            
            {expanded ? (
                <button
                    className="pin-btn"
                    onClick={handlePinClick}
                >
                    <img
                        src={isPinned ? "../../static/images/pined.png" : "../../static/images/pin.png"}
                        alt="Pin"
                        style={{ width: '60px', height: '60px' }}
                    />
                </button>
            ) : (
                isPinned ? (
                    <button
                        className="pin-btn"
                    >
                        <img
                            src="../../static/images/pined.png"
                            alt="Pin"
                            style={{ width: '40px', height: '40px' }}
                        />
                    </button>
                ) : (
                    null
                )
            )}

            {showColorPicker && (
                <div className="color-picker-container" ref={colorPickerRef}>
                <HexColorPicker
                    color={color}
                    onChange={handleColorChange}
                    style={{ width: "280px", height: "300px", cursor: "pointer" }} 
                />
                </div>
            )}
        </div>
    );
};

export default StickyNote;
