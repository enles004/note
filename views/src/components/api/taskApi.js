import axios from "axios";

import Swal from "sweetalert2";

const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return {
        Authorization: `${token}`,
    };
};

export const deleteTask = async (taskData) => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You cannot restore this task!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        customClass: {
            popup: 'custom-swal-popup'
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`/api/v1/tasks/${taskData.id}`, {
                    headers: getAuthHeader()
                });
                if (response.data.status === 200) {
                    Swal.fire({
                        title: 'Deleted',
                        text: response.data.message,
                        icon: 'success',
                        customClass: {
                            popup: 'custom-swal-popup'
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const taskElement = document.getElementById(`task-${taskData.id}`);
                            if (taskElement) {
                                taskElement.classList.add('fade-out');
                                setTimeout(() => {
                                    taskElement.remove();
                                }, 500);
                            }
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.data.message,
                        icon: 'error',
                        customClass: {
                            popup: 'custom-swal-popup'
                        }
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while deleting the task.',
                    icon: 'error',
                    customClass: {
                        popup: 'custom-swal-popup'
                    }
                });
            }
        }
    });
};


export const updateTask2 = async (taskData) => {
    try {
        const newPayload = {
                    color: taskData.color,
                    content: taskData.content,
                    expiry: taskData.expiry,
                    type: taskData.type,
                    reminder: taskData.reminder,
                    repeat: taskData.repeat,
                    status: taskData.status
                    };
        const response = await axios.put(`/api/v1/tasks/${taskData.id}`, newPayload, {
            headers: getAuthHeader()
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const updateTask = async (taskData) => {
    try {
        const newPayload = {
                    color: taskData.color,
                    content: taskData.content,
                    expiry: taskData.expiry,
                    type: taskData.type,
                    reminder: taskData.reminder,
                    repeat: taskData.repeat,
                    status: !taskData.status
                    };
        const response = await axios.put(`/api/v1/tasks/${taskData.id}`, newPayload, {
            headers: getAuthHeader()
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};


export const addTask = async (content, status, expiry, reminder, repeat) => {
    try {
        console.log(reminder);
        const newTask = { content: content,
                        type: 'tasks',
                        status: status,
                        expiry: expiry,
                        reminder: reminder,
                        repeat: repeat,
                        color: getRandomColor()};
        const response = await axios.post('/api/v1/tasks', newTask, {
            headers: getAuthHeader()
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const addSubTasks = async (subTask, taskId) => {
    try {
        const newSubTasks = {subtasks: subTask};
            const response = await axios.post(`/api/v1/tasks/${taskId}`, newSubTasks, {
                headers: getAuthHeader()
            });
            
        return response.data.data;
    } catch (error) {
        throw error;
    }
};


export const getTask = async () => {
    try {
        const response = await axios.get('/api/v1/tasks', {
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