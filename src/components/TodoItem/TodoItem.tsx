import {ChevronRight} from "@mui/icons-material";
import {Checkbox, IconButton} from "@material-tailwind/react";
import Todo from "../../store/todo";
import React, {useContext} from "react";
import {ITodo} from "../../models/ITodo";
import {observer} from "mobx-react-lite";
import styles from './TodoItem.module.scss'
import classNames from "classnames";

const TodoItem: React.FC<{
    todo: ITodo,
    setTitle: (title: string) => void,
    setContent: (content: string) => void,
    idx: string,
    setRootId: (id: number) => void,
    handleOpen: () => void,
}> = ({
          todo,
          setTitle,
          setContent,
          idx,
          setRootId,
          handleOpen
      }) => {

    const todoStore = useContext(Todo)

    const subtodos = todoStore.getSubtodos(todo.id)

    return (
        <>
            <div
                key={todo.id}
                onClick={() => {
                    setTitle(todo.title)
                    setContent(todo.text);
                }}
                className={styles.wrapper}>
                <div className={styles.left}>
                    <div className={styles.chevronBox} onClick={() => {
                        !todoStore.openedAccorditions.includes(todo.id)
                            ? todoStore.setOpenedAccorditions([...todoStore.openedAccorditions, todo.id])
                            : todoStore.setOpenedAccorditions(todoStore.openedAccorditions.filter(item => item !== todo.id));
                    }}>
                        {
                            todoStore.openedAccorditions.includes(todo.id)
                                ? <ChevronRight
                                    className={classNames(`${todoStore.openedAccorditions.includes(todo.id)
                                        ? 'visible rotate-90'
                                        : ''
                                    }`, styles.chevron)}/>
                                : <ChevronRight className={styles.chevron}/>
                        }
                    </div>
                    <div className={styles.actions}>
                        <Checkbox checked={todo.completed}
                                  onChange={() => todoStore.completeTodo(todo.id, !todo.completed)}/>

                        <h1>
                            Задача {idx}: {todo.title}
                        </h1>
                        <span className={styles.add} onClick={() => {
                            setRootId(todo.id)
                            handleOpen()
                        }}>
                                        Добавить
                                    </span>
                    </div>

                </div>

                <div className={todo.subtodos.length > 0 ? 'hidden' : styles.right}>
                    <IconButton onClick={() => todoStore.removeTodo(todo.id)}
                                className={styles.rmTodo}>X
                    </IconButton>
                </div>

            </div>
            {subtodos.map((subtodo, subIdx) =>
                <div className={todoStore.openedAccorditions.includes(todo.id) ? 'block ml-5' : 'hidden'}>
                    <TodoItem todo={subtodo} setTitle={setTitle} setContent={setContent}
                              idx={`${idx}.${subIdx + 1}`} setRootId={setRootId} handleOpen={handleOpen}/>
                </div>
            )}
        </>
    );
};

export default observer(TodoItem)
