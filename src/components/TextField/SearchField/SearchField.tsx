import {Button, Input} from "@material-tailwind/react";

export const SearchField: React.FC<{ query: string, setQuery: (e: string) => void }> = props => {
    return (
        <>
            <div className="relative flex w-full my-3">
                <Input
                    type="text"
                    label="Задача"
                    value={props.query}
                    onChange={e => props.setQuery(e.target.value)}
                    className="py-5"
                    containerProps={{
                        className: "min-w-0",
                    }}
                />
            </div>
        </>
    );
};