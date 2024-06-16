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
const generateTaskId = () => nextId++;


// Function to create a task card and set color based on due date.
const createTaskCard = (task) => {
  const cardEl = $('<div>');
  const cardContent = `<h5>${task.title}</h5><p>${task.description}</p><p>Due: ${task.deadline}</p>`;
  cardEl.addClass('card task-card').attr('data-id', task.id).html(cardContent);
  cardEl.append('<button class="btn btn-danger delete-task">Delete</button>');
 
  const today = dayjs();
  console.log('Today:', today.format('YYYY-MM-DD'));
  const deadlineDate = dayjs(task.deadline, "YYYY-MM-DD");
  console.log('Deadline:', deadlineDate.format('YYYY-MM-DD'));

  // Set color based on due date
  if (deadlineDate.isBefore(today, 'day')) {
    cardEl.addClass('past-due');
    console.log('Class added: past-due');
  } else if (deadlineDate.isSame(today, 'day')) {
    cardEl.addClass('today-due');
    console.log('Class added: today-due');
  } else if (deadlineDate.isAfter(today, 'day')) {
    cardEl.addClass('upcoming-due');
    console.log('Class added: upcoming-due');
  }

  return cardEl;
};

// Function to render the task list and make cards draggable
const renderTaskList = () => {
  todoEL.empty();
  inProgEl.empty();
  doneEl.empty();
  
  taskList.forEach(task => {
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
};

// Function to handle adding a new task
const handleAddTask = (event) => {
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
};

// Function to handle deleting a task
const handleDeleteTask = (event) => {
  const taskId = $(event.target).closest('.task-card').data('id');
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
};

// Function to handle dropping a task into a new status lane
const handleDrop = (event, ui) => {
  const taskId = ui.helper.data('id');
  const newStatus = $(event.target).attr('id').replace('-cards', '');
  const task = taskList.find(task => task.id === taskId);
  task.status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
};

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(() => {
  renderTaskList();
  formEl.on('submit', handleAddTask);
  $(document).on('click', '.delete-task', handleDeleteTask);
  $(".lane").droppable({ drop: handleDrop });

  // Datepicker widget
  $('#taskDeadline').datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd'
  });
});
