
function type(d, yKey) {
  d[yKey] = +d[yKey];
  return d;
}

function drawHelper (data, x, xAxis, y, yAxis, svg, margin, height, width, tip) {
  console.log(data);
  let xKey = 'skill';
  let yKey = 'proficiency';
  let title = "Proficiency vs. Skills";

  x.domain(data.map(function(d) { return d[xKey]; }));
  y.domain([0, d3.max(data, function(d) { return d[yKey]; })]);

  svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("text")
    .attr("class", "axisText")
    .attr("transform",
      "translate(" + (width/2) + " ," +
                     (height + margin.top - 8) + ")")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .text(xKey);

  svg.append("text")
    .attr("class", "titleText")
    .attr("transform",
      "translate(" + (width/2) + " ," +
                     -7 + ")")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "large")
    .style("fill", "white")
    .text(title);

  svg.append("g")
    .attr("class", "yAxis")
    .call(yAxis);

  svg.append("text")
    .attr("class", "axisText")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "0.9em")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .text(yKey);

  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "barCol")
      .attr("x", function(d) { return x(d[xKey]); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d[yKey]); })
      .attr("height", function(d) { return height - y(d[yKey]); })
      .style("cursor", "pointer")
      .on("mouseover", (d, i, elem) => {
        tip
          .transition()
          .duration(100)
          .style("opacity", 0.9);

        tip
          .html("<strong>"+yKey+":</strong> <span style='color:#ff073a'>" + d[yKey] + "</span>")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 1000 + "px");
      })
      .on("mouseout", () => {
        tip
          .transition()
          .duration(400)
          .style("opacity", 0);
      });
}

function drawChart() {
  var dataFile = './js/data.csv';
  var margin = {top: 40, right: 20, bottom: 40, left: 70},
      width = 520 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

  var y = d3.scaleLinear()
      .range([height, 0]);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);

  const tip = d3
    .select("#skills")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var svg = d3.select("#skills").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("style", "background-color: #1B1C1D;")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(dataFile)
    .then((data) => drawHelper(data, x, xAxis, y, yAxis, svg, margin, height, width, tip));
}
