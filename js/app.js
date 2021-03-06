const containerItems = document.querySelector(".container-items");
const todoContent = document.querySelector("input#todoContent");
const addButton = document.querySelector("button.add");
const form = document.querySelector(".form");
const addIconButton = document.querySelector(".add-button");
let todos = [];

document.addEventListener("DOMContentLoaded", function () {
    loadLocalStorage();
    renderTodos();
    addIconButton.addEventListener('click', e => {
        hideButtonAndShowForm();
    });

    document.addEventListener("keypress", e => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            startAddingTodo();
        }
    });
    addButton.addEventListener("click", function () {
        startAddingTodo();
    });
    containerItems.addEventListener("click", e => {
        if (e.target.nodeName === 'BUTTON' && e.target.id && e.target.classList.contains("delete")) {
            const id = parseInt(e.target.id);
            deleteFromLocalStorage(id);
            renderTodos();
        } else if (e.target.nodeName === 'BUTTON' && e.target.id && e.target.classList.contains("done")) {
            const id = parseInt(e.target.id);
            doneTodoInLocalStorage(id);
        } else if (e.target.nodeName === 'BUTTON' && e.target.id && e.target.classList.contains("undone")) {
            const id = parseInt(e.target.id);
            unDoneTodoInLocalStorage(id);
        }
    });

    todoContent.addEventListener("input", e => {
        if (todoContent.value.length > 6) {
            addButton.disabled = false;
        }
    });
});

function hideButtonAndShowForm() {
    form.style.display = "flex";
    addIconButton.style.display = "none";
}

function hideFormAndShowButton() {
    form.style.display = "none";
    addIconButton.style.display = "block";
}

function renderTodos() {
    loadLocalStorage();
}

function startAddingTodo() {
    if (todoContent.value) {
        hideFormAndShowButton();
        if (todos.length) {
            const lastTodo = todos[todos.length - 1];
            const newTodo = {
                id: lastTodo.id + 1,
                content: todoContent.value
            };
            todos.push(newTodo);
            addToLocalStorage(newTodo);
        } else {
            const newTodo = {
                id: 1,
                content: todoContent.value
            };
            todos.push(newTodo);
            addToLocalStorage(newTodo);
        }
        renderTodos();
    }
}

function addTodoItem(todo) {
    const todoItem = document.createElement("div");
    const content = document.createElement("p");
    const buttons = document.createElement("div");
    const buttonDelete = document.createElement("button");


    buttonDelete.innerHTML = "Delete";
    todoItem.classList.add("todo-item");
    buttons.classList.add("buttons");
    buttonDelete.classList.add("delete");
    buttonDelete.id = todo.id;


    if (!todo.done) {
        const buttonDone = document.createElement("button");
        buttonDone.innerHTML = "Done";
        buttonDone.classList.add("done");
        buttonDone.id = todo.id;
        buttons.appendChild(buttonDone);
    } else {
        const buttonUnDone = document.createElement("button");
        buttonUnDone.innerHTML = "Undone";
        buttonUnDone.classList.add("undone");
        buttonUnDone.id = todo.id;
        buttons.appendChild(buttonUnDone);
        todoItem.style.background = "linear-gradient(to right, rgb(131, 96, 195), rgb(46, 191, 145))";
    }

    buttons.appendChild(buttonDelete);
    const contentText = document.createTextNode(todo.content);
    content.appendChild(contentText);
    content.id = todo.id;

    if (todo.done) {
        content.style.textDecoration = "line-through";
    }

    todoItem.appendChild(content);
    todoItem.appendChild(buttons);
    containerItems.appendChild(todoItem);
    todoContent.value = "";
}

function addToLocalStorage(todo) {
    loadLocalStorage(todo);
}

function deleteFromLocalStorage(id) {
    loadLocalStorage(id, 'delete');
}

function unDoneTodoInLocalStorage(id) {
    loadLocalStorage(id, 'undone');
}

function clearTodos() {
    if (document.querySelectorAll('div.todo-item')) {
        const elementTodos = Array.from(document.querySelectorAll('div.todo-item'));
        elementTodos.forEach(todo => todo.remove());
    }
}

function doneTodoInLocalStorage(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.done = true;
        }

        return todo;
    });

    localStorage.setItem("todos", JSON.stringify(todos));
    loadLocalStorage();
}

function loadLocalStorage(todo, type = 'delete') {
    // Clear everything first
    clearTodos();
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("todos")) {
            const localStorageTodos = localStorage.getItem("todos");
            todos = JSON.parse(localStorageTodos);
            // Add to localStorage
            if (todo && typeof todo === 'object') {
                todos.push(todo);
            } else if (todo && typeof todo === 'number' && type === 'delete') {
                todos = todos.filter(t => t.id !== todo);
            } else if (todo && typeof todo === 'number' && type === 'undone') {
                todos = todos.map(t => {
                    if (t.id === todo) {
                        delete t.done;
                    }
                    return t;
                });
            }
            localStorage.setItem("todos", JSON.stringify(todos));
        } else {
            localStorage.setItem("todos", JSON.stringify(todos));
        }
        todos.forEach(item => {
            addTodoItem(item);
        });
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}