"use client";
import { Gym } from "@/types/gym";
import { useState } from "react";
import GymMap from "./Map";
import { capitalize } from "lodash-es";

const groupGymsByCountryAndCity = (gyms: Gym[]) => {
  const grouped: Record<string, Record<string, Gym[]>> = {};

  gyms.forEach((gym) => {
    const { country, city } = gym.address;
    if (!grouped[country]) {
      grouped[country] = {};
    }
    if (!grouped[country][city]) {
      grouped[country][city] = [];
    }
    grouped[country][city].push(gym);
  });
  return grouped;
};

export default function GymList({ gyms }: { gyms: Gym[] }) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  const groupedGyms = groupGymsByCountryAndCity(gyms);

  const handleGymClick = (latitude: number | null, longitude: number | null) => {
    if (latitude && longitude) {
      setMapCoordinates({ latitude, longitude });
    } else {
      console.error("Selected gym does not have valid geoLocation data.");
      setMapCoordinates(null);
    }
  };

  return (
    <div className="flex w-full text-blue-950 max-h-screen">
      <div className="w-72 overflow-y-scroll mx-auto px-2">
        <div className="flex p-2 gap-2 items-baseline">
        <h1 className="text-3xl italic font-bold text-white">SATS</h1>
        <p className="text-white">gymfinder</p>
        </div>
     
        <h2 className="text-white px-2">Select by country:</h2>
        <ul>
          {Object.keys(groupedGyms).map((country) => (
            <li key={country}>
              <div
                onClick={() => setSelectedCountry(country)}
                className={`p-4 rounded m-1 ${
                    selectedCountry === country ? 'bg-[#c84229] text-white' : 'bg-slate-300'
                  }`}
              >
                {country}
              </div>
              {selectedCountry === country && (
                <ul>
                  {Object.keys(groupedGyms[country]).map((city) => (
                    <li key={city} className="m-1 px-4 bg-[#e5eef9]">
                      <h3
                        className="text-lg font-bold text-yellow"
                        onClick={() => setSelectedCity(city)}
                      >
                        {capitalize(city)} ({groupedGyms[country][city].length})
                      </h3>
                      {selectedCity === city && (
                        <ul>
                          {groupedGyms[country][city].map((gym) => (
                            <li
                              key={gym.id}
                              className="border-b border-white/10"
                            >
                              {gym.geoLocation ? (
                                <>
                                  <h4
                                    onClick={() =>
                                      handleGymClick(
                                        gym.geoLocation.latitude,
                                        gym.geoLocation.longitude
                                      )
                                    }
                                    style={{ cursor: "pointer", color: "blue" }}
                                  >
                                    {gym.name}
                                  </h4>
                                  <p className="ml-1 italic">
                                    {gym.address.address1
                                      ? gym.address.address1
                                      : "No address available"}
                                  </p>
                                  <p className="ml-1 italic">
                                    {gym.address.postalCode} {gym.address.city}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <h4 className="text-muted">{gym.name}</h4>
                                  <p className="ml-1 italic">
                                    {gym.address.address1
                                      ? gym.address.address1
                                      : "No address available"}
                                  </p>
                                  <p className="ml-1 italic">
                                    {gym.address.postalCode} {gym.address.city}
                                  </p>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full h-screen">
        <GymMap gyms={gyms} mapCoordinates={mapCoordinates} />
      </div>
    </div>
  );
}
