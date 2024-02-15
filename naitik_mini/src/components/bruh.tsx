import { useState, FormEvent, ChangeEvent } from 'react';

interface FormData {
  review: string;
  url: string;
}

function FormSubmitComponent() {
  const [formData, setFormData] = useState<FormData>({
    review: '',
    url: ''
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const apiUrl = 'http://127.0.0.1:3000/getsentiment';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Failed to submit form data:', error);
    }
  };

  return (
    <div>
      <h2>Submit Form Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="review">Product Review:</label>
          <input
            type="text"
            id="review"
            name="review"
            value={formData.review}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="url">URL of Account:</label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FormSubmitComponent;
