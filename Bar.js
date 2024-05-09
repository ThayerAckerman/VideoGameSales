class Bar {
    constructor() {
        this.render({"regions":["North America", "Europe", "Japan", "Other"]});
    }

    render({regions}) {
        var keys = []
        var regionalSales = {"North America":"NA_Sales", "Europe":"EU_Sales", "Japan":"JP_Sales", "Other":"Other_Sales"}
        if (regions) {
            for (let region of regions) {
                keys.push(regionalSales[region]);
            }
        }
        // Set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 50, left: 120 };
        var width = 600 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        // Append the svg page body
        d3.select("#bar").selectAll("*").remove();
        var svg = d3.select("#bar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 40) 
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top + 20})`); 


        // Read the CSV data
        d3.csv("Video_Games.csv").then(function(data) {

        // Group the data by platform
        var groupedData = Array.from(d3.group(data, d => d.Platform), ([key, values]) => ({ platform: key, sales: values }));

        // Calculate the sum of sales for each region for each platform
        var salesByRegion = groupedData.map(platform => {
            var sales = platform.sales.reduce((acc, curr) => {
            acc.NA_Sales += parseFloat(curr.NA_Sales);
            acc.EU_Sales += parseFloat(curr.EU_Sales);
            acc.JP_Sales += parseFloat(curr.JP_Sales);
            acc.Other_Sales += parseFloat(curr.Other_Sales);
            return acc;
            }, { NA_Sales: 0, EU_Sales: 0, JP_Sales: 0, Other_Sales: 0 });
            return { platform: platform.platform, ...sales };
        });

        //   console.log(sales);

        // Stack the data
        var stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
        var stackedData = stack(salesByRegion);

        var maxSales = Math.min(d3.max(salesByRegion, d => d3.sum(Object.values(d))), 1400);
        var x = d3.scaleLinear()
        .domain([0, maxSales])
        .range([0, width]);

        //X-axis
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .attr("stroke", "lightgray")
            .call(d3.axisBottom(x));

        //Y-axis
        var y = d3.scaleBand()
            .domain(salesByRegion.map(d => d.platform))
            .range([0, height])
            .padding(0.1);
        svg.append("g")
            .attr("stroke", "lightgray")
            .call(d3.axisLeft(y));

        //Color palette
        var color = d3.scaleOrdinal()
            .domain(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])
            // .range(['#003f5c', '#665191', '#a05195', '#d45087']);
            .range(['#ed5555', '#b4c468', '#b8a7ea', '#b7e0dc']);

        // Create a tooltip
            // var tooltip = d3.select("#bar").append("div")
            // .attr("class", "tooltip")
            // .style("opacity", 0);

            console.log(stackedData);
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
            .attr("opacity", 0.8)
            .attr("class", "bar")
            .attr("y", d => y(d.data.platform))
            .attr("height", y.bandwidth())
            .attr("x", d => x(d[0]))
            .attr("width", d => x(d[1]) - x(d[0]))
            // Tooltip interaction
            .on("mouseover", function(e, d) {
                ToolTip.addText(e, [`Platform: ${d.data.platform}`, `Region: ${d3.select(this.parentNode).datum().key.split("_")[0]}`, `Sales: $${(d[1]-d[0]).toFixed(3)} million`]);
                d3.select(this).style("opacity", 1);
            })
            .on("mouseout", function(){
                  ToolTip.hide();
                  d3.select(this).style("opacity", 0.8);
            });
            // .on("mouseover", function(event, d) {
            //     var sales = d[1] - d[0];
            //     var region = d3.select(this.parentNode).datum().key.split("_")[0]; // Get region from key
            //     tooltip.transition()
            //     .duration(200)
            //     .style("opacity", .9);
            //     tooltip.html(`<strong>Sales:</strong> ${sales.toFixed(2)}<br><strong>Region:</strong> ${region}`) // display the number of sales
            //     .style("left", (event.pageX) + "px")
            //     .style("top", (event.pageY - 28) + "px");
            // })
            // .on("mouseout", function(d) {
            //     tooltip.transition()
            //     .duration(500)
            //     .style("opacity", 0);
            // });

            //chart title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -margin.top / 2)
                .attr("text-anchor", "middle")
                .attr("fill", "lightgray")
                .text("Sales by Platform and Region");

                //x-axis label
            svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom / 2 + 10})`) 
            .attr("text-anchor", "middle")
            .attr("fill", "lightgray")
            .text("Sales");

            //color legend
            var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(0, ${height + margin.bottom - 10})`); 

            // //legend rectangles
            // legend.selectAll("legend")
            // .data(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])
            // .enter().append("rect")
            // .attr("x", (d, i) => i * 120)
            // .attr("y", 0)
            // .attr("width", 15)
            // .attr("height", 15)
            // .style("fill", d => color(d));

            // //legend labels
            // legend.selectAll("legend_label")
            // .data(["North America", "Europe", "Japan", "Other"])
            // .enter().append("text")
            // .attr("x", (d, i) => 25 + i * 120)
            // .attr("y", 10)
            // .style("font-size", "12px")
            // .text(d => d);



        });
    }
}