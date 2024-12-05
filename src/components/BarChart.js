import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Set dimensions
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 130, bottom: 80, left: 50 };

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Parse the data
    const parsedData = data.map((d) => ({
      date: new Date(d.date),
      exercise: d.exercise,
      weight: +d.weight,
    }));

    // Get unique dates
    const uniqueDates = [...new Set(parsedData.map((d) => d.date))];

    // Set scales
    const xScale = d3
      .scaleBand()
      .domain(uniqueDates)
      .range([0, chartWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d.weight)])
      .range([chartHeight, 0]);

    const colorScale = d3
      .scaleOrdinal()
      .domain([...new Set(parsedData.map((d) => d.exercise))])
      .range(d3.schemeCategory10);

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y-%m-%d')))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    svg.append('g').call(d3.axisLeft(yScale));

    // Group data by date for grouped bar chart
    const groupedData = d3.group(parsedData, (d) => d.date);

    // Add columns
    groupedData.forEach((sets, date) => {
      const dateX = xScale(date);

      sets.forEach((set, index) => {
        svg
          .append('rect')
          .attr('x', dateX + index * (xScale.bandwidth() / sets.length))
          .attr('y', yScale(set.weight))
          .attr('width', xScale.bandwidth() / sets.length)
          .attr('height', chartHeight - yScale(set.weight))
          .attr('fill', colorScale(set.exercise));
      });
    });

    // Add legend
    const legend = svg
      .selectAll('.legend')
      .data(colorScale.domain())
      .enter()
      .append('g')
      .attr(
        'transform',
        (_, i) => `translate(${chartWidth + 20}, ${i * 20})`
      );

    legend
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', colorScale);

    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 10)
      .text((d) => d)
      .style('font-size', '12px');
  }, [data]);

  return <svg ref={svgRef} />;
};

export default BarChart;
