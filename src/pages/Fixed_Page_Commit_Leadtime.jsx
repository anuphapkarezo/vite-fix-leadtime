import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './styles/Fixed_Page_List_Products.css'; // Import the CSS file
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Modal from '@mui/material/Modal';
import Navbar from "../components/navbar/Navbar";
import Fixed_SearchProductsCommit from "../components/SearchGroup/Fixed_SearchProductsCommit";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone';
import Swal from 'sweetalert2';

export default function Fixed_Page_Commit_Leadtime({ onSearch }) {
  const [error , setError] = useState(null);

    //Set Dropdown List
  const [selectedProduct, setSelectedProduct] = useState(null);

  //Set Parameter from API
  const [distinctProduct, setDistinctProduct] = useState([]);
  const [distinctDatebyProduct, setDistinctDatebyProduct] = useState([]);
  const [distinctRoutingProduct, setDistinctRoutingProduct] = useState([]);
  const [distinctUpdateRoutingProduct, setDistinctUpdateRoutingProduct] = useState([]);
  const [distinctRevision, setDistinctRevision] = useState(null);

  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  const fetchListProducts = async () => {
    try {
      const response = await axios.get("http://10.17.66.242:3001/api/smart_fixed/filter-list-products");
      const ListProduct  = response.data;
      setDistinctProduct(ListProduct);
    } catch (error) {
      console.error(`Error fetching distinct data Factory List: ${error}`);
    }
};

const fetchRevProducts = async () => {
  try {

      const response = await axios.get(`http://10.17.66.242:3001/api/smart_fixed/filter-rev-by-product?product=${selectedProduct.product_name}`);
      const data  = response.data;
      const MaxRev = (data[0].max_rev)
      setDistinctRevision(MaxRev);
  } catch (error) {
    console.error(`Error fetching distinct data Factory List: ${error}`);
  }
};

if (error) {
    return <div>Error: {error}</div>;
}

//สร้าง Function selection change
const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
}

const fetchDatebyProduct = async () => {

  try {
    setIsLoading(true);
    const response = await axios.get(`http://10.17.66.242:3001/api/smart_fixed/filter-data-master-date-by-product?product=${selectedProduct.product_name}`);
    const data = await response.data;

    // Add a unique id property to each row
    const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, // You can use a better unique identifier here if available
    }));
    setDistinctDatebyProduct(rowsWithId);
    } catch (error) {
    console.error('Error fetching data:', error);
    setError('An error occurred while fetching data Master prices list');
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
};

const fetchRoutingProduct = async () => {
  try {
    setIsLoading(true);
    const response = await axios.get(`http://10.17.66.242:3003/api/smart_ora/filter-rout-prod?product=${selectedProduct.product_name}`);
    const data = await response.data;
    // console.log('data',data);

    // Add a unique id property to each row
    const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, // You can use a better unique identifier here if available
    }));
    setDistinctRoutingProduct(rowsWithId);
    
    } catch (error) {
    console.error('Error fetching data:', error);
    setError('An error occurred while fetching data Master prices list');
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
};

useEffect(() => {
  fetchListProducts();
}, []);

useEffect(() => {
  if (selectedProduct) {
    fetchDatebyProduct();
    fetchRoutingProduct();
    fetchRevProducts();
  }
}, [selectedProduct]);

useEffect(() => {
  if (distinctRoutingProduct.length > 0 && distinctDatebyProduct.length > 0) {
    const updatedRoutingProduct = distinctRoutingProduct.map(routingProduct => {
      const matchingDateProduct = distinctDatebyProduct.find(dateProduct => {
        return dateProduct.proc === routingProduct.PROC_DISP && dateProduct.seq === routingProduct.RO_SEQ;
      });

      if (matchingDateProduct) {
        return {
          ...routingProduct,
          RO_DAY: matchingDateProduct.Day,
        };
      } else {
        return routingProduct;
      }
    });
    setDistinctUpdateRoutingProduct(updatedRoutingProduct);
  }
}, [distinctRoutingProduct, distinctDatebyProduct]);

