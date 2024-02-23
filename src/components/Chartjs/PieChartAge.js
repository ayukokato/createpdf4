import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Text, Cell, Line } from 'recharts';
import { set } from 'date-fns';

const PieChartAge = ({ jobseeker_data, entries_data }) => {
  const [concatEntryData, setConcatEntryData] = useState([]);
  const [data1, setData1] = useState([]);
  const [value, setValue] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'];

  const label = ({ name, value, cx, x, y }) => {
    if (parseFloat(value) <= 0) {
      return null;
    }
    let value1 = value + '%';
    const textAnchor = x > cx ? 'start' : 'end';

    return (
        <>
            <Text x={textAnchor === 'start' ? x + 35 : x - 35} y={y} textAnchor={textAnchor} fill="#000000" fontSize={"20"}>
                {name}
            </Text>
            <Text
                x={textAnchor === 'start' ? x + 125 : x - 125} // nameの隣に配置
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
    // もしdataが空であれば0を入れる

    const updatedConcatEntryData = entries_data
      .filter((entry) => 
        jobseeker_data.some((jobSeeker) => entry[3] === jobSeeker[4])
      )
      .map((entry) => ({
        ...entry,
        ...jobseeker_data.find((jobSeeker) => entry[3] === jobSeeker[4]),
      }))
      .filter((item) => item[11] !== null);

    setConcatEntryData(updatedConcatEntryData);

    const salaryRanges = [
      { label: '19歳以下', min: 0, max: 19 },
      { label: '20歳~24歳以下', min: 20, max: 24 },
      { label: '25歳~29歳以下', min: 25, max: 29 },
      { label: '30歳~34歳以下', min: 30, max: 34 },
      { label: '35歳~39歳以下', min: 35, max: 39 },
      { label: '40歳~44歳以下', min: 40, max: 44 },
      { label: '45歳~49歳以下', min: 45, max: 49 },
      { label: '50歳~54歳以下', min: 50, max: 54 },
      { label: '55歳~59歳以下', min: 55, max: 59 },
      { label: '60歳以上', min: 60, max: Infinity },
    ];

    const salaryData = salaryRanges.map((range) => ({
      ...range,
      entries: updatedConcatEntryData.filter(
        (item) => item[8] >= range.min && item[8] <= range.max
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
      
    const updatedValue = updatedData1.map((range) => range.value);
    setValue(updatedValue);

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

  const TableData = ({ data }) => {
    // 0以外の最小値を計算
    const minNonZeroValue = Math.min(...data.filter(row => row.value > 0).map(row => row.value));
  
    // 最大値を計算
    const maxValue = Math.max(...data.filter(row => row.value > 0).map(row => row.value));
  
    return (
      <table style={{ marginLeft: '-150px', borderCollapse: 'collapse', width: 300, height: 500 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '5px' }}>年齢</th>
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
      <div style={{paddingBottom: '17px', fontSize: 20}}>
        会員レジュメの年齢ごとの応募の割合
        </div>
        <PieChart width={1130} height={550}>
          <Pie
            data={data1}
            dataKey="value"
            cx="35%"
            cy="45%"
            outerRadius={180}
            fill="#82ca9d"
            label={label}
            labelLine={<CustomLabelLine />}
          >{
            data1.map((entry, index) => (
            <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
            />
        ))}
        </Pie>
        </PieChart>
        <div style={{paddingTop: 50}}>
          <TableData data={data1} />
        </div>
      </div>
    </>
  );
};

export default PieChartAge;
