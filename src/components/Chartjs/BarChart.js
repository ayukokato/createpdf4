import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart1 = ({ entries_data, jobseeker_data }) => {
  const [concatData, setConcatData] = useState([]);
  //応募した人それぞれ何件スカウトを受けたのかscouthistoryから抽出

  useEffect(() => {

    const updatedConcatEntryData = entries_data
      .filter((entry) => 
        jobseeker_data.some((jobSeeker) => entry[3] === jobSeeker[4])
      )
      .map((entry) => ({
        ...entry,
        ...jobseeker_data.find((jobSeeker) => entry[3] === jobSeeker[4]),
      }))
      .filter((item) => item[11] !== null);

    setConcatData(updatedConcatEntryData);
    console.log('updatedConcatEntryData<><><><>><><><>>', updatedConcatEntryData);
    
  }, [entries_data, jobseeker_data]);

  const sendNumRange = [
            { label: '1社〜4社', min: 1, max: 4 },
            { label: '5社〜9社', min: 5, max: 9 },
            { label: '10社〜14社', min: 10, max: 14 },
            { label: '15社〜19社', min: 15, max: 19 },
            { label: '20社〜24社', min: 20, max: 24 },
            { label: '25社〜29社', min: 25, max: 29 },
            { label: '30社〜34社', min: 30, max: 34 },
            { label: '35社〜39社', min: 35, max: 39 },
            { label: '40社〜44社', min: 40, max: 44 },
            { label: '45社〜49社', min: 45, max: 49 },
            { label: '50社〜54社', min: 50, max: 54 },
            { label: '55社〜59社', min: 55, max: 59 },
            { label: '60社〜64社', min: 60, max: 64 },
            { label: '65社〜70社', min: 65, max: 70 },
            { label: '70社以上', min: 71, max: Infinity },
  ];

  const sendNumRangeCount = sendNumRange.map(range => ({
    label: range.label,
    count: concatData.filter(item => item[17] >= range.min && item[17] <= range.max).length,
  }));

  console.log('*************************', sendNumRangeCount);

  //const formattedData = ["01:00", "00:30", "01:11", "00:45", "01:00", "00:30", "01:11", "00:45", "01:00", "00:30", "00:30", "01:11", "00:45", "12:30", "10:50"];

  const graphData = {
    labels: sendNumRange.map(rangeCount => rangeCount.label),
    datasets: [
      {
        data: sendNumRangeCount.map(rangeCount => rangeCount.count),
        label: '直近のスカウト受信社数',
      },
    ],
  };

  const option = {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: false,
    scales: {
      x: {
        // x軸を1から始める
        title: {
          display: true,
          text: '人数（人）',
        },
      ticks: {
        stepSize: 1, // ここでステップサイズを設定
      },
      },
    },
  };

  return (
    <div className="App">
      <Bar 
        data={graphData}
        options={option} 
        width={600} 
        height={400} 
        responsive={true} 
        />
    </div>
  );
}

export default BarChart1;