import { Card, CardContent, Container, Divider, Paper, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'


// 내위치 37.40091289517126, 126.7214352464646
// 논현역 37.400658384749654, 126.72240464747604
// 우리집 37.39457041909897, 126.72365239853332

function MyGeo(props) {

  const {setGeoOk} = props
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [dist, setDist] = useState()
  const companyGeo = {latitude: 37.39457041909897, longitude: 126.72365239853332}

  let distance = 0
  let msg = '회사에 안계신가봐요...ㅠㅠ'

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (단위: 킬로미터)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 두 지점 간의 거리 (단위: 킬로미터)
    return distance;
  }



  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  
  if(coordinates) {
    distance = (haversine(coordinates.latitude, coordinates.longitude, companyGeo.latitude, companyGeo.longitude))
  }

  if (distance*1000 < 1000){
    msg = `회사에 계시네요... ^^`
    setGeoOk(true)
  }




  return (
    <>
    <Card>
    <CardContent>
        <Typography variant="body1" color="blue">
          현재 사용자 위치 정보
        </Typography>
        <Divider />
        <Typography variant="body2" sx={{ mb: 0 }} >
          <br />
          {msg}
        </Typography>
        <Divider />
        <Typography variant="body2" sx={{ mb: 0 }} color="text.secondary">
          <br />
          거리 : {distance}
        </Typography>
      </CardContent>   
    </Card>
    </>
  )
}

export default MyGeo
