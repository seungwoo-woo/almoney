import { Container } from '@mui/material'
import React, { useState, useEffect } from 'react'

function MyGeo() {


  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [dist, setDist] = useState()

  const targetGeo = {latitude: 37.456255, longitude: 126.705206}

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
    setDist(haversine(targetGeo.latitude, targetGeo.longitude, coordinates.latitude, coordinates.longitude))
  }, []);

  






  return (
    <>
      <Container>{coordinates.latitude}</Container>
      <Container>{coordinates.longitude}</Container>

      <Container>{dist}</Container>

    </>
  )
}

export default MyGeo
