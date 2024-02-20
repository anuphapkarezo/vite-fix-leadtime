import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './styles/Fixed_Page_List_Products.css'; // Import the CSS file
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Modal from '@mui/material/Modal';
import Navbar from "../components/navbar/Navbar";
import Fixed_SearchMasterDayByProducts from "../components/SearchGroup/Fixed_SearchMasterDayByProducts";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import WatchTwoToneIcon from '@mui/icons-material/WatchTwoTone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DriveFolderUploadSharpIcon from '@mui/icons-material/DriveFolderUploadSharp';

import CSVReader from 'react-file-reader';
import ReactFileReader from 'react-file-reader';
import Swal from 'sweetalert2';


export default function Fixed_Page_Upload_Master({ onSearch }) {
  const [distinctDatebyProduct, setDistinctDatebyProduct] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

    const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
 
  const [csvData, setCsvData] = useState([]);
  const [FileName, setFileName] = useState(['']);

  const handleFiles = (files) => {
    const file = files[0];
    setFileName(file.name)

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;

      // Split content into rows
      const rows = content.split('\n');

      // Process each row
      const parsedData = rows.map(row => {
        // Assuming CSV data is comma-separated, you may need to adjust this parsing logic
        const rowData = row.split(',');
        // console.log('rowData' , rowData);
        return rowData;
      });
      // Update state with CSV data
      setCsvData(parsedData);
    };
    reader.readAsText(file);
  };

  // console.log('csv data' , csvData);


  const HandleSaveMaster = () => {
    const swalWithZIndex = Swal.mixin({
        customClass: {
            popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
        },
    });

    if (FileName == '') {
        console.log('choose file');
        // Open Dialog
    } else {
        swalWithZIndex.fire({
            title: "Confirm Save",
            text: "Are you sure want to save the master data?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                const products = csvData.map(row => row[0]);
                setSelectedProduct(products[1])
                console.log('setSelectedProduct' , selectedProduct);
                
                async function fetchData() {
                    const response = await axios.get(`http://10.17.66.242:3001/api/smart_fixed/filter-count-product-delete?product=${products[1]}`);
                    const data = response.data;
                    const CountProduct = data[0].count_product;
                    if (CountProduct > 0) {
                        axios
                          .get(
                            `http://10.17.66.242:3001/api/smart_fixed/delete-product-data?product=${products[1]}`
                          )
                        // console.log('delete OK');
                    }
                    const promises = csvData.map(async row => {
                      axios
                      .get(
                        `http://10.17.66.242:3001/api/smart_fixed/insert-data-master-product?product=${encodeURIComponent(row[0])}&item=${encodeURIComponent(row[1])}&productitem=${encodeURIComponent(row[2])}&factory=${encodeURIComponent(row[3])}&unit=${encodeURIComponent(row[4])}&seq=${encodeURIComponent(row[5])}&proc=${encodeURIComponent(row[6])}&Day=${encodeURIComponent(row[7])}`
                      )
                      // console.log('row[6]' , row[6]);
                      // axios
                      //       .get(
                      //         `http://10.17.66.242:3001/api/smart_fixed/insert-data-master-product?product=${row[0]}&item=${row[1]}&productitem=${row[2]}&factory=${row[3]}&unit=${row[4]}&seq=${row[5]}&proc=${row[6]}&Day=${row[7]}`
                      //       )
                      // console.log('Insert OK');
                    });

                    const promises_Fetch = csvData.map(async row => {
                        const response = await axios.get(`http://10.17.66.242:3001/api/smart_fixed/filter-data-master-date-by-product?product=${products[1]}`);
                        const data = await response.data;
                        // console.log(data);
                        // Add a unique id property to each row
                        const rowsWithId = data.map((row, index) => ({
                            ...row,
                            id: index, // You can use a better unique identifier here if available
                        }));
                        setDistinctDatebyProduct(rowsWithId);
                    });
        
                    Promise.all(promises , promises_Fetch)
                        .then(() => {
                            // Success notification
                            Swal.fire({
                                icon: "success",
                                title: "Save Success",
                                text: "Data master saved successfully",
                                confirmButtonText: "OK",
                            });
                            setFileName('')
                            setCsvData('')
                            fetchDatebyProduct()
                        })
                        .catch((error) => {
                            console.error("Error saving data:", error);
                            Swal.fire({
                                icon: "error",
                                title: "Save Error",
                                text: "An error occurred while saving data",
                                confirmButtonText: "OK",
                            });
                        });
                }
                fetchData()
            }
        });
    }
};

const fetchDatebyProduct = async () => {
  try {
    setIsLoading(true);
    const response = await axios.get(`http://10.17.66.242:3001/api/smart_fixed/filter-data-master-date-by-product?product=${selectedProduct}`);
    const data = await response.data;
    // console.log(data);
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

const columns = [
  { field: 'seq', headerName: 'Seq', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
  { field: 'factory', headerName: 'Factory', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
  { field: 'proc', headerName: 'Process', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  { field: 'unit', headerName: 'Unit', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  { field: 'item', headerName: 'Item', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  { field: 'Day', headerName: 'Day', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right'},
  { field: 'update_date', headerName: 'Update', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
]
  

  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={8}>
            <div className="w-screen ml-20 mt-20">
                Please select file for upload
            </div>
            <div className="w-screen ml-20 mt-2" style={{display: 'inline-flex', alignItems: 'center'}}>
                <ReactFileReader handleFiles={handleFiles} fileTypes={'.csv'}>
                <Button
                  className='btn_active'
                  style={{
                    border: '1px solid black',
                    fontSize: 16,
                    width: 200,
                    height: 50,
                    backgroundColor: '#EEEEEE',
                    
                  }}
                  endIcon={<CloudUploadIcon />}
                >
                  Choose file ...
                </Button>
                </ReactFileReader>
                <p style={{marginLeft: '10px' , fontSize: 16 , width: 475 }}>({FileName})</p>
                {/* <div style={{marginLeft: 10}}>||</div> */}
                <div>
                      <Button className='btn_hover' style={{fontWeight:'bold' , backgroundColor: '#74E291' , width: 150 , height: 50 , color: "black"}} onClick={HandleSaveMaster}>Upload File</Button>
                </div>
            </div>    
            <div className="ml-20 mt-1">
                <a href="/FormatMasterFixLeadtime.csv" download="FormatMasterFixLeadtime.csv"
                style={{textDecoration: 'underline', color: 'blue' }}>Format .csv file</a>
            </div>
            <div className="w-screen ml-20 mt-2" 
                  style={{width:835 , height: 530}}>
            {isLoading ? (
                <CircularProgress /> // Display a loading spinner while data is being fetched
                  ) : (
                    <DataGrid
                      columns={columns}
                      // disableColumnFilter
                      // disableDensitySelector
                      rows={distinctDatebyProduct}
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
            </div>
        </Box>
    </>
  );
}
