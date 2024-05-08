// Set the dimensions and margins of the graph
const margin = { top: 20, right: 20, bottom: 50, left: 120 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Append the svg page body
const svg = d3.select("#bar")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom + 40) 
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top + 20})`); 


// Read the CSV data
d3.csv("Video_Games.csv").then(function(data) {

  // Group the data by platform
  const groupedData = Array.from(d3.group(data, d => d.Platform), ([key, values]) => ({ platform: key, sales: values }));

  // Calculate the sum of sales for each region for each platform
  const salesByRegion = groupedData.map(platform => {
    const sales = platform.sales.reduce((acc, curr) => {
      acc.NA_Sales += parseFloat(curr.NA_Sales);
      acc.EU_Sales += parseFloat(curr.EU_Sales);
      acc.JP_Sales += parseFloat(curr.JP_Sales);
      acc.Other_Sales += parseFloat(curr.Other_Sales);
      return acc;
    }, { NA_Sales: 0, EU_Sales: 0, JP_Sales: 0, Other_Sales: 0 });
    return { platform: platform.platform, ...sales };
  });

  // Stack the data
  const stack = d3.stack()
    .keys(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);
  const stackedData = stack(salesByRegion);

  const maxSales = Math.min(d3.max(salesByRegion, d => d3.sum(Object.values(d))), 1400);
  const x = d3.scaleLinear()
  .domain([0, maxSales])
  .range([0, width]);

  //X-axis
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  //Y-axis
  const y = d3.scaleBand()
    .domain(salesByRegion.map(d => d.platform))
    .range([0, height])
    .padding(0.1);
  svg.append("g")
    .call(d3.axisLeft(y));

  //Color palette
  const color = d3.scaleOrdinal()
    .domain(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])
    .range(['#003f5c', '#665191', '#a05195', '#d45087']);

  // Create a tooltip
	const tooltip = d3.select("#bar").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

	// Bars
	svg.selectAll(".bar")
	.data(stackedData)
	.enter()
	.append("g")
	.attr("fill", d => color(d.key))
	.selectAll("rect")
	.data(d => d)
	.enter()
	.append("rect")
	.attr("class", "bar")
	.attr("y", d => y(d.data.platform))
	.attr("height", y.bandwidth())
	.attr("x", d => x(d[0]))
	.attr("width", d => x(d[1]) - x(d[0]))
	// Tooltip interaction
    .on("mouseover", function(event, d) {
		const sales = d[1] - d[0];
		const region = d3.select(this.parentNode).datum().key.split("_")[0]; // Get region from key
		tooltip.transition()
		  .duration(200)
		  .style("opacity", .9);
		tooltip.html(`<strong>Sales:</strong> ${sales.toFixed(2)}<br><strong>Region:</strong> ${region}`) // display the number of sales
		  .style("left", (event.pageX) + "px")
		  .style("top", (event.pageY - 28) + "px");
	  })
	  .on("mouseout", function(d) {
		tooltip.transition()
		  .duration(500)
		  .style("opacity", 0);
	});

	//chart title
	svg.append("text")
		.attr("x", width / 2)
		.attr("y", -margin.top / 2)
		.attr("text-anchor", "middle")
		.text("Total Global Sales by Platform and Region");

		//x-axis label
	svg.append("text")
	.attr("transform", `translate(${width / 2}, ${height + margin.bottom / 2 + 10})`) 
	.attr("text-anchor", "middle")
	.text("Global Sales");

	//color legend
	const legend = svg.append("g")
	.attr("class", "legend")
	.attr("transform", `translate(0, ${height + margin.bottom - 10})`); 

	//legend rectangles
	legend.selectAll("legend")
	.data(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])
	.enter().append("rect")
	.attr("x", (d, i) => i * 120)
	.attr("y", 0)
	.attr("width", 15)
	.attr("height", 15)
	.style("fill", d => color(d));

	//legend labels
	legend.selectAll("legend_label")
	.data(["North America", "Europe", "Japan", "Other"])
	.enter().append("text")
	.attr("x", (d, i) => 25 + i * 120)
	.attr("y", 10)
	.style("font-size", "12px")
	.text(d => d);



});