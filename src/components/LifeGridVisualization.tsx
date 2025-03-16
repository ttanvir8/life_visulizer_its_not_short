import React, { useState } from 'react';

const LifeGridVisualization = () => {
  const [birthYear, setBirthYear] = useState(1999);
  const [birthMonth, setBirthMonth] = useState(8);
  const [showConfig, setShowConfig] = useState(false);
  const [currentDate] = useState(new Date());
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{year: number; month: number; x: number; y: number} | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');
  const [editingCell, setEditingCell] = useState<{year: number; month: number} | null>(null);
  
  const YEARS_IN_GRID = 72;
  const MONTHS_PER_ROW = 36;
  
  const calculateFilledCells = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    let yearsDiff = currentYear - birthYear;
    let monthsDiff = currentMonth - (birthMonth - 1);
    
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }
    
    return (yearsDiff * 12) + monthsDiff + 1;
  };
  
  const filledCells = calculateFilledCells();
  
  const handleMouseOver = (e: React.MouseEvent, cellYear: number, cellMonth: number) => {
    setTooltipText(`Age: ${cellYear} years, ${cellMonth + 1} month${cellMonth === 0 ? '' : 's'}`);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };
  
  const handleMouseOut = () => {
    setShowTooltip(false);
  };

  const handleCellClick = (e: React.MouseEvent, cellYear: number, cellMonth: number) => {
    e.stopPropagation();
    setSelectedCell({
      year: cellYear,
      month: cellMonth,
      x: e.clientX,
      y: e.clientY
    });
    setIsEditingDescription(true);
    setEditingCell({ year: cellYear, month: cellMonth });
    setDescriptionText('');
  };

  const handleDocumentClick = () => {
    setSelectedCell(null);
    setIsEditingDescription(false);
  };

  const formatCellDate = (year: number, month: number) => {
    // Calculate the actual calendar date based on birth year and month
    const actualYear = Math.floor(birthYear + year);
    let actualMonth = (birthMonth - 1 + month) % 12;
    
    if (actualMonth < 0) {
      actualMonth += 12;
    }
    
    const monthName = new Date(2000, actualMonth).toLocaleString('default', { month: 'long' });
    return `${monthName} ${actualYear}, ${year} years ${month + 1} month${month === 0 ? '' : 's'}`;
  };
  
  const renderGrid = () => {
    const grid = [];
    const totalCells = YEARS_IN_GRID * 12;
    const rowCount = Math.ceil(totalCells / MONTHS_PER_ROW);
    
    for (let row = 0; row < rowCount; row++) {
      const rowCells = [];
      
      for (let col = 0; col < MONTHS_PER_ROW; col++) {
        const cellIndex = row * MONTHS_PER_ROW + col;
        
        if (cellIndex < totalCells) {
          const cellYear = Math.floor(cellIndex / 12);
          const cellMonth = cellIndex % 12;
          const isFilled = cellIndex < filledCells;
          const isSelected = selectedCell?.year === cellYear && selectedCell?.month === cellMonth;
          
          rowCells.push(
            <div
              key={`${row}-${col}`}
              className={`w-4 h-4 m-px border ${
                isSelected ? 'bg-indigo-700 border-indigo-800 shadow-md ring-2 ring-indigo-300' :
                isFilled ? 'bg-indigo-500 border-indigo-600 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'
              } rounded-sm transition-colors duration-200 cursor-pointer`}
              onMouseOver={(e) => handleMouseOver(e, cellYear, cellMonth)}
              onMouseOut={handleMouseOut}
              onClick={(e) => handleCellClick(e, cellYear, cellMonth)}
              title={`${cellYear} years, ${cellMonth + 1} month${cellMonth === 0 ? '' : 's'}`}
            />
          );
        }
      }
      
      grid.push(
        <div key={row} className="flex items-center mb-[2px]">
          <div className="w-12 flex items-center justify-end pr-2 text-xs font-medium text-gray-600">
            {row * 3}
          </div>
          <div className="flex">{rowCells}</div>
        </div>
      );
    }
    
    return grid;
  };
  
  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfig(false);
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto relative min-h-screen bg-gradient-to-b from-white to-gray-50" onClick={handleDocumentClick}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Life Grid Visualization</h1>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 shadow-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Configure
          </button>
        </div>
        
        {/* Description text */}
        <div className="mb-8 bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-sm text-gray-700">
          <p>This visualization represents your life as a grid of months. Each small square represents one month, with blue squares showing months you've already lived. The grid extends to 72 years (assuming an average lifespan).</p>
        </div>
        
        {/* Configuration Panel - with transition */}
        <div 
          className={`mb-6 overflow-hidden transition-all duration-300 ease-in-out ${
            showConfig ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-5 border rounded-lg bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Configure Your Timeline</h2>
            <form onSubmit={handleConfigSubmit} className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Year
                </label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="1900"
                  max={currentDate.getFullYear()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Month
                </label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Grid */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="overflow-x-auto">
            <div className="mb-4 inline-block min-w-max">
              <div className="flex mb-2">
                <div className="w-12"></div>
                <div className="flex">
                  {Array.from({ length: MONTHS_PER_ROW }, (_, i) => (
                    <div key={i} className="w-4 mx-px text-center text-xs font-medium text-gray-600">
                      {(i % 12) + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid-container">{renderGrid()}</div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
            <div className="flex flex-wrap gap-y-2">
              <div className="mr-6 flex items-center">
                <span className="inline-block w-4 h-4 bg-indigo-500 border border-indigo-600 rounded-sm mr-2 shadow-sm"></span>
                <span className="text-sm text-gray-700">Months lived: <strong>{filledCells}</strong></span>
              </div>
              <div className="mr-6 flex items-center">
                <span className="inline-block w-4 h-4 bg-white border border-gray-200 rounded-sm mr-2"></span>
                <span className="text-sm text-gray-700">Months remaining: <strong>{(YEARS_IN_GRID * 12) - filledCells}</strong></span>
              </div>
              <div className="flex-1 flex items-center">
                <span className="text-sm text-gray-700">Current age: <strong>{Math.floor(filledCells / 12)} years and {filledCells % 12} month{filledCells % 12 !== 1 ? 's' : ''}</strong></span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Life is precious. Make every month count.</p>
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip && !selectedCell && (
        <div 
          className="absolute px-2 py-1 bg-gray-800 text-white text-xs rounded-md z-50 pointer-events-none shadow-lg"
          style={{ 
            left: `${tooltipPosition.x}px`, 
            top: `${tooltipPosition.y - 30}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltipText}
        </div>
      )}

      {/* Description Input Popup */}
      {isEditingDescription && editingCell && (
        <div
          className="absolute px-4 py-3 bg-white border border-gray-200 text-gray-800 rounded-md z-50 shadow-lg"
          style={{
            left: `${selectedCell?.x}px`, // Use selectedCell?.x to ensure it's not null
            top: `${selectedCell?.y}px`, // Use selectedCell?.y to ensure it's not null
            transform: 'translate(-80%, 10%)',
            minWidth: '300px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-medium text-indigo-600 mb-2">
            {formatCellDate(editingCell.year, editingCell.month)}
          </h3>
          <textarea
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
            placeholder="Enter description here (markdown supported)"
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-3"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditingDescription(false)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Save descriptionText for the cell (editingCell)
                setIsEditingDescription(false);
                alert('Description saved (not actually saved yet!)'); // Placeholder for save action
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifeGridVisualization; 