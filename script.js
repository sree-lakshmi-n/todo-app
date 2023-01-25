`use strict`;

// Helper class to fetch elements by class name
const _ = (className) => {
  return document.getElementsByClassName(className);
};

const themeToggleBtn = _("header__toggle-button")[0];
const todoSectionNew = _("section-to-do__new")[0];
const todoSectionList = _("section-to-do__list")[0];
const todoItems = _("section-to-do__items");
const todoTextBox = _("section-to-do__items-textbox");
const btnCheckBox = _("btn-checkbox");
const btnClose = _("btn-close");
const textCompleted = _("textbox-completed");
const todoMetrics = _("section-to-do__metrics")[0];
const todoMetricsList = _("section-to-do__metrics-nav-list")[0];
const todoClearBtn = _("section-to-do__metrics-clear-btn")[0];
const todoInstructions = _("section-to-do__instructions")[0];

const todoCompleted = _("btn-completed");

// Items left calculation
const itemsLeft = _("items-left")[0];

const modifyItemsLeft = () => {
  itemsLeft.textContent = todoItems.length - todoCompleted.length - 1;
};

modifyItemsLeft();

// Find current theme
const isCurrentThemeDark = () => {
  return themeToggleBtn.classList.contains("header-toggle-button-dark");
};

// Helper classes to toggle theme
const toggleElementTheme = (element, classToBeToggledWith) => {
  element.classList.toggle(classToBeToggledWith);
};
const toggleListTheme = (list, classToBeToggledWith) => {
  Array.from(list).forEach((e) => {
    e.classList.toggle(classToBeToggledWith);
  });
};

const themeToggle = () => {
  toggleElementTheme(themeToggleBtn, "header-toggle-button-dark");
  toggleElementTheme(document.body, "body-bg-dark");
  toggleElementTheme(todoSectionNew, "section-to-do__new-dark");
  toggleElementTheme(todoSectionList, "section-to-do__list-dark");
  toggleElementTheme(todoMetrics, "section-to-do__metrics-dark");
  toggleElementTheme(todoMetricsList, "section-to-do__metrics-nav-list-dark");
  toggleElementTheme(todoClearBtn, "section-to-do__metrics-clear-btn-dark");
  toggleElementTheme(todoInstructions, "section-to-do__instructions-dark");

  toggleListTheme(todoItems, "section-to-do__items-dark");
  toggleListTheme(todoTextBox, "section-to-do__items-textbox-dark");
  toggleListTheme(btnCheckBox, "btn-checkbox-dark");
  toggleListTheme(btnClose, "btn-close-dark");
  toggleListTheme(textCompleted, "textbox-completed-dark");
};

themeToggleBtn.addEventListener("click", themeToggle);

// Drag and drop functionality (Jquery)

$(function () {
  $("#sortable").sortable({
    items: ".section-to-do__items",
  });
  $("#sortable").disableSelection();
});

// Adding new to-do items
const newToDo = _("new_to-do")[0];

const addNewToDo = (el) => {
  const todo = document.createElement("li");

  const todoCheckBox = document.createElement("button");

  todoCheckBox.setAttribute("onclick", "toggleCompleted(this)");
  const todoText = document.createElement("p");

  todoText.textContent = newToDo.value.trim();
  const todoClose = document.createElement("button");

  todoClose.setAttribute("onclick", "removeToDo(this)");

  if (isCurrentThemeDark()) {
    todo.setAttribute(
      "class",
      "section-to-do__items section-to-do__items-dark"
    );
    todoCheckBox.setAttribute(
      "class",
      "section-to-do__items-btn btn btn-checkbox btn-checkbox-dark"
    );
    todoText.setAttribute(
      "class",
      "section-to-do__items-textbox section-to-do__items-textbox-dark"
    );
    todoClose.setAttribute(
      "class",
      "section-to-do__items-btn btn btn-close btn-close-dark"
    );
  } else {
    todo.setAttribute("class", "section-to-do__items");
    todoCheckBox.setAttribute(
      "class",
      "section-to-do__items-btn btn btn-checkbox"
    );
    todoText.setAttribute("class", "section-to-do__items-textbox");
    todoClose.setAttribute("class", "section-to-do__items-btn btn btn-close");
  }

  todo.appendChild(todoCheckBox);
  todo.appendChild(todoText);
  todo.appendChild(todoClose);

  todoSectionList.prepend(todo);

  // Reset value of input box
  newToDo.value = "";
  // items left
  modifyItemsLeft();
};

newToDo.addEventListener("keypress", (event, el) => {
  if (event.key === "Enter" && newToDo.value.trim()) {
    addNewToDo(el);
  }
});

// Close button functionality
const removeToDo = (element) => {
  element.parentElement.remove();
  // items left
  modifyItemsLeft();
};

// Completed btn functionality
const toggleCompleted = (element) => {
  element.classList.toggle("btn-completed");
  element.nextSibling.classList.toggle("textbox-completed");
  if (isCurrentThemeDark()) {
    element.nextSibling.classList.toggle("textbox-completed-dark");
  }
  modifyItemsLeft();
};

// Adding and Removing class from all list elements
const addClass = (elem, className) => {
  Array.from(elem).forEach((e) => {
    e.classList.add(className);
  });
};
const addClassToParent = (elem, className) => {
  Array.from(elem).forEach((e) => {
    e.parentElement.classList.add(className);
  });
};
const removeClass = (elem, className) => {
  Array.from(elem).forEach((e) => {
    e.classList.remove(className);
  });
};
const removeClassFromParent = (elem, className) => {
  Array.from(elem).forEach((e) => {
    e.parentElement.classList.remove(className);
  });
};

// Metric Nav list filtering functionality

const filterList = (metricBtn) => {
  if (metricBtn.classList.contains("btn-all")) {
    removeClass(todoItems, "hide");
  } else if (metricBtn.classList.contains("btn-active")) {
    removeClass(todoItems, "hide");
    addClassToParent(todoCompleted, "hide");
  } else {
    addClass(todoItems, "hide");
    todoSectionNew.classList.remove("hide");
    removeClassFromParent(todoCompleted, "hide");
  }
};

const filterByMetric = (clickedElem) => {
  const metricBtn = clickedElem.target;
  removeClass(todoMetricsList.children, "active");
  metricBtn.classList.add("active");
  filterList(metricBtn);
};

Array.from(todoMetricsList.children).forEach((e) => {
  e.addEventListener("click", filterByMetric, e);
});

// Clear Completed btn functionality
const clearCompleted = () => {
  Array.from(todoCompleted).forEach((e) => {
    e.parentElement.remove();
  });
};

todoClearBtn.addEventListener("click", clearCompleted);

// Enabling focus state for metric list elements
Array.from(todoMetricsList).forEach((li) => {
  li.focus();
});
todoClearBtn.focus();
