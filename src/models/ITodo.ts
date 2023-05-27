export interface ITodo {
    id: number;
    title: string;
    text: string;
    subtodos: number[];
    rootId: (number | undefined | null);
    completed: boolean;
}