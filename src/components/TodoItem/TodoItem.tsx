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
    openedAccorditions: number[],
    setOpenedAccorditions: (ids: number[]) => void,
    idx: string,
    setRootId: (id: number) => void,
    handleOpen: () => void,
}> = ({
          todo,
          setTitle,
          setContent,
          setOpenedAccorditions,
          openedAccorditions,
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
                        !openedAccorditions.includes(todo.id)
                            ? setOpenedAccorditions([...openedAccorditions, todo.id])
                            : setOpenedAccorditions(openedAccorditions.filter(item => item != todo.id));
                    }}>
                        {
                            openedAccorditions.includes(todo.id)
                                ? <ChevronRight
                                    className={classNames(`${openedAccorditions.includes(todo.id)
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

                <div className={styles.right}>
                    <IconButton onClick={() => todoStore.removeTodo(todo.id)}
                                className={styles.rmTodo}>X
                    </IconButton>
                </div>

            </div>
            {subtodos.map((subtodo, subIdx) =>
                <div className={openedAccorditions.includes(todo.id) ? 'block ml-5' : 'hidden'}>
                    <TodoItem todo={subtodo} setTitle={setTitle} setContent={setContent}
                              setOpenedAccorditions={setOpenedAccorditions}
                              openedAccorditions={openedAccorditions}
                              idx={`${idx}.${subIdx + 1}`} setRootId={setRootId} handleOpen={handleOpen}/>
                </div>
            )}
        </>
    );
};

export default observer(TodoItem)
