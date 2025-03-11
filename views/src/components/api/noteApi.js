import axios from "axios";

import Swal from "sweetalert2";

const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return {
        Authorization: `${token}`,
    };
};

export const deleteNote = async (noteData) => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You cannot restore this note!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`/api/v1/notes/${noteData.id}`, {
                headers: getAuthHeader()
            });
            if (response.data.status === 200) {
                Swal.fire('Deleted', response.data.message, 'success').then((result) => {
                    if (result.isConfirmed) {
                        const noteElement = document.getElementById(`note-${noteData.id}`);
                        if (noteElement) {
                            noteElement.classList.add('fade-out');
                            setTimeout(() => {
                                noteElement.remove();
                            }, 500);
                        }
                    }
                });
            } else {
                Swal.fire('Error', 'An error occurred while deleting the note.', 'error');
            }

            return response.data.message;

            } catch (error) {
                Swal.fire('Er', 'An error occurred while deleting the note.', 'error');
            }
        }
    });
};

      
export const updateNote = async (noteData, title, content, color, pined) => {
    try {
        const newPayload = {
        title: title || "",
        content: content || "",
        color: color || "#fff",
        pined: pined
        };
        const response = await axios.put(`/api/v1/notes/${noteData.id}`, newPayload, {
            headers: getAuthHeader()
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};


export const addNote = async () => {
    try {
        const newNote = { title: "", content: "", color: getRandomColor() };
        const response = await axios.post('/api/v1/notes', newNote, {
            headers: getAuthHeader()
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const getNote = async () => {
    try {
        const response = await axios.get('/api/v1/notes', {
            headers: getAuthHeader(),
            withCredentials: true,
            credentials: 'include'
        });
    return response.data.data;  
    } catch (error) {
        throw error;
    }
};

const getRandomColor = () => {
    const colors = ['#FBBF24', '#FECACA', '#BBF7D0', '#BFDBFE', '#E9D5FF', '#FBCFE8', '#B1C29E',
                    '#EBEAFF', '#E8BCB9', '#D8DBBD', '#E5D9F2', '#C8ACD6'];
    return colors[Math.floor(Math.random() * colors.length)];
};