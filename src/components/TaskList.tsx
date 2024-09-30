import { Alert, Button } from 'react-bootstrap';
import { Task } from '../models/Task';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { Fragment, useEffect, useState } from 'react';
import { TaskService } from '../services/TaskService';
import TaskEntry from './TaskEntry';
import Notify from '../utils/Notify';


/**
 * Displays the table with tasks
 */
interface TaskListProps {
  tasks: Task[];
  triggerReload?:any;
  onAddTaskButtonClick?: any;
  onTaskClick?: any;
}

function TaskList({ tasks, triggerReload, onAddTaskButtonClick, onTaskClick }: TaskListProps) {

  const [selectedTask, setSelectedTask] = useState<Task>(new Task());
  const [showModal, setShowModal] = useState(false);
  const [showTaskEntry, setShowTaskEntry] = useState(false);

  /**
   * Show the Delete confirm modal
   */
  const handleShow = () => {
    setShowModal(true);
  }

  /**
   * Hide the Delete confirm modal
   */
  const handleClose = () => {
    setShowModal(false);
  }

  /**
   * Delete Action button (in the list) click handler
   * @param task
   */
  const onDeleteClick = (task: Task) => {
    setSelectedTask(task);
    handleShow();
  }

  /**
   * Update Action button (in the list) click handler
   * @param task
   */
  const onUpdateClick = (task: Task) => {
    setSelectedTask(task);
    toggleTaskEntryModal();

  }

  /**
   * Delete Task modal button click handler
   */
  const onConfirmDeleteClick = () => {
    console.log("to delete::", selectedTask);
    deleteTask().then(triggerReload).then(() => setShowModal(false));
  }

  /**
   * Helper function that does the API call to Delete task
   */
  async function deleteTask() {
    try {
      await TaskService.deleteTask(selectedTask).then(() => {
        Notify.success("Task deleted successfully");
      });
    }
    catch (e) {
      if (e instanceof Error) {
        Notify.success(e.message);
      }
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
    triggerReload();
  }

  /**
   * Helper function that displays the content based on the tasks size
   * @returns
   */
  const getContent = () => {
    if (tasks.length === 0) {
      return (
        <Alert key="warning" variant="warning">
          Click on <Button href="#" size="sm" variant="primary" onClick={onAddTaskButtonClick}>Add Task</Button> to insert a new task
        </Alert>
      )
    }
    return (
      <Fragment>
        <Button className="add-btn" onClick={onAddTaskButtonClick}>Add Task</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
                <tr key={task.id}>
                  <td><a href="#" onClick={ () => onTaskClick(task) }>{task.title}</a></td>
                  <td>
                  <Button variant="primary" size="sm" onClick={() => onUpdateClick(task)}>
                    Update
                  </Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => onDeleteClick(task)}>
                    Delete
                  </Button>
                  </td>
                </tr>
            ))}
          </tbody>
        </Table>
        <TaskEntry
            display={showTaskEntry}
            onClickCancel={toggleTaskEntryModal}
            onClickConfirm={onModalClickConfirm}
            operation={"UPD"}
            task={selectedTask}
        ></TaskEntry>
        <Modal show={showModal} onHide={handleClose} backdrop="static">
          <Modal.Header>
            <Modal.Title>Confirm Delete?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure you want to delete the task: <b>{selectedTask.title}</b></p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-primary" onClick={handleClose}>No</Button>
            <Button variant="danger" onClick={() => onConfirmDeleteClick()}>Yes</Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    )
  }

  useEffect(() => {
  }, [tasks]);
  return (
    <div className="center">
      <h5>{tasks.length} tasks found</h5>
      {getContent()}
    </div>
  );
}

export default TaskList;