import React from 'react';
import { useDrag } from 'react-dnd';

const blockTypes = ['heading', 'question', 'button', 'footer'];

export default function BlockPalette() {
  return (
    <div style={{ padding: 10, borderRight: '1px solid #ccc' }}>
      <h3>Blocks</h3>
      {blockTypes.map(type => <PaletteItem key={type} type={type} />)}
    </div>
  );
}

function PaletteItem({ type }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BLOCK',
    item: { type },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  }));

  return (
    <div ref={drag} style={{
      padding: 8,
      margin: 4,
      background: isDragging ? '#ddd' : '#eee',
      cursor: 'grab'
    }}>
      {type}
    </div>
  );
}