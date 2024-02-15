import React, { useState } from 'react';

interface DarkPatternSelectorProps {
  onSelect: (pattern: string) => void;
}

const DarkPatternSelector: React.FC<DarkPatternSelectorProps> = ({ onSelect }) => {
  const darkPatterns = ['Trick Questions', 'Hidden Costs', 'Misdirection', 'Forced Continuity'];
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPattern(event.target.value || ""); // Set selectedPattern to an empty string if event.target.value is null
    onSelect(event.target.value || ""); // Pass an empty string if event.target.value is null
};

return (
    <select value={selectedPattern || ""} onChange={handleSelectChange}> // Set value to an empty string if selectedPattern is null
        <option value="">Select a Dark Pattern</option>
        {darkPatterns.map((pattern, index) => (
            <option key={index} value={pattern}>
                {pattern}
            </option>
        ))}
    </select>
);
};

export default DarkPatternSelector;
