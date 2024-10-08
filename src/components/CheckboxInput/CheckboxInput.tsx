// CheckboxInput.tsx
import React from 'react';

interface CheckboxInputProps {
  submitInput: (values: string[]) => void;
  messageConfig: any;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  submitInput,
  messageConfig,
}) => {
  const {
    inputAttributes: { items = [], min = 1, max = items.length },
  } = messageConfig;

  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const handleChange = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = () => {
    if (selectedItems.length < min) {
      alert(`Please select at least ${min} item(s).`);
      return;
    }
    if (selectedItems.length > max) {
      alert(`Please select no more than ${max} item(s).`);
      return;
    }
    submitInput(selectedItems);
  };

  return (
    <div>
      {items.map((item: string) => (
        <div key={item}>
          <label>
            <input
              type="checkbox"
              value={item}
              checked={selectedItems.includes(item)}
              onChange={() => handleChange(item)}
            />
            {item}
          </label>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CheckboxInput;
