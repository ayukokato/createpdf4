import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Text, Cell, Line } from 'recharts';
import { parseISO } from 'date-fns';
import { set } from 'date-fns';
import { ca } from 'date-fns/locale';

const PieChartResume = ({ resume_update_history_data, entries_data }) => {
  const [concatData, setConcatData] = useState([]);
  const [data1, setData1] = useState([]);
  const [value, setValue] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'];

  const label = ({ name, value, cx, x, y }) => {
    if (parseFloat(value) <= 0) {
        return null;
      }
      const value1 = value + '%'
      const textAnchor = x > cx ? 'start' : 'end';
    return (
      <>
        <Text x={textAnchor === 'start' ? x + 35 : x - 35} y={y} textAnchor={textAnchor} fill="#000000" fontSize={"30"}>
          {name}
        </Text>
        <Text
          x={textAnchor === 'start' ? x + 125 : x - 125}
          y={y + 30}
          dominantBaseline="hanging"
          textAnchor={textAnchor}
          fill="#000000"
          fontSize={"30"}
        >
          {value1}
        </Text>
      </>
    );
  };

  const calculateDate = (date_entry, date_resume_update) => {
    // この処理は、date_entryとdate_resume_updateの日付の差を求める処理
    const date1 = new Date(date_entry);
    const date2 = new Date(date_resume_update);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  useEffect(() => {
    // entryとresume_update_historyのデータを結合
    const updatedConcatData = entries_data.map(history => {
        const matchingJobSeekerData = resume_update_history_data.find(resume_update_history_data => history[3] === resume_update_history_data[3]);
  
        return matchingJobSeekerData
          ? { ...history, ...matchingJobSeekerData }
          : null;
      }).filter(updatedData => updatedData !== null);

    setConcatData(updatedConcatData);
    const calculated_data = updatedConcatData.map((item) => calculateDate(item[5], item[4]));
    setCalculatedData(calculated_data);

    const dateRanges = [
      { label: '0日〜4日未満', min: 0, max: 3 },
      { label: '4日間〜1週間未満', min: 4, max: 6 },
      { label: '1週間〜2週間未満', min: 7, max: 13 },
      { label: '2週間〜1ヶ月未満', min: 14, max: 30 },
      { label: '1ヶ月〜2ヶ月未満', min: 31, max: 61 },
      { label: '2ヶ月以上', min: 62, max: Infinity },
    ];

    const dateData = dateRanges.map((range) => ({
      ...range,
      entries: calculated_data.filter(
        (item) => item >= range.min && item <= range.max
      ),
    }));

    const updatedData1 = dateData
    .map((range) => {
      const percentage = (range.entries.length / updatedConcatData.length) * 100;
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

    /*const updatedValue = updatedData1.map((range) => range.value);
    setValue(updatedValue);*/

  }, [resume_update_history_data, entries_data]);

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
            <th style={{ border: '1px solid black', padding: '5px' }}>日数</th>
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
      <div style={{paddingBottom: 10, fontSize: 20}}>応募者の会員レジュメを更新してからの応募日程の割合</div>
        <PieChart style={{paddingTop: 50}} width={1830} height={750}>
          <Pie
            data={data1}
            dataKey="value"
            cx="35%"
            cy="35%"
            outerRadius={295}
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
        <div style={{paddingBottom: 50}}>
        <TableData data={data1} />
      </div>
    </div>
    </>
  );
};

export default PieChartResume;
