"use strict";


const animate = function ({ timing, draw, duration }) {

    const start = performance.now();
  
    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        const progress = timing(timeFraction);

        draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
}

class Todo {
    constructor(form, input, todoList, todoComplete, todoContainer) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoComplete = document.querySelector(todoComplete);
        this.todoContainer = document.querySelector(todoContainer);
        this.todoStorage = new Map(JSON.parse(localStorage.getItem('todoList')));
    }

    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoStorage]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoComplete.textContent = '';
        this.todoStorage.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todoItem) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todoItem.key;
        li.style.opacity = 0;
        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todoItem.value}</span>
        <div class="todo-buttons">
            <button class="todo-edit"></button>
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
        </div>`);
        
        if (todoItem.completed) {
            this.todoComplete.append(li);
            const lastChild = this.todoComplete.lastChild;
            animate({
                duration: 500,
                timing(timeFraction) {
                    return timeFraction;
                },
                draw(progress) {
                    lastChild.style.opacity = progress;
                }
            });

        } else {
            this.todoList.append(li);
            const lastChild = this.todoList.lastChild;

            animate({
                duration: 500,
                timing(timeFraction) {
                    return timeFraction;
                },
                draw(progress) {
                    lastChild.style.opacity = progress;
                }
            });
        }
    }

    addTodo(event) {
        event.preventDefault();
        if (!this.input.value.trim()) {
            alert('Нельзя добавить пустое дело!');
            return;
        }
        const newTodo = {
            value: this.input.value,
            completed: false,
            key: this.generateKey(),
        }
        this.input.value = '';
        this.todoStorage.set(newTodo.key, newTodo);
        this.render();
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    changeItem(target) {
        let parentItem = target,
            spanItem = parentItem.firstElementChild,
            spanValue = spanItem.textContent;
        spanItem.setAttribute('contentEditable', 'true');
        spanItem.focus();

        parentItem.addEventListener('keydown', (event) => {
            if (!spanItem.textContent.trim() && event.key === 'Enter') {
                alert('Нельзя оставить поле пустым!');

                spanItem.textContent = spanValue;
                spanItem.removeAttribute('contentEditable');
                return;

            } else if (event.key === 'Enter') {
                this.todoStorage.forEach(item => {
                    if (item.key === parentItem.key) {
                        item.value = spanItem.textContent;
                        spanItem.removeAttribute('contentEditable');
                        this.render();
                        return;
                    }
                }, this)
            }
        });
    }

    deleteItem(target) {
        let todoComplete = document.querySelector('.todo-completed');
        let todoList = document.querySelector('.todo-list');

        this.todoStorage.forEach(item => {
            if (item.key === target.key) {
                if (item.completed) {
                    todoComplete.childNodes.forEach(item => {
                        if (item.key === target.key) {
                            animate({
                                duration: 500,
                                timing(timeFraction) {
                                    return timeFraction;
                                },
                                draw(progress) {
                                    item.style.opacity = 1 - progress;
                                }
                            });
                        }
                    })
                } else {
                    todoList.childNodes.forEach(item => {
                        if (item.key === target.key) {
                            animate({
                                duration: 500,
                                timing(timeFraction) {
                                    return timeFraction;
                                },
                                draw(progress) {
                                    item.style.opacity = 1 - progress;
                                }
                            });
                        }
                    })
                }
                this.todoStorage.delete(item.key);
            } 
        })
        setTimeout((_this) => {
            this.render();
        }, 500);
    }

    completedItem(target) {
        this.todoStorage.forEach(item => {
            if (item.key === target.key) {
                item.completed = !item.completed;
                this.render();
                return;
            }
        })
    }

    handler() {
        this.todoContainer.addEventListener('click', event => {
            const target = event.target;
            if (target.matches('.todo-edit')) {
                this.changeItem(target.closest('.todo-item'));
            } else if (target.matches('.todo-remove')) {
                this.deleteItem(target.closest('.todo-item'));
            } else if (target.matches('.todo-complete')) {
                this.completedItem(target.closest('.todo-item'));
            }
        })
    }

    init() {
        this.render();
        this.form.addEventListener('submit', this.addTodo.bind(this))
        this.handler();
    }

}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();