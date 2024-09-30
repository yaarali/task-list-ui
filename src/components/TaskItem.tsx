import { Card } from 'react-bootstrap';
import Spinner from '../utils/Spinner';
import { Task } from '../models/Task';
import { Fragment, useEffect, useState } from 'react';
import { TaskService } from '../services/TaskService';
import Notify from '../utils/Notify';

/**
 * Displays the Task Details
 */
interface TaskItemProps {
  task: Task;
}

function TaskItem({task}: TaskItemProps) {
  const [selectedTask, setSelectedTask] = useState<Task>(new Task());
  const [loading, setLoading] = useState(false);

  const getContent = () => {
    if(!selectedTask.id) {
      return (
        <div>[No Task Selected]</div>
      )
    }

    return (
      <Fragment>
        <Card.Subtitle>{selectedTask.title}</Card.Subtitle>
          <Card.Text>
            {selectedTask.description}
          </Card.Text>
      </Fragment>
    )
  }
  
  useEffect(() => {
    if(!task.id) return;
    (async () => {
      setLoading(true);

      try {
        const data = await TaskService.getTaskById(task);
        setSelectedTask(data);
      } catch (e) {
        if (e instanceof Error) {
          Notify.success(e.message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [task]);
  return (
    <div className="center">
      {loading &&
        <Spinner />
      }
      <Card >
        <Card.Body>
          <Card.Title>Task Details</Card.Title>
          {getContent()}
        </Card.Body>
      </Card>
    </div>
  );
}

export default TaskItem;