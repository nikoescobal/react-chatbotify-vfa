// TextInput.tsx
import React, { useState } from 'react';

interface TextInputProps {
  submitInput: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ submitInput }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim() === '') {
      alert('Please enter a value.');
      return;
    }
    submitInput(value);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your answer here..."
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TextInput;
