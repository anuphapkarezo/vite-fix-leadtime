import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import AutoAwesomeMotionTwoToneIcon from '@mui/icons-material/AutoAwesomeMotionTwoTone';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ManageSearchTwoToneIcon from '@mui/icons-material/ManageSearchTwoTone';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import ViewCompactSharpIcon from '@mui/icons-material/ViewCompactSharp';
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined';

const MenuList = ({ open }) => {
  return (
    <List>
        <ListItem disablePadding sx={{ display: 'block' ,color: 'black'}} component={Link} to="/env_scrap_record_weight_daily_transaction">
                <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    
                }}
                >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: 'inherit', // Set initial color
                                "&:hover": {
                                color: 'primary.main', // Change color on hover
                                }
                    }}
                    >
                    <ScaleOutlinedIcon style={{color: '#1F4172'}}/>
                </ListItemIcon>
                <ListItemText primary="Record Weight (Daily)" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </ListItem>
    </List>
  );
}

export default MenuList;
