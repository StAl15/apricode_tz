import React, {Fragment, useContext, useEffect, useMemo, useState} from 'react';
import {
    Button,
    Checkbox,
    IconButton
} from "@material-tailwind/react";
import {Modal} from "./components/Modal/Modal";
import todoStore from "./store/todo";
import {ITodo} from "./models/ITodo";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import Todo from "./store/todo";
import TodoItem from "./components/TodoItem/TodoItem";
import {observer} from "mobx-react-lite";
import {SearchField} from "./components/TextField/SearchField/SearchField";


function App() {
    const [open, setOpen] = useState(false);
    const [openSubtask, setOpenSubtask] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [rootId, setRootId] = useState<number | undefined | null>(null);
    const [query, setQuery] = useState('');
    const todoStore = useContext(Todo)
    const todos = todoStore.getSearchedTodos(query)

    const handleChangeQuery = (e: string) => {
        setQuery(e)
    }


    const handleSave = (todo: ITodo) => {
        todoStore.addTodo(todo)
        setOpen(!open)

    }

    const handleOpen = () => {
        setOpen(!open);
    }
    const handleOpenSubtask = () => {
        setOpenSubtask(!openSubtask);
    }
    const [openedAccorditions, setOpenedAccorditions] = useState<number[]>([]);

    return (
        <div className="flex justify-between w-screen min-h-screen h-full">
            <div className={'w-1/2 bg-white block m-5'}>
                <div className={'flex w-full items-center justify-between'}>
                    <Button className={'w-fit h-fit mb-2'}
                            onClick={() => {
                                setRootId(null)
                                handleOpen()
                            }}>
                        <span className={'capitalize font-medium text-sm'}>Добавить +</span>
                    </Button>
                    <Button color={'red'} variant={'outlined'} className={'w-fit h-fit mb-2'}
                            onClick={() => {
                                setRootId(null)
                                todoStore.removeSelectedTodo()
                            }}>
                        <span className={'capitalize font-medium text-sm'}>Удалить выделенные</span>
                    </Button>

                </div>

                <SearchField query={query} setQuery={setQuery}/>

                <Modal open={open} handleSave={handleSave} handleOpen={handleOpen} rootId={rootId}/>

                <div className={'space-y-2'}>
                    {todos.map((todo, idx) =>
                        <div className={'w-full grid bg-[#F7FBFD] shadow-xl h-fit p-5 rounded-xl'}>
                            <TodoItem todo={todo} setTitle={setTitle} setContent={setContent}
                                      setOpenedAccorditions={setOpenedAccorditions}
                                      openedAccorditions={openedAccorditions}
                                      idx={(idx + 1).toString()} setRootId={setRootId} handleOpen={handleOpen}/>
                        </div>
                    )}
                </div>
            </div>
            <div className={'w-1/2 bg-blue-gray-300 p-5'}>
                <h1 className={'font-semibold text-2xl'}>{title}</h1>
                <p className={'text-sm'}>{content}</p>
            </div>

        </div>
    );
}

export default observer(App);
