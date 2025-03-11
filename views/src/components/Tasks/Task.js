// import React, { useState, useEffect, useRef } from 'react';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Select from 'react-select';
// import '../../static/reminder.css';
// import { updateTask2, getTask } from '../api/taskApi';

// const Task = ({ taskData, onTaskStatusChange, onSubtaskStatusChange, onDeleteTask, onReminderChange }) => {
//     const [collapse, setCollapse] = useState(false);
//     const [subTasks, setSubTasks] = useState(taskData.subtasks);
//     const [isFading, setIsFading] = useState(false);
//     const [reminder, setReminder] = useState(taskData.reminder || null);
//     const [repeat, setRepeat] = useState(taskData.repeat || "Null");
//     const [showReminder, setShowReminder] = useState(false);
//     const [isOpen, setIsOpen] = useState(null);
//     const containerRef = useRef(null);
//     const [showEdit, setShowEdit] = useState(false);
//     const [editingSubTaskId, setEditingSubTaskId] = useState(null);
//     const [editedSubTaskContent, setEditedSubTaskContent] = useState("");
//     const [editingSubTasks, setEditingSubTasks] = useState({});
//     const [startDate, setStartDate] = useState(new Date());
//     const [selectedOption, setSelectedOption] = useState("Select the repeat time");

//     const handleEditClick = (subTask) => {
//         setEditedSubTaskContent(subTask.content);
//         setEditingSubTasks((prev) => ({
//             ...prev,
//             [subTask.id]: true,
//         }));
//     };



//     const handleSaveClick = (subTask) => {
//         setSubTasks((prevSubTasks) =>
//             prevSubTasks.map((task) =>
//                 task.id === subTask.id ? { ...task, content: editedSubTaskContent } : task
//             )
//         );
//         setEditingSubTasks((prev) => ({
//             ...prev,
//             [subTask.id]: false,
//         }));

//         updateTask2(subTask).then(response => {

//             setEditedSubTaskContent("");
//         })
//     };

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
//             width: '10vw',
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

//     const handleTaskCheckboxClick = (e) => {
//         e.stopPropagation();
//         setIsFading(true);
//         setTimeout(() => {
//             onTaskStatusChange(taskData);
//         }, 100);
//     };

//     const handleSubTaskCheckboxClick = (e, subTask) => {
//         e.stopPropagation();
//         if (!taskData.status){
//             const updatedSubTasks = subTasks.map((s) =>
//                 s.id === subTask.id ? { ...s, status: !s.status } : s
//             );
//             updatedSubTasks.sort((a, b) => a.status - b.status);

//             setSubTasks(updatedSubTasks);

//             const allCompleted = updatedSubTasks.every((s) => s.status);

//             if (allCompleted && !taskData.status || !allCompleted && taskData.status) {
//                 onTaskStatusChange(taskData);
//                 setTimeout(() => {
//                     setIsFading(true);
//                 }, 100);
//             }

//             setTimeout(() => {
//                 onSubtaskStatusChange({ ...taskData, subtasks: updatedSubTasks }, subTask);
//             }, 100);
//         }
//     };

//     useEffect(() => {
//         if (containerRef.current) {
//             containerRef.current.style.maxHeight = collapse ? `${containerRef.current.scrollHeight}px` : '0px';
//         }
//     }, [collapse]);

//     const handleDelete = (taskData) => {
//         onDeleteTask(taskData);
//     }


//     const handleEditChange = (subTaskId, content) => {
//         setSubTasks((prevSubTasks) =>
//             prevSubTasks.map((task) =>
//                 task.id === subTaskId.id ? { ...task, content: content } : task
//             )
//         );
//         setEditedSubTaskContent(content);
//     };

//     return (
//         <div
//             id={`task-${taskData.id}`}
//             className={`task-view ${taskData.status ? 'completed' : ''} ${isFading ? 'fade-out' : ''}`}
//             style={{ backgroundColor: taskData.color }}
//         >
//             <div className="Task">
//                 <img
//                     src={taskData.status ? "../../static/images/checkbox.png" : "../../static/images/checkboxx.png"}
//                     alt="check-box"
//                     style={{ width: '25px', height: '25px' }}
//                     onClick={(e) => handleTaskCheckboxClick(e)}
//                 />
//                 <div className="Task-header">{taskData.content}</div>
//                 {subTasks && (
//                     <div className="task-number">
//                         <p>
//                             {subTasks.filter((subTask) => subTask.status).length}/{subTasks.length}
//                         </p>
//                         <img
//                             src="../../static/images/up-arrow.png"
//                             alt="arrow"
//                             style={{ width: '20px', height: '20px' }}
//                             className={`arrow-up${collapse ? ' expanded' : ''}`}
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 setCollapse(!collapse);
//                                 setTimeout(() => {
//                                     setIsOpen(!isOpen);
//                                 }, 150);
//                             }}
//                         />
//                     </div>
//                 )}
//             </div>

//             <div ref={containerRef} className="subTask-container">
//                 {subTasks.map((subTask) => (
//                     <>
//                     <div key={subTask.id} className={`subTask ${subTask.status ? 'completed strike' : ''}`}>
//                         {!editingSubTasks[subTask.id] && (<img
//                             src="../../static/images/bin.png"
//                             alt="edit"
//                             style={{ width: '18px', height: '18px'}}
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleEditClick(subTask);
//                                 setShowEdit(!showEdit);
//                             }}
//                         />)}
//                         {editingSubTasks[subTask.id] && (<img
//                             src="../../static/images/pin.png"
//                             alt="save"
//                             style={{ width: '18px', height: '18px'}}
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleSaveClick(subTask);
//                             }}
//                         />)}
//                         <img
//                             src={subTask.status ? "../../static/images/checkbox.png" : "../../static/images/checkboxx.png"}
//                             alt="check-box"
//                             style={{ width: '18px', height: '18px' }}
//                             onClick={(e) => handleSubTaskCheckboxClick(e, subTask)}
//                         />
//                         {editingSubTasks[subTask.id] ? (
//                             <div>
//                                 <input
//                                     type="text"
//                                     value={subTask.content}
//                                     onChange={(e) => handleEditChange(subTask, e.target.value)}
//                                 />
//                             </div>
//                         ) : (
//                             <p>{subTask.content}</p>
//                         )}
//                     </div>
//                     </>
//                 ))}
//                 </div>
//                 {/* <div className='reminder-container'>
//                     <DatePicker
//                         selected={reminder instanceof Date ? reminder : null}
//                         onChange={(date) => setReminder(date)}
//                         showTimeSelect
//                         dateFormat="Pp"
//                         placeholderText="Set reminder"
//                         customInput={
//                             <div>
//                                 <input
//                                     value={startDate.toLocaleString()}
//                                     readOnly
//                                     placeholder="Select date"
//                                 />
//                                 <select
//                                     value={selectedOption}
//                                     onChange={(e) => setSelectedOption(e.target.value)}
//                                 >
//                                     <option value="Never">Never</option>
//                                     <option value="Daily">Daily</option>
//                                     <option value="Monday to Friday">Monday to Friday</option>
//                                     <option value="Weekly">Weekly</option>
//                                     <option value="Monthly">Monthly</option>
//                                 </select>
//                             </div>
//                         }
//                     />
//                 </div> */}
//             {taskData.status &&
//                 <img
//                     src="../../static/images/bin.png"
//                     alt="delete"
//                     style={{ width: '18px', height: '18px', position: 'absolute', right: '40px'}}
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         handleDelete(taskData);
//                     }}
//                 />
//             }
//         </div>
//     );
// };

// export default Task;
