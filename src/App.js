import './App.css';
import TaskList from './Tasklist'
function App() {
  return (
    <div className="App">
        <h1 className="text-4xl font-bold text-center mt-10">Your To Do List</h1>
        
        <TaskList/>
        
        <hr />
    </div>
  );
}

export default App;
