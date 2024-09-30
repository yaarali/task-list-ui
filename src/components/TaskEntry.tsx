import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useEffect, useRef, useState} from 'react';
import { Form } from 'react-bootstrap';
import { Task } from '../models/Task';
import { TaskService } from '../services/TaskService';
import Notify from '../utils/Notify';

/**
 * Handles the Add and Update of a Task
 */
interface TaskEntryProps {
    display: boolean;
    onClickCancel?: any;
    onClickConfirm?: any;
    operation?: string;
    task:Task;
  }

function TaskEntry({ 
  display,
  onClickCancel,
  onClickConfirm,
  operation = "ADD",
  task,
}: TaskEntryProps) {
  const [modalTitle] = useState<string>(operation === "ADD" ? "Add Task" : "Update Task");
  const [validated, setValidated] = useState(false);
  const [updatedTask, setUpdatedTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
  });

  /**
   * Close button click action handler
   */
  const handleClose = () => {
    setValidated(false);
    onClickCancel();
  }

  /**
   * Submit button click action handler
   */
  const handleSubmit = () => {
    setValidated(true);
    console.log("Updated Task::", updatedTask);


    if (updatedTask && updatedTask?.title !== "") {
      if(operation==="ADD") {
        saveTask().then(onClickConfirm);
      } else {
        updateTask().then(onClickConfirm);
      }
    }
  };

  /**
   * Helper function that does the API call to Save task
   */
  async function saveTask() {
    try {
      await TaskService.saveTask(updatedTask).then(() => {
        Notify.success("Task addedd successfully");
      });
    }
    catch (e) {
      if (e instanceof Error) {
        Notify.success(e.message);
      }
    }
  }

  /**
   * Helper function that does the API call to Update task
   */
  async function updateTask() {
    try {
      await TaskService.updateTask(updatedTask).then(() => {
        Notify.success("Task updated successfully");
      });
    }
    catch (e) {
      if (e instanceof Error) {
        Notify.success(e.message);
      }
    }
  }

  const onTitleInput = (e: any) => {
    if (titleInputRef.current) {
      setUpdatedTask((prevState) => ({
        ...prevState,
        title: titleInputRef.current!.value,
      }));
    }
  }

  const onDescriptionInput = (e: any) => {
    if (descriptionInputRef.current) {
      setUpdatedTask((prevState) => ({
        ...prevState,
        description: descriptionInputRef.current!.value,
      }));
    }
  }

  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUpdatedTask(task);
  }, [task]);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.value = updatedTask?.title || "";
    }
    if (descriptionInputRef.current) {
      descriptionInputRef.current.value = updatedTask?.description || "";
    }
  }, [
    updatedTask?.title,
    updatedTask?.description
  ]);
  return (
    <Modal show={display} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated}>
          <Form.Group controlId="taskTitle">
            <Form.Label>Title <i>(Required)</i></Form.Label>
            <Form.Control required type="text" onChange={onTitleInput} ref={titleInputRef} />
            <Form.Control.Feedback type="invalid">Title is mandatory</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="taskDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} onChange={onDescriptionInput} ref={descriptionInputRef} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TaskEntry;