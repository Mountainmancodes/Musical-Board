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


function generateTaskId() {
  return nextId++;
}

// Function to create a task card and add color based on due date
function createTaskCard(task) {
  const card = $('<div>').addClass('task-card').data('id', task.id);
  const cardBody = $('<div>').addClass('card-body');
  const cardTitle = $('<h5>').addClass('card-title').text(task.title);
  const cardDate = $('<p>').addClass('card-text').text(task.deadline);
  const cardDesc = $('<p>').addClass('card-text').text(task.description);
  const cardDelete = $('<button>').addClass('btn btn-danger delete-task').text('Delete');

  // Set color based on due date
  const dueDate = dayjs(task.deadline);
  const today = dayjs();
  const overdue = dueDate.isBefore(today, "day");
  const nearDeadline = dueDate.isSame(today, "day");

  if (overdue) {
    card.addClass("bg-danger");
  } else if (nearDeadline) {
    card.addClass("bg-warning");
  }

  cardBody.append(cardTitle, cardDate, cardDesc, cardDelete);
  card.append(cardBody);

  return card;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
  todoEL.empty();
  inProgEl.empty();
  doneEl.empty();
  
  taskList.forEach(function(task) {
    const taskCard = createTaskCard(task);
    if (task.status === 'to-do') {
      taskCard.appendTo(todoEL);
    } else if (task.status === 'in-progress') {
      taskCard.appendTo(inProgEl);
    } else if (task.status === 'done') {
      taskCard.appendTo(doneEl);
    }
  });

  $(".task-card").draggable({ 
    revert: "invalid", 
    helper: "clone",
    start: function(event, ui) {
      ui.helper.addClass('dragging');
    },
    stop: function(event, ui) {
      ui.helper.removeClass('dragging');
    }
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const titleInput = titleEl.val();
  const descriptionInput = descriptionEl.val();
  const deadlineInput = deadlineEl.val();

  if (!titleInput || !descriptionInput || !deadlineInput) {
    console.log('You need to fill out the form!');
    return;
  }

  const newTask = {
    id: generateTaskId(),
    title: titleInput,
    description: descriptionInput,
    deadline: deadlineInput,
    status: 'to-do'
  };

  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));

  renderTaskList();

  formEl[0].reset();
  $('#formModal').modal('hide');
}

// Function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).closest('.task-card').data('id');
  taskList = taskList.filter(function(task) {
    return task.id !== taskId;
  });
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.helper.data('id');
  const newStatus = $(event.target).attr('id').replace('-cards', '');
  const task = taskList.find(function(task) {
    return task.id === taskId;
  });
  task.status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function() {
  renderTaskList();
  formEl.on('submit', handleAddTask);
  $(document).on('click', '.delete-task', handleDeleteTask);
  $(".lane").droppable({ 
    drop: handleDrop,
    hoverClass: 'drop-hover'
  });

  // Datepicker widget
  $('#taskDeadline').datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd'
  });
});
