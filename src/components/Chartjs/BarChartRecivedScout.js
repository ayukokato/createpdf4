import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const BarChartRecivedScout = ({ scout_history_data, entries_data }) => {
  const [uniqueEntriesData, setUniqueEntriesData] = useState([]);

  useEffect(() => {
    // entries_data のうち、jobseeker_id_in_media が一意のものを抽出
    const uniqueEntriesData1 = scout_history_data.filter((x, i, self) => self.findIndex(y => y.jobseeker_id_in_media === x.jobseeker_id_in_media) === i);
    //setUniqueEntriesData(uniqueEntriesData1);
    // すべてのuniqueEntriesData1.jobseeker_id_in_mediaがscout_history_data.jobseeker_id_in_mediaに何個あるのかそれぞれ計算
    const uniqueEntriesData2 = uniqueEntriesData1.map((entry) => {
        const count = scout_history_data.filter((item) => entry.jobseeker_id_in_media === item.jobseeker_id_in_media).length;
        return { ...entry, count };
        });
        
    setUniqueEntriesData(uniqueEntriesData2);
}, [scout_history_data, entries_data]);

    const sendNumRange = [
                {label: '1回〜4回', min: 1, max: 4 },
                {label: '5回〜9回', min: 5, max: 9},
                {label: '10回〜14回', min: 10, max: 14},
                {label: '15回〜19回', min: 15, max: 19},
                {label: '20回〜24回', min: 20, max: 24},
                {label: '25回〜29回', min: 25, max: 29},
                {label: '30回〜34回', min: 30, max: 34},
                {label: '35回〜39回', min: 35, max: 39},
                {label: '40回〜44回', min: 40, max: 44},
                {label: '45回〜49回', min: 45, max: 49},
                {label: '50回〜54回', min: 50, max: 54},
                {label: '55回〜59回', min: 55, max: 59},
                {label: '60回〜64回', min: 60, max: 64},
                {label: '65回〜70回', min: 65, max: 70},
                {label: '70回以上', min: 71, max: Infinity},
    ]; 
    
    const sendNumRangeCount = sendNumRange.map((range) => ({
        label: range.label,
        count: uniqueEntriesData.filter((item) => item.count >= range.min && item.count <= range.max).length,
    }));
    
    console.log('**n***********************', sendNumRangeCount);

    const graphData = {
        labels: sendNumRange.map((range) => range.label),
        datasets: [
        {
            data: sendNumRangeCount.map((entry) => entry.count),
            label: '応募に至るまでのスカウト受信回数',
        },
        ],
    };
  

  const option = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    responsive: false,
    scales: {
      x: {
        beginAtZero: true, // x軸を0から始める
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
      <Bar data={graphData} options={option} width={600} height={400} responsive={true} />
    </div>
  );
};

export default BarChartRecivedScout;