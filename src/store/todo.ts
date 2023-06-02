import {action, autorun, computed, makeAutoObservable, observable} from "mobx";
import {createContext} from "react";
import {ITodo} from "../models/ITodo";

export enum modeTodo {
    subtodos = "subtodos",
    rootodos = "rootodos"
}

class Todo {

    @observable todos: ITodo[] = []
    @observable lastIdx: number = this.todos.length

    constructor() {
        makeAutoObservable(this)
        autorun(() => console.log(JSON.stringify(this.todos)))
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
        this.todos = this.todos.filter(todo => todo.id !== id).filter(todo => todo.rootId !== id);
        this.setRootTodos();
    }

    @action removeSelectedTodo() {
        this.todos = this.todos.filter(todo => {
            if (todo.completed) {
                todo.subtodos = [];
            }
            return !todo.completed
        });
    }

    @action completeTodo(id: (number | null), completed: boolean, mode?: modeTodo) {
        this.todos = this.todos.map(todo => todo.id === id ?
            {
                ...todo,
                completed: completed
            }
            : todo
        )
        this.setRootTodos()
        this.todos.forEach((todo) => {
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
        if (todo.subtodos) {
            this.getTodoById(id).subtodos.forEach(
                (_id) => this.completeAllSubtodos(_id, completed)
            )
            this.setRootTodos()
        }
        this.completeTodo(id, completed)
        this.setRootTodos()
    }

    @computed getTodoById(id: (number | null)) {
        return this.todos.filter(todo => todo.id === id)[0]
    }

    @action setRootTodos() {
        this.todos = this.todos.map(todo => todo.subtodos.length > 0 ?
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

    @computed getSearchedTodos(query: string) {
        return this.todos.filter(todo => query === '' ? todo.rootId == null && todo.title.includes(query.toLowerCase()) : todo.title.includes(query.toLowerCase()))
    }

    @computed getSubtodos(todoId: number) {
        return this.todos.filter(todo => todo.rootId === todoId)
    }

}

// export default new Todo()
export default createContext(new Todo())