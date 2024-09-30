import {useState, useEffect} from 'react';
import TaskList from './components/TaskList';
import { Task } from './models/Task';
import { TaskService } from './services/TaskService';
import TaskEntry from './components/TaskEntry';
import Spinner from './utils/Spinner';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import TaskItem from './components/TaskItem';

function App() {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskEntry, setShowTaskEntry] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>(new Task());

  const handleShow = () => {
    setShowTaskEntry(true);
  }

  /**
   * Add Task Button click event handler
   */
  const onAddClick = () => {
    handleShow();
  }

  const onTaskClick = (task: Task) => {
    setSelectedTask(task);
  }

  /**
   * Function to fetch all the tasks from the server
   */
  async function loadTasks() {
    setLoading(true);
    try {
      const data = await TaskService.getTasks();
      setTasks(data);
    }
    catch (e) {
      if (e instanceof Error) {
      }
    } finally {
      setLoading(false);
    }
  }

  /**
   * Callback when the CANCEL button is pressed on the Task Entry modal
   * Show / hides the Task Entry Modal
   */
  const toggleTaskEntryModal = () => {
    setShowTaskEntry(!showTaskEntry);
  }

  /**
   * Callback when the SAVE button is pressed on the Task Entry modal
   * Show / hides the Task Entry Modal
   */
  const onModalClickConfirm = () => {
    toggleTaskEntryModal();
    loadTasks(); //- Reload the tasks
  }

  useEffect(() => {
    // Load the initial tasks
    loadTasks();
  }, []);
  return (
    <div className="App">
      {loading &&
        <Spinner />
      }
      <ToastContainer />
      <div style={{textAlign: 'center'}}>
        <h2>Task List</h2>
      </div>
      
      <div className='grid-container'>
        <div className='grid-item'>
          <TaskList 
            tasks={tasks}
            triggerReload={loadTasks}
            onAddTaskButtonClick={onAddClick}
            onTaskClick={onTaskClick} />
              
        </div>
        <div className='grid-item'>
          <TaskItem task={selectedTask}></TaskItem>
        </div>
      </div>
      <TaskEntry
        display={showTaskEntry}
        onClickCancel={toggleTaskEntryModal}
        onClickConfirm={onModalClickConfirm}
        task={new Task()}
      ></TaskEntry>
    </div>
  );
}

export default App;
