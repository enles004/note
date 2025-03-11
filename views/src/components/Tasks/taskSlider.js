// import React, { useRef, useEffect, useState } from "react";
// import "../../static/task.css";
// import Search from "../Search";
// import { getTask } from "../api/taskApi";
// import Task from "./Task";
// import { updateTask } from "../api/taskApi";
// import NewTask from "./newTask";
// import { deleteTask } from "../api/taskApi";
// import Swal from "sweetalert2";

// const TaskSlider = ({ show, setShow }) => {
//     const modalRef = useRef(null);
//     const sliderRef = useRef(null);
//     const [activeTab, setActiveTab] = useState("list");
//     const [tasks, setTasks] = useState([]);
//     const [completed, setCompleted] = useState([]);
//     const [isFetching, setIsFetching] = useState(false);
//     const [isOpen, setIsOpen] = useState(false);
//     const taskList1Ref = useRef(null);
//     const taskList2Ref = useRef(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedTask, setSelectedTask] = useState(null);
//     const [addTask, setAddTask] = useState(false);
//     const [filteredTasksList, setFilteredTasksList] = useState([]);
//     const [filteredTasksCompleted, setFilteredTasksCompleted] = useState([]);

//     const handleCreateTask = () => {
//         setTimeout(() => {
//             getTask()
//                 .then(response => {
//                     const task1 = response.filter(task => !task.status);
//                     const task2 = response.filter(task => task.status);
//                     task2.sort((a, b) => new Date(b.date_completed) - new Date(a.date_completed));
//                     setTasks(task1);
//                     setCompleted(task2);
//                     setFilteredTasksList(task1);
//                     setFilteredTasksCompleted(task2);
//                 })
//             .catch(error => console.error("Error fetching tasks:", error));
//         }, 200);
//     };

//     const handleTaskStatusChange = (taskId) => {
//         updateTask(taskId);
//         setTimeout(() => {
//             getTask()
//                 .then(response => {
//                     const task1 = response.filter(task => !task.status);
//                     const task2 = response.filter(task => task.status);
//                     task2.sort((a, b) => new Date(b.date_completed) - new Date(a.date_completed));
//                     setTasks(task1);
//                     setCompleted(task2);
//                     setFilteredTasksList(task1);
//                     setFilteredTasksCompleted(task2);
//                 })
//             .catch(error => console.error("Error fetching tasks:", error));
//         }, 200);
//     };

//     const handleSubtaskStatusChange = (taskId, subtaskId) => {
//         setTasks((prevTasks) =>
//             prevTasks.map((task) => {
//                 if (task.id === taskId.id) {
//                     const updatedSubtasks = task.subtasks.map((subtask) =>
//                         subtask.id === subtaskId.id
//                             ? { ...subtask, status: !subtask.status }
//                             : subtask
//                     );
//                     return { ...task, subtasks: updatedSubtasks };
//                 }
//                 return task;
//             })
//         );

//         updateTask(subtaskId)
//             .then(() => {
//                 setTimeout(() => {
//                     getTask()
//                             .then(response => {
//                                 const task1 = response.filter(task => !task.status);
//                                 const task2 = response.filter(task => task.status);
//                                 task2.sort((a, b) => new Date(b.date_completed) - new Date(a.date_completed));
//                                 setTasks(task1);
//                                 setCompleted(task2);
//                                 setFilteredTasksList(task1);
//                                 setFilteredTasksCompleted(task2);
//                             })
//                         .catch(error => console.error("Error fetching tasks:", error));
//                 }, 500);
//             })
//     };

//     const handleOpenModal = (task) => {
//         if (!task.status) {
//             setIsOpen(true);
//             setSelectedTask(task);
//             setIsModalOpen(true);
//         }
//     };

//     const handleUpdateTask = (taskData) => {
//         updateTask(taskData);
//     };

//     const handleClickOutside = (event) => {
//         if (Swal.isVisible()) {
//             return;
//         }

//         if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
//             setSelectedTask(null);
//             setIsModalOpen(false);
//             setIsOpen(false);
//         }

//         if (show && sliderRef.current && !sliderRef.current.contains(event.target)) {
//             setShow(false);
//             const overlay = document.querySelector('.blur-overlay');
//             if (overlay) {
//                 overlay.remove();
//             }
//             const modal = document.querySelector('.modal.show');
//             if (modal && !modal.contains(event.target)) {
//                 modal.classList.remove('show');
//                 setIsModalOpen(false);
//             }
//             setTimeout(() => {
//                 setSelectedTask(null);
//                 setIsModalOpen(false);
//                 setIsOpen(false);
//             }, 200);
//         }
//     };

