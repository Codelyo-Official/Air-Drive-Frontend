import React, { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  rating: number;
  pricePerDay: number;
  location: string;
}

interface MapProps {
  cars: Car[];
}

// This would normally come from environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGF5eWFiMTAzIiwiYSI6ImNtYmZodmg3NTI5azEyaXNiMnplOTk0bjAifQ.nJ8QV8dn6GmObCVUgh8kPw';

const Map: React.FC<MapProps> = ({ cars }) => {
  const [viewport, setViewport] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 11
  });
  
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  
  // In a real implementation, we would get actual coordinates for each car
  // For this demo, we'll generate random coordinates around the viewport center
  const getRandomCoordinates = (index: number) => {
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    return {
      latitude: viewport.latitude + latOffset + (index * 0.01),
      longitude: viewport.longitude + lngOffset + (index * 0.01)
    };
  };

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      onMove={(evt) => setViewport(evt.viewState)}
    >
      {cars.map((car, index) => {
        const coordinates = getRandomCoordinates(index);
        
        return (
          <Marker
            key={car.id}
            latitude={coordinates.latitude}
            longitude={coordinates.longitude}
            anchor="bottom"
          >
            <div 
              onClick={() => setSelectedCar(car)}
              className="bg-white rounded-full shadow-md w-12 h-12 flex items-center justify-center border-2 border-amber-500 cursor-pointer transform hover:scale-110 transition-transform"
            >
              <div className="text-xs font-bold">${car.pricePerDay}</div>
            </div>
          </Marker>
        );
      })}
      
      {selectedCar && (
        <Popup
          latitude={getRandomCoordinates(cars.indexOf(selectedCar)).latitude}
          longitude={getRandomCoordinates(cars.indexOf(selectedCar)).longitude}
          anchor="bottom"
          onClose={() => setSelectedCar(null)}
          closeOnClick={false}
          closeButton={true}
        >
          <div className="p-2 w-60">
            <Link to={`/cars/${selectedCar.id}`} className="block">
              <img 
                src={selectedCar.image} 
                alt={`${selectedCar.make} ${selectedCar.model}`}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <div className="flex justify-between items-start">
                <h3 className="font-medium">
                  {selectedCar.year} {selectedCar.make} {selectedCar.model}
                </h3>
                <div className="flex items-center">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-xs">{selectedCar.rating}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">{selectedCar.location}</p>
              <p className="text-sm font-semibold">${selectedCar.pricePerDay}/day</p>
            </Link>
          </div>
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default Map;