import React from 'react';

export default function PropertiesPanel({ selected, updateBlock }) {
  if (!selected) {
    return <div style={{ padding: 10 }}>No block selected</div>;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    updateBlock(selected.id, { [name]: value });
  }

  function handleOptionChange(index, value) {
    const newOptions = [...selected.options];
    newOptions[index] = value;
    updateBlock(selected.id, { options: newOptions });
  }

  function addOption() {
    const newOptions = [...(selected.options || []), `Option ${selected.options.length + 1}`];
    updateBlock(selected.id, { options: newOptions });
  }

  function removeOption(index) {
    const newOptions = selected.options.filter((_, i) => i !== index);
    updateBlock(selected.id, { options: newOptions });
  }

  return (
    <div style={{ width: 250, borderLeft: '1px solid #ccc', padding: 10 }}>
      <h3>Edit {selected.type}</h3>

      {selected.type === 'heading' && (
        <input
          name="text"
          value={selected.text}
          onChange={handleChange}
          placeholder="Heading text"
        />
      )}

      {selected.type === 'question' && (
        <>
          <input
            name="label"
            value={selected.label}
            onChange={handleChange}
            placeholder="Question label"
            style={{ marginBottom: 10 }}
          />

          <div>
            <strong>Options:</strong>
            {(selected.options || []).map((opt, i) => (
              <div key={i} style={{ display: 'flex', marginBottom: 5 }}>
                <input
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  style={{ flex: 1 }}
                />
                <button onClick={() => removeOption(i)} style={{ marginLeft: 5 }}>
                  ✕
                </button>
              </div>
            ))}
            <button onClick={addOption}>+ Add Option</button>
          </div>
        </>
      )}

      {selected.type === 'button' && (
        <input
          name="label"
          value={selected.label}
          onChange={handleChange}
          placeholder="Button label"
        />
      )}

      {selected.type === 'footer' && (
        <textarea
          name="text"
          value={selected.text}
          onChange={handleChange}
          placeholder="Footer text"
        />
      )}
    </div>
  );
}