import { useEffect,useState, React } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { Chart, registerables } from "chart.js"
import { DataGrid } from '@mui/x-data-grid';
import { CardContent, Card as MuiCard, Box } from "@mui/material";
import { spacing } from "@mui/system";

Chart.register(...registerables)
const Card = styled(MuiCard)(spacing);

//応募データを取得するLambda関数を呼び出す関数
const DataGrids =({ selectRows })=> {
  const [rows, setRows] = useState([]);
  //propsで受け取ったselectRows内の値のうちscout_template_no,sent_message_num,readed_num,entry_rateをセット
  useEffect(() => {
    const selectRows_datagrid = [];
    for (let i = 0; i < selectRows.length; i++) {
      const row = {
        id: i,
        スカウト番号: selectRows[i].スカウト番号,
        開封数: selectRows[i].開封数,
        送信数: selectRows[i].送信数,
        応募率: selectRows[i].応募率,
      };
      selectRows_datagrid.push(row);
    }
    setRows(selectRows_datagrid);
  }, [selectRows]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'スカウト番号',
      headerName: 'スカウト番号',
      width: 150,
      editable: true,
    },
    {
      field: '開封数',
      headerName: '開封数',
      width: 110,
      editable: true,
    },
    {
      field: '送信数',
      headerName: '送信数',
      width: 110,
      editable: true,
    },
    {
      field: '応募率',
      headerName: '応募率',
      width: 110,
    },
  ];
    
    return (
      <Card mb={1}>
        <CardContent>
          <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
        </CardContent>
      </Card>
    );
  // }
}

export default withTheme(DataGrids);
