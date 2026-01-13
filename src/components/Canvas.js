import React, { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';

export default function Canvas({ blocks, setBlocks, onSelect, selectedId }) {
  const [, drop] = useDrop(() => ({
    accept: 'BLOCK',
    drop: (item) => {
      if (item.type) {
        const newBlock = createBlock(item.type);
        setBlocks([...blocks, newBlock]);
      }
    }
  }));


  function moveBlock(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    const updated = [...blocks];
    const [removed] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, removed);
    setBlocks(updated);
  }


  function deleteBlock(id) {
    setBlocks(blocks.filter(b => b.id !== id));
  }

  return (
    <div
      ref={drop}
      style={{
        flex: 1,
        padding: 10,
        minHeight: 300,
        border: '1px dashed #aaa',
        background: '#fafafa'
      }}
    >
      {blocks.map((block, idx) => (
        <CanvasBlock
          key={block.id}
          block={block}
          index={idx}
          blocks={blocks}
          moveBlock={moveBlock}
          onSelect={onSelect}
          deleteBlock={deleteBlock}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
}

function CanvasBlock({ block, index, blocks, moveBlock, onSelect, deleteBlock, selectedId }) {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BLOCK',
    item: { id: block.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }));

  const [, drop] = useDrop(() => ({
    accept: 'BLOCK',
    hover: (item, monitor) => {
      const dragId = item.id;
      const dragIndex = blocks.findIndex(b => b.id === dragId);
      const hoverIndex = index;

      if (dragIndex === -1 || hoverIndex === -1 || dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveBlock(dragIndex, hoverIndex);
    }
  }));

  const isSelected = selectedId === block.id;

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={() => onSelect(block.id)}
      style={{
        padding: 10,
        margin: 6,
        background: isSelected ? '#e6f0ff' : isDragging ? '#eee' : '#fff',
        border: isSelected ? '2px solid #007bff' : '1px solid #ccc',
        borderRadius: 4,
        cursor: 'grab',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: isDragging ? '0 2px 6px rgba(0,0,0,0.15)' : 'none'
      }}
    >
      <div>
        <strong>{block.type}</strong>
        {block.type === 'heading' && <div>{block.text}</div>}
        {block.type === 'question' && (
          <div>
            <div>{block.label}</div>
            <ul style={{ margin: '4px 0 0 12px', padding: 0 }}>
              {block.options.map((opt, i) => (
                <li key={i} style={{ fontSize: '0.9em', color: '#555' }}>
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}
        {block.type === 'button' && <div>{block.label}</div>}
        {block.type === 'footer' && (
          <div style={{ fontSize: '0.8em', color: '#666' }}>{block.text}</div>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteBlock(block.id);
        }}
        style={{
          marginLeft: 10,
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          padding: '4px 8px',
          cursor: 'pointer'
        }}
      >
        ✕
      </button>
    </div>
  );
}

function createBlock(type) {
  const id = crypto.randomUUID();
  switch (type) {
    case 'heading':
      return { id, type, text: 'New Heading' };
    case 'question':
      return { id, type, label: 'New Question', kind: 'single', options: ['Option 1'] };
    case 'button':
      return { id, type, label: 'Next', variant: 'next' };
    case 'footer':
      return { id, type, text: 'Small footer text' };
    default:
      return { id, type };
  }
}