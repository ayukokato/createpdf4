import React, { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';

const tableStyle = {
  customTable: {
    maxHeight: '1000px',
    overflow: 'none',
  },
  employee: {
    borderCollapse: 'collapse',
    width: '100%',
    border: '1px solid #ddd',
  },
  employeeCell: {
    border: '1px solid #ddd',
    padding: '12px',
  },
};

const Table1 = ({ data }) => {
  const [column, setColumn] = useState([]);
  const [rows, setRows] = useState([]);
  const name = ['月', '火', '水', '木', '金', '土', '日'];
  
  const extractDataForTimeRange = (data, day, startTime, endTime) => {
    const filteredRows = data.filter(
      (item) => item.readed === 1 && item.date === day && item.time >= startTime && item.time < endTime
    );
    const readedRate = filteredRows.length / data.length;
    //const percent = Math.round(readedRate * 100) + '%';
    return readedRate.toFixed(2);
  };

  const column2 = [
    'M-1', 'M-2', 'M-3', 'M-4', 'M-5',
    'Tu-1', 'Tu-2', 'Tu-3', 'Tu-4', 'Tu-5',
    'W-1', 'W-2', 'W-3', 'W-4', 'W-5',
    'Th-1', 'Th-2', 'Th-3', 'Th-4', 'Th-5',
    'F-1', 'F-2', 'F-3', 'F-4', 'F-5',
    'Su-1', 'Su-2', 'Su-3', 'Su-4', 'Su-5',
  ];

  useEffect(() => {
    const newRows = name.map((day, index) => {
      const rowData = {
        day,
        '0時〜9時': extractDataForTimeRange(data, index + 1, 0, 9),
        '9時〜12時': extractDataForTimeRange(data, index + 1, 9, 12),
        '12〜16時': extractDataForTimeRange(data, index + 1, 12, 16),
        '16時〜20時': extractDataForTimeRange(data, index + 1, 16, 20),
        '20時~0時': extractDataForTimeRange(data, index + 1, 20, 24),
      };
      return rowData;
    });

    setRows(newRows);
    setColumn(['曜日/時間', '0時〜9時', '9時〜12時', '12〜16時', '16時〜20時', '20時~0時']);
  }, [data]);

  return (
    <div style={tableStyle.customTable}>
      <table id='employee' style={tableStyle.employee}>
        <thead>
          <tr>
            {column && column.length > 0 && column.map((col, index) => (
              <th key={index} style={tableStyle.employeeCell}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows && rows.length > 0 && rows.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              <td style={tableStyle.employeeCell}>{rowData.day}</td>
              {column.slice(1).map((col, colIndex) => {
                // NaNチェック
                const cellValue = rowData[col];
                const isValueNaN = isNaN(cellValue);
  
                return (
                  <td key={colIndex} style={tableStyle.employeeCell}>
                    {isValueNaN ? (
                      <Skeleton style={{width: 40, height: 20}} variant="text" sx={{ fontSize: '1rem' }} />
                    ) : (
                      cellValue
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};

export default Table1;