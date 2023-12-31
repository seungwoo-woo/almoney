// react & material UI import ==================================================
import { TableCell, TableRow } from '@mui/material';
import React from 'react'
import { styled } from '@mui/material/styles';
import AdminCellEdit from './AdminCellEdit';


//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

function AddOneRow(props) {

// Initialize Variable ==================================================
const {id, no, cell1, cell2, cell3, cell4, getDataRefresh, editCase} = props;

// Table style ----------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));


// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

return (
  <StyledTableRow>
    <TableCell align='center' style={{fontSize: 14, fontWeight: 400}}>{no}</TableCell>
    <TableCell align='center' style={{fontSize: 14, fontWeight: 400}}>{cell1}</TableCell>
    <TableCell align='center' style={{fontSize: 14, fontWeight: 400}}>{cell2}</TableCell>
    <TableCell align='center' style={{fontSize: 14, fontWeight: 400}}>{cell3}</TableCell>
    <TableCell align='center' style={{fontSize: 14, fontWeight: 400}}>{cell4}</TableCell>
    <TableCell align='center' style={{fontSize: 14, fontWeight: 400}}><AdminCellEdit id={id} getDataRefresh={getDataRefresh} editCase={editCase}/></TableCell>
  </StyledTableRow>
);

}

export default AddOneRow