// const handleFixLeadtime = () => {
//   const swalWithZIndex = Swal.mixin({
//     customClass: {
//         popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
//     },
// });
// if (distinctRevision == null) {
// } else {
//     swalWithZIndex.fire({
//         title: "Confirm Save",
//         text: "Are you sure want to save the master data?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, Save",
//         cancelButtonText: "Cancel",
//     }).then((result) => {
//         if (result.isConfirmed) {
//             distinctUpdateRoutingProduct.forEach(data => {
//               // // ตัวอย่างการเก็บข้อมูล factory จาก data
//               const SeqData = data.RO_SEQ;
//               const RevData = data.RO_REV;
//               const FactoryCode = data.FACTORY_CODE;
//               const FactoryDesc = data.FACTORY_DESC;
//               const UnitData = data.FAC_UNIT_CODE;
//               const proc_id = data.RO_PROC_ID;
//               const ProcessData = data.PROC_DISP;
//               const ItemData = data.ITEM_TYPE;
//               const DayData = data.RO_DAY;
        
//               // ทำสิ่งที่ต้องการกับ factoryData เช่น บันทึกลงในฐานข้อมูลหรือประมวลผลข้อมูล
//               console.log('Product >' , selectedProduct.product_name);
//               console.log('Seq >' ,SeqData);
//               console.log('Rev >' ,RevData);
//               console.log('Factory Code >' ,FactoryCode);
//               console.log('Factory Desc >' ,FactoryDesc);
//               console.log('Unit >' ,UnitData);
//               console.log('Process ID >' ,proc_id);
//               console.log('Process >' ,ProcessData);
//               console.log('Item >' ,ItemData);
//               console.log('Day >' ,DayData);
//               console.log('<<<<<<<<<<<<>>>>>>>>>>>>');
//           });
//           .then(() => {
//               // Success notification
//               Swal.fire({
//                   icon: "success",
//                   title: "Save Success",
//                   text: "Data master saved successfully",
//                   confirmButtonText: "OK",
//               });
//           })
//           .catch((error) => {
//               console.error("Error saving data:", error);
//               Swal.fire({
//                   icon: "error",
//                   title: "Save Error",
//                   text: "An error occurred while saving data",
//                   confirmButtonText: "OK",
//               });
//           });
//         }
//     });
// }
// }


const handleFixLeadtime = () => {
  const swalWithZIndex = Swal.mixin({
    customClass: {
        popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
    },
  });
  if (distinctRevision == null) {
    // Handle the case where distinctRevision is null if needed
  } else {
    if (distinctUpdateRoutingProduct.length > 0) {
          swalWithZIndex.fire({
            title: "Confirm Save",
            text: "Are you sure you want to save the master data?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                distinctUpdateRoutingProduct.forEach(data => {
                  // // Example of retrieving factory data from 'data'
                  const DayData = data.RO_DAY;
                  const RevData = data.RO_REV;
                  const proc_id = data.RO_PROC_ID;
                  const SeqData = data.RO_SEQ;

                  const FactoryCode = data.FACTORY_CODE;
                  const FactoryDesc = data.FACTORY_DESC;
                  const UnitData = data.FAC_UNIT_CODE;
                  const ProcessData = data.PROC_DISP;
                  const ItemData = data.ITEM_TYPE;

                  axios
                    .get(
                      `http://10.17.66.242:3003/api/smart_ora/update-day-routing?ro_day=${DayData}&product=${selectedProduct.product_name}&rev=${RevData}&proc_id=${proc_id}&seq=${SeqData}`
                    )
                  console.log('TEST API :' ,
                  `http://10.17.66.242:3003/api/smart_ora/update-day-routing?ro_day=${DayData}&product=${selectedProduct.product_name}&rev=${RevData}&proc_id=${proc_id}&seq=${SeqData}`);
              });
              // Success notification
              Swal.fire({
                  icon: "success",
                  title: "Save Success",
                  text: "Master data saved successfully",
                  confirmButtonText: "OK",
              });
              setDistinctUpdateRoutingProduct([]);
              setDistinctDatebyProduct([]);
              setSelectedProduct(null);
              setDistinctRevision(null);
            } 
      }).catch((error) => {
          console.error("Error saving data:", error);
          Swal.fire({
              icon: "error",
              title: "Save Error",
              text: "An error occurred while saving data",
              confirmButtonText: "OK",
          });
          setDistinctUpdateRoutingProduct([]);
          setDistinctDatebyProduct([]);
          setSelectedProduct('');
          setDistinctRevision(null);
      });
    }
  }
}

