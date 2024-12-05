import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const Scatter = () => {
  const [data, setData] = useState([]);
  const [muscleGroup, setMuscleGroup] = useState('Shoulders'); // Default to Shoulders

  useEffect(() => {
    const fetchData = async () => {
      try {
        const SHEET_ID = process.env.REACT_APP_SHEET_ID;
        const API_KEY = process.env.REACT_APP_API_KEY;

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${muscleGroup}?key=${API_KEY}`;
        const response = await axios.get(url);

        const rows = response.data.values;
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
      }
    };

    fetchData();
  }, [muscleGroup]); // Re-fetch data whenever muscleGroup changes

  useEffect(() => {
    // Clear previous chart
    d3.select('#scatter-plot').selectAll('*').remove();

    if (data.length === 0) return;

    // Set dimensions
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 150, bottom: 50, left: 50 };

    // Create SVG container
    const svg = d3
      .select('#scatter-plot')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '5px 10px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Set scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.reps)])
      .range([0, chartWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.weight)])
      .range([chartHeight, 0]);

    // Define color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain([...new Set(data.map((d) => d.exercise))])
      .range(d3.schemeCategory10);

    // Add axes
    svg
      .append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-chartHeight))
      .attr('class', 'grid');

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-chartWidth))
      .attr('class', 'grid');

    // Add scatter points with color
    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.reps))
      .attr('cy', (d) => yScale(d.weight))
      .attr('r', 5)
      .attr('fill', (d) => colorScale(d.exercise))
      .attr('opacity', 0.7)
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>Exercise:</strong> ${d.exercise}<br>
             <strong>Weight:</strong> ${d.weight} kg<br>
             <strong>Reps:</strong> ${d.reps}<br>
             <strong>Date:</strong> ${d.date}`
          )
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    // Add legend
    const legend = svg
      .selectAll('.legend')
      .data(colorScale.domain())
      .enter()
      .append('g')
      .attr('transform', (_, i) => `translate(${chartWidth + 20}, ${i * 20})`);

    legend
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d) => colorScale(d));

    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 10)
      .style('text-anchor', 'start')
      .style('alignment-baseline', 'middle')
      .text((d) => d);

    // Add axis labels
    svg
      .append('text')
      .attr('x', chartWidth / 2)
      .attr('y', chartHeight + 40)
      .style('text-anchor', 'middle')
      .text('Number of Reps');

    svg
      .append('text')
      .attr('x', -chartHeight / 2)
      .attr('y', -30)
      .style('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Weight (kg)');

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [data]);

  return (
    <div>
      <h1>Scatter Plot: {muscleGroup} Data</h1>
      <label>
        <strong>Select Muscle Group: </strong>
        <select
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
        >
          <option value="Shoulders">Shoulders</option>
          <option value="Front">Front</option>
          <option value="Back">Back</option>
          <option value="Legs">Legs</option>
        </select>
      </label>
      <svg id="scatter-plot" />
    </div>
  );
};

export default Scatter;
