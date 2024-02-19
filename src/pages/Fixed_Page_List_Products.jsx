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
import WatchTwoToneIcon from '@mui/icons-material/WatchTwoTone';

export default function Fixed_Page_List_Products({ onSearch }) {
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [distinctDatebyProduct, setDistinctDatebyProduct] = useState([]);
  const [distinctRevision, setDistinctRevision] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
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

  const fetchRevProducts = async () => {
    try {

        const response = await axios.get(`http://10.17.66.242:3001/api/smart_fixed/filter-rev-by-product?product=${selectedProduct}`);
        const data  = response.data;
        const MaxRev = (data[0].max_rev)
        setDistinctRevision(MaxRev);
    } catch (error) {
      console.error(`Error fetching distinct data Factory List: ${error}`);
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

  useEffect(() => {
    if (selectedProduct) {
      fetchDatebyProduct();
      fetchRevProducts();
    }
  }, [selectedProduct]);

  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={8}>
            <div className="w-screen ml-20 mt-20">
                <div >
                    {/* <Smart_Scrap_SearchFactoryGroup onSearch={onSearch} /> */}
                    <Fixed_SearchMasterDayByProducts
                        onSearch={(queryParams) => {
                          setSelectedProduct(queryParams.product_name);
                        }}
                    />
                </div>
            </div>
          
            <div className="w-screen ml-20 mt-8" 
                style={{
                    border: '1px solid black',
                    width: 835,
                    height: 50,
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    paddingTop: 5,
                    backgroundColor: '#40A2E3',
                    color: 'white'
                }}
            >
                Product : {selectedProduct && (
                    <p style={{ display: 'inline', margin: 0 }}>
                        {selectedProduct} <span style={{ color: '#FFE4C9' }}>(Rev.{distinctRevision})</span>
                    </p>
                )}
                
            </div>

            <div className="w-screen ml-20 mt-0" 
                  style={{width:835 , height: 500}}>
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
            {/* <div className="flex items-center justify-end w-screen ml-20 mt-0" style={{width:690}}>
                    <Button 
                        variant="contained" 
                        // size="small"
                        style={{width: '170px', height: '50px' , marginTop: 7 , backgroundColor: '#FF8911' , color: 'black'}}
                        onClick={handleFixLeadtime}
                        endIcon={<WatchTwoToneIcon />}
                        >Fix Leadtime
                    </Button>
            </div> */}
        </Box>
    </>
  );
}