const columns = [
  { field: 'RO_SEQ', headerName: 'Sequence', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
  { field: 'RO_REV', headerName: 'Revision', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
  { field: 'FACTORY_DESC', headerName: 'Factory', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
  { field: 'FAC_UNIT_CODE', headerName: 'Unit', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  { field: 'PROC_DISP', headerName: 'Process', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  { field: 'ITEM_TYPE', headerName: 'Item', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  { field: 'RO_DAY', headerName: 'Day', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right'},
]


return (
  <>
      <Navbar onToggle={handleNavbarToggle}/>
      <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={8}>
          <Box mt={1} maxWidth="100%" display="flex" justifyContent="" style={{ display: 'flex', alignItems: 'center' }}>
            <Autocomplete
                disablePortal
                // freeSolo
                id="combo-box-demo-product"
                // size="small"
                options={distinctProduct}
                getOptionLabel={(option) => option && option.product_name}
                value={selectedProduct}
                onChange={handleProductChange}
                sx={{ width: 250 , height: '60px' , marginTop: 3}}
                renderInput={(params) => <TextField {...params} label="Product" />}
                isOptionEqualToValue={(option, value) =>
                    option && value && option.product_name === value.product_name
                }
            />
            <Box mt={1} maxWidth="100%" display="flex" justifyContent=""
                style={{fontSize: 16 , marginLeft: 10 , marginTop: 22 , width: 120 , color: 'red'}}>( Rev. {distinctRevision} )
            </Box>
            <Box mt={1} maxWidth="100%" display="flex" justifyContent="" >
                <Button 
                    variant="contained" 
                    // size="small"
                    style={{width: '160px', height: '50px' , marginTop: 20 , marginLeft: 245 , backgroundColor: '#F57D1F'}}
                    onClick={handleFixLeadtime}
                    endIcon={<EventAvailableTwoToneIcon />}
                    >Fix Leadtime
                </Button>
            </Box>
          </Box>
          <Box mt={1} maxWidth="100%" display="flex" justifyContent="" 
                  style={{width:785 , height: 560}}>
            {isLoading ? (
                <CircularProgress /> // Display a loading spinner while data is being fetched
                  ) : (
                  <DataGrid
                    columns={columns}
                    // disableColumnFilter
                    // disableDensitySelector
                    rows={distinctUpdateRoutingProduct}
                    slots={{ toolbar: GridToolbar }}
                    filterModel={filterModel}
                    onFilterModelChange={(newModel) => setFilterModel(newModel)}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    columnVisibilityModel={columnVisibilityModel}
                    // checkboxSelection
                    onColumnVisibilityModelChange={(newModel) =>
                      setColumnVisibilityModel(newModel)
                    }
                  />
                )}
          </Box>
          {/* <div className="w-screen ml-10 mt-2" style={{width: '2000px' , paddingBottom: '10px'}}>
            <table border="1" className="w-full">
                <thead>
                  <tr>
                    <th  style={{ width: '120px'  , height: '40px', backgroundColor: '#98ABEE' , border: '1px solid black'}}>Process/Day</th>
                    {[...Array(35).keys()].map(day => (
                      // <th key={day}>{day + 1} <style>{{width: '150px'  , height: '40px', backgroundColor: '#B7C9F2'}}</style></th>
                      <th key={day} style={{ width: '150px', height: '40px', backgroundColor: '#B7C9F2' , border: '1px solid black' }}>{day + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {distinctUpdateRoutingProduct.map((process, processIndex) => (
                    <tr key={processIndex}>
                      <td style={{ width: '120px', height: '40px', backgroundColor: '#B7C9F2', border: '1px solid black' }}>Process {processIndex + 1}</td>
                      {[...Array(10).keys()].map(day => (
                        <td key={day} style={{ width: '150px', height: '40px', backgroundColor: '#F0F3FF', border: '1px solid black' }}>
                          {process.find(item => item.RO_DAY === day + 1)?.PROC_DISP || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
            </table>
          </div> */}
      </Box>
  </>
);
}
