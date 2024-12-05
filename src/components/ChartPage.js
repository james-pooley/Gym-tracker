import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from './BarChart';

const ChartPage = ({ sheetName }) => {
  const [data, setData] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const SHEET_ID = process.env.REACT_APP_SHEET_ID;
        const API_KEY = process.env.REACT_APP_API_KEY;

        if (!sheetName) throw new Error('Sheet name is required');

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
        const response = await axios.get(url);

        const rows = response.data.values;
        if (!rows || rows.length < 2) throw new Error('No data found in the sheet');

        const parsedData = rows.slice(1).map((row) => ({
          date: row[0],
          exercise: row[1],
          weight: +row[2],
          reps: +row[3],
        }));

        setData(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sheetName]);

  // Initialize selectedExercises only once when data changes
  useEffect(() => {
    if (data.length > 0 && selectedExercises.length === 0) {
      const uniqueExercises = [...new Set(data.map((d) => d.exercise))];
      setSelectedExercises(uniqueExercises);
    }
  }, [data]); // No dependency on selectedExercises.length here

  return (
    <div>
      <h1>{sheetName} Workouts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <BarChart data={data.filter((d) => selectedExercises.includes(d.exercise))} />
      )}
    </div>
  );
};

export default ChartPage;
