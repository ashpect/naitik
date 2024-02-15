import React, { useState } from 'react';

interface FormData {
  field1: string;
  field2: string;
}

const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    field1: '',
    field2: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted with data:', formData);
    try {
      const response = await fetch('http://127.0.0.1:5000/fakereview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <h2>New Component</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="field1">Field 1:</label>
          <input
            type="text"
            id="field1"
            name="field1"
            value={formData.field1}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="field2">Field 2:</label>
          <input
            type="text"
            id="field2"
            name="field2"
            value={formData.field2}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
