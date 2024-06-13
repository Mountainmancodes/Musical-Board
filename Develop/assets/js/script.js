const formEl = $('#taskForm');
const titleEl = $('#taskTitle');
const descriptionEl = $('#taskDescription');
const deadlineEl = $('#taskDeadline');
const todoEL = $('#todo-cards');
const inProgEl = $('#in-progress-cards');
const doneEl = $('#done-cards');

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
  const cardEl = $('<div>');
  const cardContent = `<h5>${task.title}</h5><p>${task.description}</p><p>Due: ${task.deadline}</p>`;
  cardEl.addClass('card task-card').attr('data-id', task.id).html(cardContent);
  cardEl.append('<button class="btn btn-danger delete-task">Delete</button>');
  return cardEl;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
  todoEL.empty();
  inProgEl.empty();
  doneEl.empty();

  taskList.forEach(function (task) {
    const taskCard = createTaskCard(task);
    if (task.status === 'to-do') {
      taskCard.appendTo(todoEL);
    } else if (task.status === 'in-progress') {
      taskCard.appendTo(inProgEl);
    } else if (task.status === 'done') {
      taskCard.appendTo(doneEl);
    }
  });

  $(".task-card").draggable({ revert: "invalid", helper: "clone" });
}

// Function to handle adding a new task


// Function to handle deleting a task


// Function to handle dropping a task into a new status lane


// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
