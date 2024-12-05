import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from '../components/BarChart';

const SHEET_ID = '1gIBW8Fgge7nRqXjf8_UMIUh5lDnL7xLnCHjoNqlKBTA';
const API_KEY = 'AIzaSyAXUCza9xmFlRoz8JUAh1cmnanJoNfMMvg';
const SHEET_NAME = 'Shoulders';

const Shoulders = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
          const response = await axios.get(url);
  
          const rows = response.data.values;
          const parsedData = rows.slice(1).map((row) => ({
            date: row[0],
            exercise: row[1],
            weight: row[2],
            reps: row[3],
          }));
  
          setData(parsedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        <h2>Shoulders Data</h2>
        {loading ? <p>Loading...</p> : <BarChart data={data} />}
      </div>
    );
  };
  
  export default Shoulders;