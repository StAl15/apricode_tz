import React, {Fragment, useContext, useState} from "react";
import {Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Textarea} from "@material-tailwind/react";
import {ITodo} from "../../models/ITodo";
import Todo from "../../store/todo";

export const Modal: React.FC<{
    handleOpen: VoidFunction,
    open: boolean,
    handleSave: (todo: ITodo) => void,
    rootId: (number | null)
}> = ({
          handleOpen,
          open,
          handleSave,
          rootId
      }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const todoStore = useContext(Todo)

    return (
        <Fragment>
            <Dialog size={'sm'} open={open} handler={handleOpen}>
                <DialogHeader>Добавить задачу</DialogHeader>
                <DialogBody className={'space-y-5'} divider>
                    <Input value={title} onChange={e => setTitle(e.target.value)} size={'lg'} label={'Заголовок'}/>
                    <Textarea value={content} onChange={e => setContent(e.target.value)} label={'Текст задачи'}/>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Отмена</span>
                    </Button>
                    <Button variant="gradient" color="blue" onClick={() => {
                        handleSave({
                            id: todoStore.lastIdx + 1,
                            title: title,
                            text: content,
                            subtodos: [],
                            rootId: rootId,
                            completed: false
                        })
                        setTitle('')
                        setContent('')
                    }}>
                        <span>Сохранить</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </Fragment>
    );
};