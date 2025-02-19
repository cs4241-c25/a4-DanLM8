import { useState, useEffect } from "react";
 
function TaskList() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch("/tasks");
            const data = await response.json();
            setTasks(data); 
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const deleteTask = async (taskID) => {
        try {
            const response = await fetch("/delete", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: taskID })
            });

            if (response.ok) {
                setTasks(tasks.filter(task => task._id !== taskID));
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const submit = async () => {
       
          console.log("submit function invoked."); 
      
          // Fetching input fields
          const inputs = [
            document.getElementById('task').value,
            document.getElementById('days').value,
        ]

        const response = await fetch("/submit", {
            method: "POST",
            headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
            },
            body: JSON.stringify({ taskName : inputs[0], daysLeft : inputs[1] })
        })
        const data = await response.json();
        setTasks(data);
    }

    return (
        <>
        <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Add a New Task</h2>
        <div className="mb-4">
            <label htmlFor="task" className="block font-medium mb-1">Enter Task:</label>
            <input 
                type="text" 
                id="task" 
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
        </div>

        <div className="mb-4">
            <label htmlFor="days" className="block font-medium mb-1">How many days to complete?</label>
            <select 
                name="daysleft" 
                id="days" 
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                {[...Array(7)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
            </select>
        </div>

        <button 
            id="submit" 
            onClick={() => submit()} 
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition"
        >
            Submit
        </button>
    </div>

        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Task List</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Task</th>
                        <th className="border p-2">Days Remaining</th>
                        <th className="border p-2">Priority</th>
                        <th className="border p-2">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <tr key={task._id} className="border">
                                <td className="border p-2 text-center">{task.taskName}</td>
                                <td className="border p-2 text-center">{task.daysLeft}</td> 
                                <td className="border p-2 text-center">{task.priority}</td>
                                <td className="border p-2 text-center">
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center p-4">Enter your next task!</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </>
    );
}

export default TaskList;
