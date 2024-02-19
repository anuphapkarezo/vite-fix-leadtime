import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';

function Fixed_SearchProductsCommit({ onSearch }) {
    const [error , setError] = useState(null);

    //Set Dropdown List
    const [selectedProduct, setSelectedProduct] = useState(null);

    //Set Parameter from API
    const [distinctProduct, setDistinctProduct] = useState([]);

    const fetchListProducts = async () => {
        try {
          const response = await axios.get("http://10.17.66.242:3001/api/smart_fixed/filter-list-products");
          const ListProduct  = response.data;
          setDistinctProduct(ListProduct);
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

    const handleSearch = () => {
        const queryParams = {
            product_name: selectedProduct.product_name
        };
        // console.log('Query Params:', queryParams);
        onSearch(queryParams);
    };

    // useEffect(() => {
    //     fetchListProducts();
    // }, []);

    useEffect(() => {
        fetchListProducts();
    },);

    

    return (
        <React.Fragment>
            {/* <div>
                <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#6528F7' , 
                    backgroundColor: '#FAF1E4' , width: '380px' , paddingLeft: '5px' , marginBottom : '20px'}}>
                    Record weight daily transaction</h1>
            </div> */}
            <Box maxWidth="xl" sx={{ width: "100%" , height: 50}}>
                <Grid container spacing={0} style={{width: 1350 }}> 
                    <Grid  item xs={2} md={2} >
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                // freeSolo
                                id="combo-box-demo-product"
                                // size="small"
                                options={distinctProduct}
                                getOptionLabel={(option) => option && option.product_name}
                                value={selectedProduct}
                                onChange={handleProductChange}
                                sx={{ width: 250 , height: '60px' , marginTop: '8px'}}
                                renderInput={(params) => <TextField {...params} label="Product" />}
                                isOptionEqualToValue={(option, value) =>
                                    option && value && option.product_name === value.product_name
                                }
                            />
                        </div>
                    </Grid>

                    
                    
                    {/* <Grid  item xs={2} md={2} >
                        <Button 
                            variant="contained" 
                            // size="small"
                            style={{width: '120px', height: '50px' , marginTop: '10px', marginLeft: 390}}
                            onClick={handleSearch}
                            endIcon={<SearchIcon />}
                            >Search
                        </Button>
                    </Grid> */}
                </Grid>
            </Box>
        </React.Fragment>
    );
}

export default Fixed_SearchProductsCommit