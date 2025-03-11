// import React, { useState, useEffect, useRef } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css"; // Nhớ import style cho DatePicker
// import Select from 'react-select';
// import { addTask, addSubTasks } from "../api/taskApi";

// const NewTask = ({ show, setShow, onCreate }) => {
//     const [content, setContent] = useState("");
//     const [expiry, setExpiry] = useState(null);
//     const [reminder, setReminder] = useState(null);
//     const [repeat, setRepeat] = useState("Null");
//     const [subtasks, setSubtasks] = useState([]);
//     const subtaskListRef = useRef(null);
//     const [error, setError] = useState('');
//     const [allTasks, setAllTasks] = useState([]);

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter" && e.target.value.trim() !== "") {
//             // Tạo một subtask mới với status mặc định là false (chưa được chọn)
//             setSubtasks([
//                 ...subtasks,
//                 { id: Date.now(), content: e.target.value, status: false, type: 'subtasks', expiry: null, reminder: null, repeat: "Null"}
//             ]);
//             e.target.value = ""; // Làm trống input sau khi thêm subtask
//         }
//     };

//     const handleSubtaskChange = (e, id) => {
//         const updatedSubtasks = subtasks.map((subtask) =>
//             subtask.id === id
//                 ? { ...subtask, content: e.target.value } // Cập nhật content của subtask
//                 : subtask
//         );
//         setSubtasks(updatedSubtasks);
//     };

//     const handleRemoveSubtask = (id) => {
//         const updatedSubtasks = subtasks.filter((subtask) => subtask.id !== id);
//         setSubtasks(updatedSubtasks);
//     };

//     const handleStatusChange = (id) => {
//         const updatedSubtasks = subtasks.map((subtask) =>
//             subtask.id === id
//                 ? { ...subtask, status: !subtask.status } // Đảo ngược trạng thái của subtask
//                 : subtask
//         );
//         setSubtasks(updatedSubtasks);
//     };


//     useEffect(() => {
//         if (subtaskListRef.current) {
//             subtaskListRef.current.scrollTop = subtaskListRef.current.scrollHeight;
//         }
//     }, [subtasks]);

//     const formatDate = (date) => {
//         if (date instanceof Date) {
//             return date.toISOString().slice(0, 19);
//         }
//         return null;
//     }

//     const handCancel = () => {
//         setShow(!show);
//     }

//     const handleSubmit = () => {
//         if (!content.trim()) {
//             setError("Please enter task content!");
//             return;
//         }

//         else if (content.length < 3 || content.length > 100) {
//             setError("Task content must be between 3-100.");
//             return;
//         }

//         else if ((reminder && repeat === 'Null') || (!reminder && repeat !== 'Null')){
//             setError("Please select both 'Reminder' and 'Repeat'!");
//             return;
//         }

//         const invalidSubtask = subtasks.find(subtask => subtask.content.length < 3 || subtask.content.length > 100);
//         if (invalidSubtask) {
//             setError("Subtask content must be between 3-100.");
//             return;
//         }

//         const task = addTask(content, false, formatDate(expiry), formatDate(reminder), repeat);
//         task.then(response => {
//             if (subtasks.length > 0){
//                 const subtasksWithoutId = subtasks.map(({ id, ...rest }) => rest);
//                 addSubTasks(subtasksWithoutId, response[0].id).then(subtaskResponses => {
//                     Promise.all(subtaskResponses.map(subtask => {
//                     })).then(() => {
//                         setTimeout(() => {
//                             onCreate();
//                             setError("Create successfully!");
//                         }, 300);

//                     });
//                 }).catch(error => {
//                     console.error("Error adding subtasks:", error);
//                 });
//             }
//             else{
//                 setTimeout(() => {
//                     onCreate();
//                     setError("Create successfully!");
//                 }, 300);
//             }

//             setContent("");
//             setExpiry(null);
//             setReminder(null);
//             setRepeat("Null");
//             setSubtasks([]);
//         });

//     };

//     useEffect(() => {
//         if (error) {
//             const timer = setTimeout(() => setError(''), 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [error]);

