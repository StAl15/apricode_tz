import {ChevronRight} from "@mui/icons-material";
import {Checkbox, IconButton} from "@material-tailwind/react";
import Todo from "../../store/todo";
import React, {useContext} from "react";
import {ITodo} from "../../models/ITodo";
import {observer} from "mobx-react-lite";

const TodoItem: React.FC<{
    todo: ITodo,
    setTitle: (title: string) => void,
    setContent: (content: string) => void,
    openedAccorditions: number[],
    setOpenedAccorditions: (ids: number[]) => void,
    idx: string,
    setRootId: (id: number) => void,
    handleOpen: () => void,
    isSubtodo?: boolean,
}> = ({
          todo,
          setTitle,
          setContent,
          setOpenedAccorditions,
          openedAccorditions,
          idx,
          setRootId,
          handleOpen,
          isSubtodo = false
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
                className={`group/card justify-between w-full flex items-center bg-[#F7FBFD] h-fit p-5 hover:bg-blue-100`}>
                <div className={'flex items-center'}>
                    <div onClick={() => {
                        !openedAccorditions.includes(todo.id)
                            ? setOpenedAccorditions([...openedAccorditions, todo.id])
                            : setOpenedAccorditions(openedAccorditions.filter(item => item != todo.id));
                    }}>
                        {
                            openedAccorditions.includes(todo.id)
                                ? <ChevronRight
                                    className={`${openedAccorditions.includes(todo.id)
                                        ? 'visible'
                                        : 'invisible group-hover/card:visible'
                                    }  rotate-90`}/>
                                : <ChevronRight className={`invisible group-hover/card:visible`}/>
                        }
                    </div>
                    <div className={'items-center flex space-x-3'}>
                        <Checkbox checked={todo.completed} onChange={() => todoStore.completeTodo(todo.id, !todo.completed)}/>

                        <h1 className={'font-medium capitalize'}>
                            Задача {idx}: {todo.title}
                        </h1>
                        <span onClick={() => {
                            setRootId(todo.id)
                            handleOpen()
                        }}
                              className={'invisible group-hover/card:visible text-blue-gray-300 text-sm'}>
                                        Добавить
                                    </span>
                    </div>

                </div>

                <div className={'flex items-center'}>
                    <IconButton onClick={() => todoStore.removeTodo(todo.id)}
                                className={'invisible group-hover/card:visible '}>X
                    </IconButton>
                </div>

            </div>
            {subtodos.map((subtodo, subIdx) =>
                <div className={openedAccorditions.includes(todo.id) ? 'block ml-5' : 'hidden'}>
                    <TodoItem todo={subtodo} setTitle={setTitle} setContent={setContent}
                              setOpenedAccorditions={setOpenedAccorditions}
                              openedAccorditions={openedAccorditions}
                              idx={`${idx}.${subIdx + 1}`} setRootId={setRootId} handleOpen={handleOpen}
                              isSubtodo={true}/>
                </div>
            )}
        </>
    );
};

export default observer(TodoItem)
