// 'use strict';

let todoControl = document.querySelector('.todo-control'),
    headerInput = document.querySelector('.header-input'),
    todoList = document.querySelector('.todo-list'),
    todoCompleted = document.querySelector('.todo-completed');

let todoData = [];

const render = function () {
    todoList.textContent = '';
    todoCompleted.textContent = '';

    for (let item = 0; item < localStorage.length; item++) {
        let dataItem = JSON.parse(localStorage.getItem(localStorage.key(item)))

        let li = document.createElement('li');
        if (dataItem.value.trim() !== '') {
            li.classList.add('todo-item');
            li.innerHTML = `<span class="text-todo">${dataItem.value}</span>` +
            '<div class="todo-buttons">' +
                '<button class="todo-remove"></button>' +
                '<button class="todo-complete"></button>' + 
            '</div>';

            if (dataItem.completed) {
                todoCompleted.append(li)
            } else {
               todoList.append(li); 
            };
    
            const todoComplete = li.querySelector('.todo-complete');
            todoComplete.addEventListener('click', function () {
                dataItem.completed = !dataItem.completed;
                localStorage.setItem(localStorage.key(item), JSON.stringify(dataItem));
                render();
            });
            const todoRemove = li.querySelector('.todo-remove');
            todoRemove.addEventListener('click', function () {
                localStorage.removeItem(localStorage.key(item));
                render();
            });
        }
    }
};

todoControl.addEventListener('submit', function (event) {
    event.preventDefault();
    headerInput= document.querySelector('.header-input');

    const newTodo = {
        value: headerInput.value,
        completed: false,
    }   

    localStorage.setItem(headerInput.value, JSON.stringify(newTodo));
    headerInput.value = '';

    render();
})

render();