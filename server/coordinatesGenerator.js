const randomInt = (max) => {
  return Math.floor(Math.random() * max);
}

module.exports = (currRadius, currCoordinates) => {
//Get the Current Location's longitude and latitude
  let currentLat = currCoordinates[0];
  let currentLong = currCoordinates[1];
  
  //1° = 111km So, 1 Meter = 1/111000
  let meterCord = 1.0/111000.0

  //Generate random Meters between the maximum and minimum Meters
  let randomMeters = randomInt(currRadius * 1000 + 1);
  
  //then Generating Random numbers for different direction
  let randomPM = randomInt(4);
  
  //then Generate x and y based on randomMeters
  let randomMetersX = randomInt(randomMeters + 1);
  let randomMetersY = Math.sqrt(randomMeters * randomMeters - randomMetersX * randomMetersX);
  
  //Then we convert the distance in meters to coordinates by Multiplying number of meters with 1 Meter Coordinate
  let metersCordX = meterCord * randomMetersX;
  let metersCordY = meterCord * randomMetersY;
  
  //here we generate the last Coordinates
  if (randomPM === 0) {
    return [currentLat + metersCordY, currentLong + metersCordX];
  }
  else if (randomPM === 1) {
    return [currentLat - metersCordY, currentLong - metersCordX];
  }
  else if (randomPM === 2) {
    return [currentLat + metersCordY, currentLong - metersCordX];
  }
  else {
    return [currentLat - metersCordY, currentLong + metersCordX];
  }
}