//     useEffect(() => {
//         if (show && !isFetching) {
//             setIsFetching(true);
//             getTask()
//                 .then(response => {
//                     const task1 = response.filter(task => !task.status);
//                     const task2 = response.filter(task => task.status);
//                     task2.sort((a, b) => new Date(b.date_completed) - new Date(a.date_completed));
//                     setTasks(task1);
//                     setCompleted(task2);
//                     setFilteredTasksList(task1);
//                     setFilteredTasksCompleted(task2);
//                 })
//                 .catch(error => console.error("Error fetching tasks:", error));
//         }
//     }, [show, isFetching]);

//     useEffect(() => {
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [isModalOpen, show]);

//     useEffect(() => {
//         if (activeTab === "list" && taskList1Ref.current) {
//             taskList1Ref.current.scrollTop = 0;
//             setTimeout(() => {
//                 setFilteredTasksCompleted(completed);
//             }, 400);

//         }
//         else if (activeTab === "completed" && taskList2Ref.current) {
//             taskList2Ref.current.scrollTop = 0;
//             setTimeout(() => {
//                 setFilteredTasksList(tasks);
//             }, 400);
//         }
//     }, [activeTab]);

//     const handleSearch = (searchTerm) => {
//         if (activeTab === "list") {
//             const filtered = tasks.filter(task =>
//                 task.content.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//             setFilteredTasksList(filtered);
//         } else if (activeTab === "completed") {
//             const filtered = completed.filter(task =>
//                 task.content.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//             setFilteredTasksCompleted(filtered);
//         }
//     };

//     const handleDelete = (taskId) => {
//         deleteTask(taskId);
//         getTask()
//                 .then(response => {
//                     const task1 = response.filter(task => !task.status);
//                     const task2 = response.filter(task => task.status);
//                     task2.sort((a, b) => new Date(b.date_completed) - new Date(a.date_completed));
//                     setTasks(task1);
//                     setCompleted(task2);
//                     setFilteredTasksList(task1);
//                     setFilteredTasksCompleted(task2);
//                 })
//                 .catch(error => console.error("Error fetching tasks:", error));
//     };

//     const handleUpdate = (updatedTask) => {
//         return updatedTask;
//     };

//     return (
//         <div
//             className={`task-slider ${show ? 'show' : ''}`}
//             ref={sliderRef}
//         >
//             <div className={`task-content`}>
//                 <div className="task-header">
//                     <h1>Tasks</h1>
//                     <Search
//                         key={activeTab}
//                         onSearch={handleSearch}
//                         placeholder={activeTab === 'list' ? 'Search your tasks...' : 'Search your tasks completed...'}
//                     />
//                 </div>
//                 <div className="task-body">
//                     <div className="task-state">
//                         <p
//                             className={activeTab === "list" ? "active" : ""}
//                             onClick={() => {
//                                 setActiveTab("list")
//                             }}
//                         >
//                             Your Tasks
//                         </p>
//                         <p
//                             className={activeTab === "completed" ? "active" : ""}
//                             onClick={() => setActiveTab("completed")}
//                         >
//                             Tasks Completed
//                         </p>
//                     </div>
//                     <div className="task-hidden">
//                         <div className={`task-list1 ${activeTab === "list" ? "active" : "hidden"}`}
//                             ref={taskList1Ref}
//                         >
//                             {filteredTasksList.map(task => (
//                                 <div key={task.id} onClick={() => handleOpenModal(task)} style={{width: '80%', marginLeft: '10%'}}>
//                                     <Task
//                                         taskData={task}
//                                         onTaskStatusChange={handleTaskStatusChange}
//                                         onSubtaskStatusChange={handleSubtaskStatusChange}
//                                         onDeleteTask={handleDelete}
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                         <div className={`task-list2 ${activeTab === "completed" ? "active" : "hidden"}`}
//                             ref={taskList2Ref}
//                         >
//                             {filteredTasksCompleted.map(task => (
//                                 <div key={task.id} onClick={() => handleOpenModal(task)} style={{width: '80%', marginLeft: '10%'}}>
//                                     <Task
//                                         taskData={task}
//                                         onTaskStatusChange={handleTaskStatusChange}
//                                         onSubtaskStatusChange={handleSubtaskStatusChange}
//                                         onDeleteTask={handleDelete}
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <hr />
//                 </div>

//                 <div className="task-footer">
//                     <button onClick={() => setAddTask(true)} className="add-task">
//                         <img
//                             src="../../static/images/add-task.png"
//                             alt="add-task"
//                             style={{ width: '40px', height: '40px' }}
//                         />
//                     </button>
//                 </div>
//             </div>
//             {addTask && <NewTask show={addTask} setShow={setAddTask} onCreate={handleCreateTask} />}
//         </div>
//     );
// };

// export default TaskSlider;
