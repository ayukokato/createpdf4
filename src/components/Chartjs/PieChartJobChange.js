import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Text, Cell, Line } from 'recharts';
import { set } from 'date-fns';

const PieChartJobChange = ({ jobseeker_data, entries_data }) => {
  const [concatEntryData, setConcatEntryData] = useState([]);
  const [data1, setData1] = useState([]);
  const [value, setValue] = useState([]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'];

  const label = ({ name, value, cx, x, y }) => {
    if (parseFloat(value) <= 0) {
      return null;
    }
    const value1 = value + '%'
    const textAnchor = x > cx ? 'start' : 'end';
    return (
      <>
        <Text x={textAnchor === 'start' ? x + 35 : x - 35} y={y} textAnchor={textAnchor} fill="#000000" fontSize={"20"}>
          {name}
        </Text>
        <Text
          x={textAnchor === 'start' ? x + 85 : x - 85} // nameの隣に配置
          y={y+30}
          textAnchor={textAnchor}
          fill="#000000"
          fontSize={"18"}
        >
          {value1}
        </Text>
      </>
    );
  };  

  useEffect(() => {
    // 同期的にデータを処理
    const updatedConcatEntryData = entries_data
      .filter((entry) => 
        jobseeker_data.some((jobSeeker) => entry[3] === jobSeeker[4])
      )
      .map((entry) => ({
        ...entry,
        ...jobseeker_data.find((jobSeeker) => entry[3] === jobSeeker[4]),
      }))
      .filter((item) => item[10] !== null);

    setConcatEntryData(updatedConcatEntryData);
    const salaryRanges = [
      { label: '0回', min: 0, max: 0 },
      { label: '1回', min: 1, max: 1 },
      { label: '2回', min: 2, max: 2 },
      { label: '3回', min: 3, max: 3 },
      { label: '4回', min: 4, max: 4 },
      { label: '5回', min: 5, max: 5 },
      { label: '6回以上', min: 6, max: Infinity },
    ];

    const salaryData = salaryRanges.map((range) => ({
      ...range,
      entries: updatedConcatEntryData.filter(
        (item) => item[10] >= range.min && item[10] <= range.max
      ),
    }));

    const updatedData1 = salaryData
      .map((range) => {
        const percentage = (range.entries.length / updatedConcatEntryData.length) * 100;
        return {
          index: range.label,
          name: range.label,
          value: percentage > 0 ? percentage.toFixed(2) : '0',
        };
      });

      const processedData = updatedData1.map(item => ({
        ...item,
        value: parseFloat(item.value)
      }));      

    setData1(processedData);
}, [jobseeker_data, entries_data]);

const CustomLabelLine = (props) => {
  if (parseFloat(props.payload.value) <= 0) {
    // 0%の場合は何も描画しない
    return null;
  }
  // それ以外の場合は通常のラベルラインを描画
  return <Line {...props} />;
};

const SalaryDataTable = ({ data }) => {
  // 0以外の最小値を計算
  const minNonZeroValue = Math.min(...data.filter(row => row.value > 0).map(row => row.value));

  // 最大値を計算
  const maxValue = Math.max(...data.filter(row => row.value > 0).map(row => row.value));

  return (
    <table style={{ marginLeft: '-150px', borderCollapse: 'collapse', width: 300, height: 500 }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '5px' }}>転職回数</th>
          <th style={{ border: '1px solid black', padding: '5px' }}>割合 (%)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid black', padding: '5px' }}>{row.name}</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>
              <span style={{ backgroundColor: row.value === maxValue ? 'red' : row.value === minNonZeroValue ? '#B0E0E6' : 'inherit' }}>
                {row.value}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};



  return (
    <>
      <div style={{display: 'flex'}}>
        <div style={{paddingBottom: 170, fontSize: 20 }}>
          転職回数ごとの応募の割合
          </div>
        <PieChart width={1230} height={750} paddingTop={80}>
          <Pie
            data={data1}
            dataKey="value"
            cx="35%"
            cy="40%"
            outerRadius={200}
            label={label}
            labelLine={<CustomLabelLine />}
          >
          {
            data1.map((entry, index) => (
            <Cell
                fill={COLORS[index % COLORS.length]}
            />
        ))}
          </Pie>
        </PieChart>
        <div style={{paddingTop: 10, padingLeft: 300}}>
          <SalaryDataTable data={data1} />
        </div>
      </div>
    </>
  );
};

export default PieChartJobChange;
