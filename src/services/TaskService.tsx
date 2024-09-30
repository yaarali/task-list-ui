import { Task } from '../models/Task';

/**
 * Service class that performs the CRUD with the server
 */

const baseUrl = 'http://localhost:3001';
const url = `${baseUrl}/tasks`;

const TaskService = {
  getTasks() {
    return fetch(`${url}`)
      .then(checkStatus)
      .then(parseJSON)
      .then(convertToTaskModels)
      .catch((error: TypeError) => {
        console.log('log client error ' + error);
        throw new Error(
          'There was an error retrieving the tasks. Please try again.'
        );
      });
  },

  getTaskById(task: Task) {
    return fetch(`${url}/` + task.id)
      .then(checkStatus)
      .then(parseJSON)
      .then((data: any) => {
        return convertToTaskModel(data.response);
      })
      .catch((error: TypeError) => {
        console.log('log client error ' + error);
        throw new Error(
          'There was an error retrieving the tasks. Please try again.'
        );
      });
  },

  saveTask(newTask: Task) {
    return fetch(`${url}`,{
      headers: {
        'content-type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(newTask)
    })
    .then(checkStatus)
    .then(parseJSON)
    .catch((error: TypeError) => {
      console.log('log client error ' + error);
      throw new Error(
        'There was an error adding the task. Please try again.'
      );
    });
  },

  deleteTask(task: Task) {
    return fetch(`${url}/` + task.id, {
      method: "DELETE"
    })
      .then(checkStatus)
      .then(parseJSON)
      .catch((error: TypeError) => {
        console.log('log client error ' + error);
        throw new Error(
          'There was an error deleting the task. Please try again.'
        );
      });
  },

  updateTask(task: Task) {
    return fetch(`${url}/` + task.id, {
      headers: {
        'content-type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify(task)
    })
      .then(checkStatus)
      .then(parseJSON)
      .catch((error: TypeError) => {
        console.log('log client error ' + error);
        throw new Error(
          'There was an error updating the task. Please try again.'
        );
      });
  },
};

function translateStatusToErrorMessage(status: number) {
  switch (status) {
    case 401:
      return 'Please login again.';
    case 403:
      return 'Forbidden: No permission to perform this action';
    default:
      return 'There was an error performing the action. Please try again.';
  }
}

function checkStatus(response: any) {
  if (response.ok) {
    return response;
  } else {
    const httpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

    let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
  }
}

function parseJSON(response: Response) {
  return response.json();
}

function convertToTaskModels(data: any): Task[] {
  let tasks: Task[] = data.response.map(convertToTaskModel);
  return tasks;
}

function convertToTaskModel(item: any): Task {
  return new Task(item);
}

export { TaskService };