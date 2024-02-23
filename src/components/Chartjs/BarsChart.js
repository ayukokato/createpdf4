import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const BarsChart = ({ id,selectRows }) => {
  const [rows, setRows] = useState({
    labels: [],
    datasets: [{ data: [], label: '' }]
  });
  //現年収、希望年収、年齢、スカウト数、開封後応募時間
  useEffect(() => {
    if (selectRows) {
      const newRows = {
        labels: [],
        datasets: [{ data: [], label: '' }]
      };
      if(id===1){
      const salary_range=['~200万円','200~300万円','400~500万円','600~700万円','800万円~']
      for (const range of salary_range) {
        newRows.labels.push(range);
      }
      }else if(id===2){
      const age_range=['~19歳','20~24歳','25~29歳','30~34歳','35~39歳','40~44歳','45~50歳','50~54歳','55~59歳','60歳~']
      for (const range of age_range) {
        newRows.labels.push(range);
      }
    }else if(id===3){
      const date_range = ['1~7日', '7~14日', '14~31日', '31~62日', '62日~']
      for (const range of date_range) {
        newRows.labels.push(range);
      }
    }else if(id===4){
      const count_range = ['1~4回','5~9回','10~14回','15~19回',	'20~24回','25~29回','30~34回','35~39回','40~44回','45~49回','50~54回','55~59回','60~64回','65~70回','70回以上']
      for (const range of count_range) {
        newRows.labels.push(range);
      }
    }
      for (let i = 0; i < selectRows.length; i++) {
        if(id===1){
        newRows.datasets[0].label='開封数'
        newRows.datasets[0].data.push();
        }else if(id===2){
          newRows.datasets[0].label='開封率'
          newRows.datasets[0].data.push();
        }else if(id===3){
          newRows.datasets[0].label='送信数'
          newRows.datasets[0].data.push();
        }else if(id===4){
          newRows.datasets[0].label='開封数'
          newRows.datasets[0].data.push();
        }else if(id===5){
        newRows.datasets[0].label='年収'
        newRows.labels.push([selectRows[i].スカウト番号]);
        newRows.datasets[0].data.push(selectRows[i].開封数);
      }else if(id===6){
        newRows.datasets[0].label='年齢'
        newRows.labels.push([selectRows[i].スカウト番号]);
        newRows.datasets[0].data.push(selectRows[i].開封数);
      }else if(id===7){
        newRows.datasets[0].label='スカウト数'
        newRows.labels.push([selectRows[i].スカウト番号]);
        newRows.datasets[0].data.push(selectRows[i].開封数);
      }else if(id===8){
        newRows.datasets[0].label='開封後応募時間'
        newRows.labels.push([selectRows[i].スカウト番号]);
        newRows.datasets[0].data.push(selectRows[i].開封数);
      }
      }
      setRows(newRows);
    }
  }, [selectRows]);

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          {rows && <Bar data={rows} />}
        </div>
      </div>
    </div>
  );
};

export default BarsChart;