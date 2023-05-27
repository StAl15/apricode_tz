import React, {useContext, useState} from 'react';
import {
    Button
} from "@material-tailwind/react";
import {Modal} from "./components/Modal/Modal";
import styles from './App.module.scss'
import {ITodo} from "./models/ITodo";
import Todo from "./store/todo";
import TodoItem from "./components/TodoItem/TodoItem";
import {observer} from "mobx-react-lite";
import {SearchField} from "./components/TextField/SearchField/SearchField";


function App() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [rootId, setRootId] = useState<number | undefined | null>(null);
    const [query, setQuery] = useState('');
    const todoStore = useContext(Todo)
    const todos = todoStore.getSearchedTodos(query)

    const handleSave = (todo: ITodo) => {
        todoStore.addTodo(todo)
        setOpen(!open)
        if (todo.rootId) setOpenedAccorditions([...openedAccorditions, todo.rootId])

    }
    const handleOpen = () => {
        setOpen(!open);
    }
    const [openedAccorditions, setOpenedAccorditions] = useState<number[]>([]);

    return (
        <div className={styles.content}>
            <div className={styles.todos}>
                <div className={styles.controls}>
                    <Button className={styles.button}
                            onClick={() => {
                                setRootId(null)
                                handleOpen()
                            }}>
                        <span className={styles.label}>Добавить +</span>
                    </Button>
                    <Button color={'red'} variant={'outlined'} className={styles.button}
                            onClick={() => {
                                setRootId(null)
                                todoStore.removeSelectedTodo()
                            }}>
                        <span className={styles.label}>Удалить выделенные</span>
                    </Button>

                </div>

                <SearchField query={query} setQuery={setQuery}/>

                <Modal open={open} handleSave={handleSave} handleOpen={handleOpen} rootId={rootId}/>

                <div className={styles.items}>
                    {todos.map((todo, idx) =>
                        <div className={styles.item}>
                            <TodoItem todo={todo} setTitle={setTitle} setContent={setContent}
                                      setOpenedAccorditions={setOpenedAccorditions}
                                      openedAccorditions={openedAccorditions}
                                      idx={(idx + 1).toString()} setRootId={setRootId} handleOpen={handleOpen}/>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.currentItem}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.desc}>{content}</p>
            </div>

        </div>
    );
}

export default observer(App);
