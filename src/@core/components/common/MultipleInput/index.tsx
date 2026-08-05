import React, { useState } from 'react';
import { TextField, Button, Chip, Box } from '@mui/material';
// import ClearIcon  from '@mui/icons-material';

type IMultipleInput = {
    InputArray: string[]
    setInputArray: (value: string[]) => void
}
const MultipleInput = ({ InputArray, setInputArray }: IMultipleInput) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue) {
            setInputArray([...InputArray, inputValue]);
            setInputValue('');
        }
    };

    const removeInput = (index: number) => {
        const newInputArray = [...InputArray];
        newInputArray.splice(index, 1);
        setInputArray(newInputArray);
    };

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        // console.log(InputArray);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                value={inputValue}
                placeholder='Points'
                fullWidth
            />
            <Box marginTop={3}>
                {InputArray.map((input, index) => (
                    <Chip
                        sx={{ marginBottom: 3 }}
                        key={index}
                        label={input}
                        onDelete={() => removeInput(index)}
                        // deleteIcon={<ClearIcon.Clear />}
                        style={{ marginRight: '0.5rem' }}
                    />
                ))}
            </Box>
            <Button variant="contained" type="submit">
                Submit
            </Button>
        </form>
    );
};

export default MultipleInput;














