
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Stack } from '@mui/material';
import { deepOrange, deepPurple } from '@mui/material/colors';


// (d ? d.map((i) => {
//   return (
//     <>
//       <div>{index}</div>
//       <div>{(new Date(i['in']['seconds']*1000)).toLocaleString()}</div>
//       <div>{i['name']}</div>
      
//     </>)
// }): "")




// color="text.secondary"
function Cell(props) {

  const { dailyData, date } = props;

  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1);

  var dayColor = ''
  var day = ''

  if((new Date(year, month, date)).getDay()===0) {
    dayColor = 'red';
    day = '(일)'
  } 

  if((new Date(year, month, date)).getDay()===1) {
    day = '(월)'
  }

  if((new Date(year, month, date)).getDay()===2) {
    day = '(화)'
  }

  if((new Date(year, month, date)).getDay()===3) {
    day = '(수)'
  }

  if((new Date(year, month, date)).getDay()===4) {
    day = '(목)'
  }

  if((new Date(year, month, date)).getDay()===5) {
    day = '(금)'
  }
  
  if((new Date(year, month, date)).getDay()===6) {
    dayColor = 'blue';
    day = '(토)'
  }


  return (
    <Card sx={{ minWidth: 275, m: 1, pb: 0 }}>
      <CardContent>        
        <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }} color = {dayColor} gutterBottom>
          {`${date} ${day}`}
        </Typography>
        <Stack  direction="row" spacing={1}>
        {dailyData.map(d => {
          return (          
          <Avatar sx={{ bgcolor: deepPurple[600], fontSize: 12 }}>{d['name']}</Avatar>
          )
        })} 
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Cell