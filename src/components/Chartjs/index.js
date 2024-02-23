import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import Button from "@mui/material/Button";
import {
  Grid,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { spacing } from "@mui/system";
import Table1 from "./Table1";
import DataGrids from "./DataGrids";
import Linechart from "./LineChart"; 
import LinechartAge from "./LineChartAge";
import BarsChart from "./BarsChart";
import BarChart1 from "./BarChart";
import BarChartRecivedScout from "./BarChartRecivedScout";
import { API } from "aws-amplify";
import PieChart2 from "./PieChart"
import PieChartAge from "./PieChartAge"; 
import PieChartResume from "./PieChartResume";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { set } from "date-fns";
import PieChartJobChange from "./PieChartJobChange";

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

function getParam(paramName) {
  const queryString = window.location.search;
  const queryParameters = new URLSearchParams(queryString);
  const paramValue = queryParameters.get(paramName);
  return paramValue;
}

async function fetchDataFromLambda(table_name, company_id, companyIdValue, mediaIdValue) {
  try {
    const apiResponse_all = await API.get(
        "createpdfapi",
        "/fetchItems2",
        {
            queryStringParameters: {
                table_name: table_name, // 例: テーブル名
                column_name: company_id, // 例: カラム名
                column_name2: 'media_id', // 例: カラム名
                column_id: companyIdValue, // 例: カラムID
                media_id: mediaIdValue,  // 例: エージェントID
            }
        }
    );

    //console.log('apiResponse_all_entries', apiResponse_all);
    const encoded_text = apiResponse_all.body;
    const parsedDataall = [];
    // JSON パースを行う
    const parsedData = JSON.parse(encoded_text);
    for (let i = 0; i < parsedData.data.length; i++) {
      parsedData.data[i][6] = new Date(parsedData.data[i][6]);
      parsedDataall.push(parsedData.data[i]); 
    }
    return parsedDataall;
  } catch (error) {
    const parsedData = [
      [0, 0, 0, 0, 0, "2023-12-23 18:08:28", "2024-01-13T15:40:08.000Z", "2024-01-14 00:40:08", 0],
      [0, 0, 0, 0, 0, "2023-12-19 07:55:29", "2024-01-13T15:40:08.000Z", "2024-01-14 00:40:08", 0],
    ]
      // エラー処理
      console.error("API エラー:", error);

      return parsedData
  }
}

async function fetchJobSeekerDataFromLambda2(table_name, column_name, column_id) {
  try {
    // Lambda 関数の呼び出し
    const apiResponse_all2 = await API.get("createpdfapi", "/fetchItems2", {
      queryStringParameters: {
        table_name: table_name,
        column_name: column_name,
        column_id: column_id,
      },
    });
    return apiResponse_all2[0];
  } catch (error) {
    console.error("API エラー:", error);
    // エラーが発生した場合の処理
  }
}

function ChartJs() {
  const [dateFrom, setDateFrom] = useState(""); //日付の初期値を空にする
  const [dateTo, setDateTo] = useState(""); //日付の初期値を空にする
  const [allrows, setAllRows] = useState([]); //全ての行を格納する配列
  const [selectRows, setSelectRows] = useState([]); 
  const [showallTable, setShowallTable] = useState(false); 
  const [paramNameValue, setParamNameValue ] =useState("");
  const [data, setData ] =useState([]);
  const [userId, setUserid ] =useState([]);
  const [jobseekerdata, setjobseekerdata ] =useState([]); //Scout_historyに乗っているjobseeker_id_in_mediaのみを格納する配列
  const [allJobseekerdata, setAllJobseekerdata ] =useState([]); //全ての行を格納する配列
  const [entries, setEntries] = useState([]);
  const [calculateResult, setCalculateResult] = useState([]);
  const [resumeUpdateHistoryData, setResumeUpdateHistoryData] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // パラメータ名に応じて変更
  const companyIdValue = queryParams.get("company_id"); // パラメータ名に応じて変更
  const mediaIdValue = queryParams.get("media_id");


  useEffect(() => {
    const fetchData = async () => {
      const table_name = 'scout_history';
      const paramNameValue2 = 'company_id'
      const datas = await fetchDataFromLambda(table_name, paramNameValue2, companyIdValue, mediaIdValue);

      const company_name = await fetchJobSeekerDataFromLambda2('companies', 'id', companyIdValue);
      setCompanyName(company_name);
      const media_name = await fetchJobSeekerDataFromLambda2('medias', 'id', mediaIdValue);
      setMediaName(media_name);
      
      const formattedData = datas.map((item) => {
        const dtObject = new Date(item[6]);
        const day = dtObject.getDay();
        const time = new Date(item[6]).getHours();
        return {
              media_id: item[1],
              company_id: item[2],
              jobseeker_id_in_media: item[3],
              job_id_in_media: item[4],
              message_id_in_media: item[5],
              scout_type: item.scout_type,
              scout_send_datetime: item[6],
              date: day,
              time: time,
              
              readed: item[7],
              readed_time: item[8],
              create_datetime: item[9],
              update_datetime: item[10],
              last_message_body: item[11],
              message_send_num: item[12],
              scout_template_subject: item[13],
        };
      });
      // ここで日付がセットされていればフィルタリングを行う
      if (startDate !== "" && endDate !== "") {
        const filteredData = formattedData.filter((item) => {
          const dtObject = new Date(item.scout_send_datetime);
          const dtObject2 = new Date(startDate);
          const dtObject3 = new Date(endDate);
          return dtObject >= dtObject2 && dtObject <= dtObject3;
        });
        await setData(filteredData);
      } else if (startDate !== "" && endDate === "") {
        const filteredData = formattedData.filter((item) => {
          const dtObject = new Date(item.scout_send_datetime);
          const dtObject2 = new Date(startDate);
          return dtObject >= dtObject2;
        });
        await setData(filteredData);
      } else if (startDate === "" && endDate !== "") {
        const filteredData = formattedData.filter((item) => {
          const dtObject = new Date(item.scout_send_datetime);
          const dtObject3 = new Date(endDate);
          return dtObject <= dtObject3;
        });
        await setData(filteredData);
      } else {
        // 指定がなければそのままのデータをセット
        await setData(formattedData);
      }
      const jobseeker_data = await fetchDataFromLambda('job_seekers', 'company_id', companyIdValue, mediaIdValue);
 
        await setAllJobseekerdata(jobseeker_data);
      //}
      //entriesテーブルからデータを取得する
      const entries = await fetchDataFromLambda('entries', 'company_id', companyIdValue, mediaIdValue);   
      //console.log('entries', entries);  
      // 日付が指定されていればフィルタリングを行う
      if (startDate !== "" && endDate !== "") {
        const filteredEntries = entries.filter((item) => {
          const dtObject = new Date(item[6]);
          const dtObject2 = new Date(startDate);
          const dtObject3 = new Date(endDate);
          return dtObject >= dtObject2 && dtObject <= dtObject3;
        });
        await setEntries(filteredEntries);
      } else if (startDate !== "" && endDate === "") {
        const filteredEntries = entries.filter((item) => {
          const dtObject = new Date(item[6]);
          const dtObject2 = new Date(startDate);
          return dtObject >= dtObject2;
        });
        await setEntries(filteredEntries);
      } else if (startDate === "" && endDate !== "") {
        const filteredEntries = entries.filter((item) => {
          const dtObject = new Date(item[6]);
          const dtObject3 = new Date(endDate);
          return dtObject <= dtObject3;
        });
        await setEntries(filteredEntries);
      } else {
        // 指定がなければそのままのデータをセット
        await setEntries(entries);
      }
      //console.log('entries', entries);
      // application_calculate_resultテーブルからデータを取得する
      const calculate_result = await fetchDataFromLambda('application_calculate_result', 'company_id', companyIdValue, mediaIdValue);
      // 日付の指定があればフィルタリングを行う
      if (startDate !== "" && endDate !== "") {
        const filteredCalculateResult = calculate_result.filter((item) => {
          const dtObject = new Date(item[1]);
          const dtObject2 = new Date(startDate);
          const dtObject3 = new Date(endDate);
          return dtObject >= dtObject2 && dtObject <= dtObject3;
        });
        await setCalculateResult(filteredCalculateResult);
      }
      else if (startDate !== "" && endDate === "") {
        const filteredCalculateResult = calculate_result.filter((item) => {
          const dtObject = new Date(item[1]);
          const dtObject2 = new Date(startDate);
          return dtObject >= dtObject2;
        });
        await setCalculateResult(filteredCalculateResult);
      }
      else if (startDate === "" && endDate !== "") {
        const filteredCalculateResult = calculate_result.filter((item) => {
          const dtObject = new Date(item[1]);
          const dtObject3 = new Date(endDate);
          return dtObject <= dtObject3;
        });
        await setCalculateResult(filteredCalculateResult);
      } else {
        // 指定がなければそのままのデータをセット
        await setCalculateResult(calculate_result);
      }
      const resume_update_history_data = await fetchDataFromLambda('resume_update_history', 'company_id', companyIdValue, mediaIdValue);
      // ここでとってきたデータをstartDate,endDateがあればその日程でフィルタリングする,startDateのみ指定の場合はendDateは現在の日付でフィルタリングstartがなければstartは最初の日付でフィルタリング
      if (startDate !== "" && endDate !== "") {
        const filteredData = resume_update_history_data.filter((item) => {
          const dtObject = new Date(item[6]);
          const dtObject2 = new Date(startDate);
          const dtObject3 = new Date(endDate);
          return dtObject >= dtObject2 && dtObject <= dtObject3;
        });
        await setResumeUpdateHistoryData(filteredData);
      } else if (startDate !== "" && endDate === "") {
        const filteredData = resume_update_history_data.filter((item) => {
          const dtObject = new Date(item[6]);
          const dtObject2 = new Date(startDate);
          return dtObject >= dtObject2;
        });
        await setResumeUpdateHistoryData(filteredData);
      } else if (startDate === "" && endDate !== "") {
        const filteredData = resume_update_history_data.filter((item) => {
          const dtObject = new Date(item[6]);
          const dtObject3 = new Date(endDate);
          return dtObject <= dtObject3;
        });
        await setResumeUpdateHistoryData(filteredData);
      } else {
        // 指定がなければそのままのデータをセット
        await setResumeUpdateHistoryData(resume_update_history_data);
      }      
    };
    fetchData().catch((error) => {
      console.error("An error occurred: " + error);
      setSelectRows([]); // エラー時は空の配列をセット
    });
  }, [paramNameValue, companyIdValue, mediaIdValue, startDate, endDate]);
  
  const inputDateFromChange = (newValue) => {
    setDateFrom(newValue);
  };

  const inputDateToChange = (newValue) => {
    setDateTo(newValue);
  };

  const handleSearchClick = () => {
    const startDate = dateFrom;
    const endDate = dateTo;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const printDocument = () => {
    setShowallTable(true); 
    const searchButton = document.getElementById('searchButton');
    const pdfButton = document.getElementById('pdfButton');
  
    // ボタンを非表示にする
    searchButton.style.visibility = 'hidden';
    pdfButton.style.visibility = 'hidden';
  
    const input = document.getElementById("test");
    // 引数に渡したElementがCanvasElementに描画されて返される
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = canvas.width * 0.8;
      const pdfHeight = canvas.height * 0.8;
      const media_name = mediaName[1];
      const company_name = companyName[1];
      const pdfName = media_name + '_' + company_name;
  
      const pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, "PNG", 20, 20);
      pdf.save(pdfName + '.pdf');
  
      // ボタンを再表示する
      searchButton.style.visibility = 'visible';
      pdfButton.style.visibility = 'visible';
    });
    setShowallTable(false);
  };

  const buttonStyle = {
    borderRadius: '5px', // 角丸にするための値
    backgroundColor: 'orange', 
    color: 'white', // 文字色
    padding: '5px 20px', // 上下左右の余白
    border: 'none', // ボーダーをなくす
    cursor: 'pointer', // マウスカーソルをポインターに変更
    marginLeft: '20px', // ボタンを左寄せに配置
  };

  return (
  <div className="App1" id="test">
    <React.Fragment>
      <Helmet title="Chart.js" />
      <Typography variant="h3" gutterBottom display="inline">
        {companyName && <><div>会社名: {companyName[1]}</div>
         <div style={{paddingTop: 10}}>媒体名: {mediaName[1]}</div></>}
      </Typography>
      <p><strong>集計結果</strong></p>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
      </Breadcrumbs>
      <Grid item xs={8}>
        <Grid container justifyContent="flex-end" alignItems="left" spacing={1}>
          <Grid item xs={3} sm={6} md={4} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div className="text-gray-500 text-xs">
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full padding-13.5"
                type="datetime-local"
                value={dateFrom}
                onChange={(event) => inputDateFromChange(event.target.value)}
              />
            </div>
            <div className="text-gray-500 text-xs">
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 p-3.5"
                type="datetime-local"
                value={dateTo}
                onChange={(event) => inputDateToChange(event.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={10} sm={6} md={4}>
            <Button id="searchButton" variant="contained" color="primary" onClick={handleSearchClick}>
              絞込み
            </Button>
            <button id="pdfButton" onClick={printDocument} style={buttonStyle} >PDFを出力する</button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
          </Grid>
        </Grid>
      </Grid>
      <Divider my={6} />
      <>
      <Grid item xs={12} md={8} sm={10}>
        スカウト文章集計結果
          {/* Tableコンポーネントを２つ表示 */}
            <div style={{ paddingTop: 20 }} >
          <div className="flex-container">
            <div className="flex-item">
            
            <div style={{paddingTop: 30}}>
              <div>
              <Table1 data={data} />
              </div>
            </div>
            <div style={{display: 'flex', paddingTop: 50, paddingLeft: 20, width: 1000, height: 500}}>
              <div >
              <Linechart 
                scout_history_data ={data} 
                data={allJobseekerdata} 
                entries_data={entries}/>
              </div>
              <div >
              <LinechartAge 
                scout_history_data ={data} 
                data={allJobseekerdata} 
                entries_data={entries}/>
              </div> 
            </div> 
            <div style={{display: 'flex', paddingLeft: 30}}>
              <div>
              <BarChart1 entries_data={entries} jobseeker_data={allJobseekerdata}/>
              </div>
              <div>
              <BarChartRecivedScout scout_history_data={data} entries_data={entries} calculate_result={calculateResult}/> 
              </div>
            </div>
            <div style={{ paddingTop: 100, paddingRight: 100}}>
              <div style={{paddingLeft: 30}}>
              <PieChart2 
                jobseeker_data={allJobseekerdata} 
                entries_data={entries}
              />
              </div>
              <div style={{paddingLeft: 10}}>
              <PieChartAge 
                jobseeker_data={allJobseekerdata} 
                entries_data={entries}
              />
              </div>
              <div style={{paddingTop: 100, paddingLeft: 10}}>
                <PieChartResume 
                  resume_update_history_data={resumeUpdateHistoryData} 
                  entries_data={entries}
                />
              </div>  
              <div style={{paddingTop: 100, paddingLeft: 100}}>
                <PieChartJobChange
                  jobseeker_data={allJobseekerdata}
                  entries_data={entries}
                />
             </div>    
            </div>
          </div>
          </div>
          </div>
        </Grid>
        </>
      
    </React.Fragment>
    </div>
  );
}

export default ChartJs;
