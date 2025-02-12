"use client";

// DataContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

export function useDailyIntake() {
  return useContext(DataContext);
}

export function DailyIntakeProvider({ children }) {
  const [dailyIntake, setDailyIntake] = useState(null);


  const fetchDailyIntake = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      // Send POST request to the API
      const response = await fetch("api/nutrient/list", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate: today, endDate: today }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      // Parse the response if successful
      const data = await response.json();
      setDailyIntake(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    fetchDailyIntake()
  }, []);

  return <DataContext.Provider value={dailyIntake}>{children}</DataContext.Provider>;
}
