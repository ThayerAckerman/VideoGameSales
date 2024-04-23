
// Set the dimensions and margins of the graph
const margin = {top: 20, right: 20, bottom: 50, left: 120};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#bar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read the CSV data
d3.csv("Video_Games.csv").then(function(data) {

  // Stack the data
  const stack = d3.stack()
    .keys(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);
  const stackedData = stack(data);

  // X scale and Axis
  const x = d3.scaleLinear()
    .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
    .range([0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Y scale and Axis
  const y = d3.scaleBand()
    .domain(data.map(d => d.Platform))
    .range([0, height])
    .padding(0.1);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Color palette
  const color = d3.scaleOrdinal()
    .domain(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])
    .range(['#0072BC', '#18375F', '#EF4A60', '#6F777D']);

  // Create bars
  svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
      .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d.data.Platform))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth());

  //chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2 + 7)
    .attr("text-anchor", "middle")
    .text("Video Game Sales by Region and Platform");

  //x-axis label
  svg.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom / 2 + 10})`)
    .attr("text-anchor", "middle")
    .text("Global Sales");


});