//     const options = [
//         { value: 'Null', label: 'Select the repeat time' },
//         { value: 'Never', label: 'Never' },
//         { value: 'Daily', label: 'Daily' },
//         { value: 'MtD', label: 'Monday to Friday' },
//         { value: 'Weekly', label: 'Weekly' },
//         { value: 'Monthly', label: 'Monthly' }
//     ];

//     const customStyles = {
//         control: (base) => ({
//             ...base,
//             borderRadius: '8px',
//             borderColor: '#ccc',
//             padding: '2.5px',
//             fontSize: '15px',
//             width: '18.2vw',
//             height: 'auto',
//             cursor: 'pointer'
//         }),
//         option: (provided, state) => ({
//             ...provided,
//             borderRadius: '8px',
//             padding: '10px',
//             fontSize: '15px',
//             backgroundColor: '#f9f9f9',
//             backgroundColor: state.isSelected ? '#343131' : state.isFocused ? '#eaeaea' : '#f9f9f9',
//             color: state.isSelected ? 'white' : 'black',
//             '&:hover': {
//                 backgroundColor: '#ffcce1',
//                 cursor: 'pointer',
//                 color: 'black'
//             },
//         }),
//         singleValue: (provided) => ({
//             ...provided,
//         }),
//     };

//     return (
//         <div className="add-new-task">
//             {error && <p style={{cursor: 'pointer', position: 'absolute', color: '#c30e59', left: '30px', marginTop: '5px'}}>{error}</p>}
//             <img
//                 src="../../static/images/cancel.png"
//                 alt="Expiry Date"
//                 style={{width: '20px', height: '20px', cursor: 'pointer', position: 'absolute', left: '350px'}}
//                 onClick={handCancel}
//             />
//             <div className="task-input-group" style={{marginTop: '30px'}}>
//                 <input
//                     type="text"
//                     id="content"
//                     placeholder="Task content"
//                     required
//                     autoComplete="off"
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                 />
//             </div>
//             <div className="task-input-group">
//                 <img
//                     src="../../static/images/clock.png"
//                     alt="Expiry Date"
//                     style={{width: '35px', height: '35px'}}
//                 />
//                 <DatePicker
//                     selected={expiry instanceof Date ? expiry : null}
//                     onChange={(date) => setExpiry(date)}
//                     showTimeSelect
//                     dateFormat="Pp"
//                     placeholderText="Set expiration date"
//                 />
//             </div>
//             <div className="task-input-group">
//                 <img
//                     src="../../static/images/reminder.png"
//                     alt="Reminder"
//                     style={{width: '35px', height: '35px'}}
//                     className="icon"
//                 />
//                 <DatePicker
//                     selected={reminder instanceof Date ? reminder : null}
//                     onChange={(date) => setReminder(date)}
//                     showTimeSelect
//                     dateFormat="Pp"
//                     placeholderText="Set reminder"
//                 />
//             </div>
//             <div className="task-input-group">
//                 <label htmlFor="repeat">Repeat:</label>
//                 <Select
//                     id="repeat"
//                     value={options.find((option) => option.value === repeat)}
//                     onChange={(option) => setRepeat(option.value)}
//                     options={options}
//                     styles={customStyles}
//                 />
//             </div>
//             <div className="task-input-group">
//                 <input
//                     type="text"
//                     id="subtask"
//                     placeholder="Tap 'Enter' to create subtasks"
//                     autoComplete="off"
//                     onKeyDown={handleKeyDown}
//                 />
//             </div>

//             <div className="subtask-list" ref={subtaskListRef}>
//                 {subtasks.map((subtask) => (
//                     <div key={subtask.id} className="subtask">
//                         <input
//                             type="checkbox"
//                             checked={subtask.status}
//                             onChange={() => handleStatusChange(subtask.id)}
//                         />
//                         <input
//                             type="text"
//                             value={subtask.content}
//                             onChange={(e) => handleSubtaskChange(e, subtask.id)}
//                         />
//                         <img src="../../static/images/bin.png" alt="delete subtask" onClick={() => handleRemoveSubtask(subtask.id)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
//                     </div>
//                 ))}
//             </div>
//             <h2 className="submit-button" onClick={handleSubmit}>OK</h2>
//         </div>
//     );
// };

// export default NewTask;
