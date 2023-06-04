import {action, autorun, computed, makeAutoObservable, observable} from "mobx";
import {createContext, useState} from "react";
import {ITodo} from "../models/ITodo";


class Todo {

    @observable todos: ITodo[] = localStorage.todos ? JSON.parse(localStorage.todos) : [];
    @observable lastIdx: number = localStorage.lastIdx ? JSON.parse(localStorage.lastIdx) : this.todos.length;
    @observable openedAccorditions: number[] = localStorage.openAccorditions ? JSON.parse(localStorage.openAccorditions) : [];

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true})
        autorun(() => {
            localStorage.todos = JSON.stringify(this.todos);
            localStorage.openAccorditions = JSON.stringify(this.openedAccorditions);
            localStorage.lastIdx = JSON.stringify(this.lastIdx);

        })
    }

    @action setOpenedAccorditions(ids: number[]) {
        this.openedAccorditions = ids;
    }

    @action addTodo(todo: ITodo) {
        this.todos.push(todo)
        this.todos = this.todos.map(item => item.id === todo.rootId ? {
            ...item,
            subtodos: [...item.subtodos, todo.id]
        } : item)
        this.lastIdx = Math.max(this.lastIdx, todo.id)
        this.setRootTodos()
    }


    @action removeTodo(id: number) {
        // this.todos = this.todos
        //     .map(todo => todo.id === this.getTodoById(id).rootId ? {
        //         ...todo,
        //         subtodos: todo.subtodos.filter(it => it !== id)
        //     } : todo)
        //     .filter(todo => todo.id !== id)
        //     .filter(todo => todo.rootId !== id);
        // this.setRootTodos();

        const todoToRemove = this.getTodoById(id);
        if (todoToRemove) {
            this.todos = this.todos
                .map(todo => todo.id === todoToRemove.rootId ? {
                    ...todo,
                    subtodos: todo.subtodos.filter(it => it !== id)
                } : todo)
                .filter(todo => todo.id !== id && todo.rootId !== id);
            this.setRootTodos();
        }
    }

    @action removeSelectedTodo() {
        this.todos.forEach((todo) => {
            if (todo.completed) this.removeTodo(todo.id);
        })
        this.setRootTodos();

    }

    @action completeTodo(id: (number | null), completed: boolean) {
        this.todos = this.todos.map(todo => todo.id === id ?
            {
                ...todo,
                completed: completed
            }
            : todo
        )
        // this.setRootTodos()
        this.todos.forEach((todo) => {
            // this.setRootTodos()
            if (todo.rootId === id || todo.id === id) {
                if (todo.subtodos) {
                    todo.subtodos.forEach((_id) => {
                        this.completeAllSubtodos(_id, completed)
                    })
                }
            }
        })
        this.setRootTodos()

    }

    @action completeAllSubtodos(id: number, completed: boolean) {
        const todo = this.getTodoById(id);
        if (todo && todo.subtodos) {
            todo.subtodos.forEach(
                (_id) => {
                    this.completeAllSubtodos(_id, completed);
                }
            )
        }
        this.completeTodo(id, completed);
    }

    @computed getTodoById(id: (number | null)) {
        return this.todos.filter(todo => todo.id === id)[0] ?? false
    }


    @action ReqRootTodos() {
        this.todos = this.todos.map(todo =>
            todo.subtodos.length > 0 ?
                todo.subtodos.every((item) => this.getTodoById(item).completed) ?
                    {
                        ...todo,
                        completed: true
                    } : {
                        ...todo,
                        completed: false
                    }
                : todo
        )
    }

    @action setRootTodos() {
        this.todos.forEach(() => this.ReqRootTodos())
    }

    @computed getSearchedTodos(query: string) {
        return this.todos.filter(todo => query === '' ? todo.rootId == null && todo.title.includes(query.toLowerCase()) : todo.title.includes(query.toLowerCase()))
    }

    @computed getSubtodos(todoId: number) {
        return this.todos.filter(todo => todo.rootId === todoId)
    }

}

// export default new Todo()
export default createContext(new Todo())