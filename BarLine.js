// set the dimensions and margins of the graph
var margin = {top: 15, right: 50, bottom: 50, left: 50},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#barline")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("Video_Games.csv").then(data => {

    var globalGameSales = {};
    var naGameSales = {};
    var euGameSales = {};
    var jpGameSales = {};
    var otherGameSales = {};
    var criticScores = {};
    var userScores = {};

    for (var j = 0; j < data.length; j++){
      if (data[j].Year_of_Release == "") continue;
      else {
        const year = parseInt(data[j].Year_of_Release);

        if (!isNaN(parseFloat(data[j].Critic_Score)) && !isNaN(parseFloat(data[j].User_Score))) {
          if (year in criticScores && year in userScores) {
            criticScores[year] = (criticScores[year] + parseFloat(data[j].Critic_Score)) / 2;
            userScores[year] = (userScores[year] + parseFloat(data[j].User_Score)) / 2;
          }
          else {
              criticScores[year] = parseFloat(data[j].Critic_Score);
              userScores[year] = parseFloat(data[j].User_Score);
            }
        }
        
        if (year in globalGameSales) globalGameSales[year] += parseFloat(data[j].Global_Sales);
        else globalGameSales[year] = parseFloat(data[j].Global_Sales);

        if (year in naGameSales) naGameSales[year] += parseFloat(data[j].NA_Sales);
        else naGameSales[year] = parseFloat(data[j].NA_Sales);

        if (year in euGameSales) euGameSales[year] += parseFloat(data[j].EU_Sales);
        else euGameSales[year] = parseFloat(data[j].EU_Sales);

        if (year in jpGameSales) jpGameSales[year] += parseFloat(data[j].JP_Sales);
        else jpGameSales[year] = parseFloat(data[j].JP_Sales);

        if (year in otherGameSales) otherGameSales[year] += parseFloat(data[j].Other_Sales);
        else otherGameSales[year] = parseFloat(data[j].Other_Sales);
      }
    }

    // Convert data to array of objects
  const scores = Object.keys(userScores).map(year => ({
    year: parseInt(year),
    userScore: userScores[year]*10,
    criticScore: criticScores[year]
  }));

    const years = Object.keys(globalGameSales).map(str => parseInt(str));
    const sales = Object.values(globalGameSales);

    const gameSalesObject = years.reduce((obj, key, index) => {
      obj[key] = sales[index];
      return obj;
    }, {});

    const gameSalesArray = Object.entries(gameSalesObject);

    // Add X axis
    var x = d3.scaleLinear()
      .domain([d3.min(years), d3.max(years)])
      .range([ 0, width ]);
    svg.append("g")
      .attr("stroke", "lightgray")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    svg.append("text")
      .attr("fill", "lightgray")
      .attr("class", "y label")
      .attr("dy", ".75em")
      .attr("transform", "translate( " +  width/2.5 + "," + (height+25) + ")")
      .text("Release (year)");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(sales)])
      .range([ height, 0 ]);
    svg.append("g")
      .attr("stroke", "lightgray")
      .call(d3.axisLeft(y));
    svg.append("text")
      .attr("fill", "lightgray")
      .attr("class", "y label")
      .attr("dy", ".75em")
      .attr("transform", "translate( -50," + height/1.5 + ")" + "rotate(-90)")
      .text("Games Sales (millions)");

    
    console.log(scores);
    // Add Y axis
    var y2 = d3.scaleLinear()
      .domain([0, 200])
      .range([height, 0]);
    svg.append("g")
      .attr("transform", "translate(" + width + ",0)")
      .attr("stroke", "lightgray")
      .call(d3.axisRight(y2));
    svg.append("text")
      .attr("fill", "lightgray")
      .attr("class", "y label")
      .attr("dy", ".75em")
      .attr("transform", "translate( " + (width-25) + "," + height/1.5 + ")" + "rotate(-90)")
      .text("Scores (0-100)");

    // Draw stacked bars
    const barWidth = width / scores.length; // Calculate the width of each bar
    const barGroups = svg.selectAll(".bar-group")
    .data(scores)
    .enter()
    .append("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(${x(d.year)},0)`);

    barGroups.append("rect")
    .attr("class", "user-bar")
    .attr("x", -barWidth / 4) // Set x position for user bars
    .attr("y", d => y2(d.userScore))
    .attr("width", barWidth / 2) // Set the width of user bars
    .attr("height", d => height - y2(d.userScore))
    .attr("fill", "#9084b5");

    barGroups.append("rect")
    .attr("class", "critic-bar")
    .attr("x", -barWidth / 4) // Set x position for critic bars
    .attr("y", d => y2(d.userScore + d.criticScore))
    .attr("width", barWidth / 2) // Set the width of critic bars
    .attr("height", d => height - y2(d.criticScore))
    .attr("fill", "#84a7b5");

    console.log(gameSalesArray);
    // Add the line
    svg.append("path")
      .datum(gameSalesArray) // Use the array of key-value pairs
      .attr("fill", "none")
      .attr("stroke", "#ffdede")
      .attr("stroke-width", 8)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]); }) // Accessing the year from the key
        .y(function(d) { return y(d[1]); }) // Accessing the sales from the value
      );
    
})