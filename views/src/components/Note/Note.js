import React, { useState, useEffect } from 'react';
import StickyNote from './StickyNote';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import '../../static/note.css';
import { getNote, addNote } from '../api/noteApi';
import { useAuth } from '../../authContext/AuthContext';
import Search from '../Search';
//import Menu from '../Menu';
//import TaskSlider from '../Tasks/taskSlider';
import Logout from '../Auth/Logout';

const Note = () => {
    const [notes, setNotes] = useState([]);
    const { checkAuth, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    // const [showTaskSlider, setShowTaskSlider] = useState(false);
    const [filteredNotes, setFilteredNotes] = useState([]);

    useEffect(() => {
        checkAuth();
        if (isAuthenticated) {
            navigate('/note', { replace: true });
        }
    }, [isAuthenticated, checkAuth, navigate]);

    useEffect(() => {
        getNote().then(response => {
            setNotes(response);
            setFilteredNotes(response);
    }   )
    }, []);

//    const toggleTaskSlider = () => {
//        setShowTaskSlider(!showTaskSlider);
//      };

    const addOneNote = () => {
        addNote().then(response => {
            setNotes([...notes, response[0]]);
            setFilteredNotes([...notes, response[0]]);
        }).catch(error => {
            throw error;
        })
    };

    const handleUpdateNote = (updatedNote) => {
        const otherNotes = notes.filter(note => note.id !== updatedNote.id);

        if (updatedNote.pined) {
            setNotes([updatedNote, ...otherNotes]);
            setFilteredNotes([updatedNote, ...otherNotes]);
        } else {
            const updatedNotes = [
                ...otherNotes.filter(note => note.pined), 
                updatedNote, 
                ...otherNotes.filter(note => !note.pined) 
            ];

            updatedNotes.sort((a, b) => {
                if (!a.pined && !b.pined) {
                    return new Date(a.created) - new Date(b.created);
                }
                return b.pined - a.pined; 
            });

            setNotes(updatedNotes);
            setFilteredNotes(updatedNotes);
        }
    };

    const handleSearch = (searchTerm) => {
        const filtered = notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredNotes(filtered);  

    };

    return (
        <main>
            <Header>
                <Search 
                    onSearch={handleSearch} 
                    placeholder={'Search your notes...'}
                />
                {/* <Menu onToggleTaskSlider={ toggleTaskSlider }/> */}
                <Logout />
            </Header>
            <div className="intro-note">
                <img src="../../static/images/plusplus.png"
                    className="add-note"
                    alt="Add note"
                    style={{ width: '10vh', height: '10vh' }}
                    onClick={addOneNote} />
                    {filteredNotes.map(note => (
                        <StickyNote key={note.id}
                                    noteData={note}
                                    onUpdate={handleUpdateNote}
                        />
                    ))}
            </div>
            {/* <TaskSlider show={showTaskSlider} setShow={setShowTaskSlider}/> */}
        </main>
    );
};

export default Note;
