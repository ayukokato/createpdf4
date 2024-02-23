import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { set } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChartAge({ scout_history_data, data, entries_data }) {
  const [concatData, setConcatData] = useState([]);
  const [concatEntryData, setConcatEntryData] = useState([]);
  const [salaryData, setSalaryData] = useState(getInitialSalaryData());
  const [readeddata, setReadedData] = useState([]);
  const [entrydata, setEntryData] = useState([]);

  const options = {
    responsive: true,
    style: {
      strokewidth: 5,
      strokeheight: 5
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '年収ごとの既読率と応募率',
      },
    },
  };

  const labels = [
    '19歳以下',
    '20歳~24歳',
    '25歳~29歳',
    '30歳~34歳',
    '35歳~39歳',
    '40歳~44歳',
    '45歳~49歳',
    '50歳~54歳',
    '55歳~59歳',
    '60歳以上',
  ];

  useEffect(() => {
    const updatedConcatEntryData = data.map(jobseeker => {
      const matchingEntry = entries_data.find(entry => jobseeker[4] === entry[3]);
    
      if (matchingEntry) {
        // jobseeker と matchingEntry を別々のプロパティにネストして結合
        return { jobseeker, matchingEntry };
      } else {
        return undefined;
      }
    }).filter(item => item !== undefined);    
    // 一致する jobSeeker があるエントリのみ残す
    setConcatEntryData(updatedConcatEntryData);

//年収でフィルター
const salaryRanges1 = getAgeRanges();
let filteredJobseekerData = [];
let filteredData = [];
let rate = [];

for (const range of salaryRanges1) {
  filteredJobseekerData[range] = filterDataBySalaryRange(data, ...getSalaryRangeValues(range), 2);
  filteredData[range] = filterDataBySalaryRange(updatedConcatEntryData, ...getSalaryRangeValues(range), 3);
}

for (const range of salaryRanges1) {
  rate.push(filteredData[range].length/filteredJobseekerData[range].length)
}
setEntryData(rate);

const updatedConcatData = scout_history_data
  .map(history => {
    const matchingJobSeeker = data.find(jobSeeker => history.jobseeker_id_in_media == jobSeeker[4]);
    // 一致する jobSeeker が見つかった場合のみ結合
    return matchingJobSeeker ? { ...history, ...matchingJobSeeker } : undefined;
  })
  .filter(item => item !== undefined); // 一致する jobSeeker があるエントリのみ残す
  setConcatData(updatedConcatData);
  //console.log('updatedConcatData^-----', updatedConcatData);

    const salaryRanges = getAgeRanges();
    updateSalaryData(concatData, salaryRanges);
  }, [data, scout_history_data, entries_data]);

  function getInitialSalaryData() {
    return getAgeRanges().reduce((acc, range) => {
      acc[range] = { read: [], entry: [] };
      return acc;
    }, {});
  }
  
  function getAgeRanges() {
    return ['20', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60'];
  }

  function updateSalaryData(data, salaryRanges) {
    let filteredData1 = [];
    let readed = [];
    let readedData = [];
    for (const range of salaryRanges) {
      //年収でフィルター
      filteredData1[range] = filterDataBySalaryRange(data, ...getSalaryRangeValues(range));
      // 既読のものを抽出
      readed[range] = filteredData1[range].filter(item => item.readed === 1);
    }
    // 既読率を計算
    for (const range of salaryRanges){
        readedData.push(readed[range].length/filteredData1[range].length)
    }
    setReadedData(readedData);
  }

  function filterDataBySalaryRange(data, min, max, id) {
    let job_seeker_data = [];
    if(id === 3){
      for (const range of data) {
        job_seeker_data.push(range.jobseeker);
      }
      return job_seeker_data.filter(item => item[8] >= min && item[8] <= max);
    }else{
      return data.filter(item => item[8] >= min && item[8] <= max);
    }
  }

  function getSalaryRangeValues(range) {
    return range.split('-').map(Number);
  }

  function calculateRate(data,range) {
    //console.log('data計算', data.length);
    return data.length ? data[range].readed.length / data.length : 0;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: '既読率',
        data: readeddata,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '応募率',
        data: entrydata,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <>
      <Line 
        data={chartData} 
        options={options} 
        width={600}
        height={400}
        responsive={true}
      />
    </>
  );
}