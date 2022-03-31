let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const w = 1200;
const h = 700;
const padding = 50;

//my heat map container
const svg = d3.select("#dataviz").
append("svg").
attr("width", w).
attr("height", h);

//API call here
d3.json(url).
then(dataset => {

  //all the variables I need
  const baseTemp = dataset["baseTemperature"];
  const monthlyVar = dataset["monthlyVariance"];
  const year = monthlyVar.map(d => d["year"]);
  const month = monthlyVar.map(d => d["month"]);
  const variance = monthlyVar.map(d => d["variance"]);

  //used a switch to get the right string on y axis
  const formatMonth = month => {
    switch (month) {
      case 1:
        return "January";
        break;
      case 2:
        return "February";
        break;
      case 3:
        return "March";
        break;
      case 4:
        return "April";
        break;
      case 5:
        return "May";
        break;
      case 6:
        return "June";
        break;
      case 7:
        return "July";
        break;
      case 8:
        return "August";
        break;
      case 9:
        return "September";
        break;
      case 10:
        return "October";
        break;
      case 11:
        return "November";
        break;
      default:
        return "December";}
    ;
  };

  //my tooltip
  let tooltip = d3.select("body").
  append("div").
  attr("id", "tooltip");

  //scaleBand() needs an array as domain. You get to use bandwidth() to automatically set width AND height ! I love you bandwidth() <3
  //x axis
  const xScale = d3.scaleBand().
  domain(year).
  range([padding, w - padding]).
  paddingInner([0.1]).
  paddingOuter([0.1]);


  //xAxis needed a filter to display less years on its axis.
  const xAxis = d3.axisBottom(xScale).
  tickValues(xScale.domain().filter((d, i) => !(i % 10)));

  //need to append "g"s in order to display x & y axes, don't forget to call them too
  svg.append("g").
  call(xAxis).
  attr("id", "x-axis").
  attr("transform", "translate(0," + (h - padding) + ")");

  //y axis
  const yScale = d3.scaleBand().
  domain(month).
  range([h - padding, padding]).
  paddingInner([0.01]);

  const yAxis = d3.axisLeft(yScale).
  tickFormat(formatMonth);

  svg.append("g").
  call(yAxis).
  attr("id", "y-axis").
  attr("transform", "translate(50, 0)");

  //all the 3153 rectangles inside the heat map
  svg.selectAll("rect").
  data(monthlyVar).
  enter().
  append("rect").
  attr("width", d => xScale.bandwidth(d["year"])).
  attr("height", d => yScale.bandwidth(d["month"])).
  attr("class", "cell").
  attr("x", d => xScale(d["year"])).
  attr("y", d => yScale(d["month"])).
  attr("data-month", d => d["month"] -= 1).
  attr("data-year", d => d["year"]).
  attr("data-temp", d => baseTemp + d["variance"])
  //min variance -6.976 | max : 5.228
  .attr("fill", d => {
    let variance = d['variance'];
    if (variance <= -4) {
      return "#54CDF5";
    } else if (variance <= -2) {
      return "#2287A8";
    } else if (variance <= 0) {
      return "#F2C76F";
    } else if (variance <= 2) {
      return "#F2A66F";
    } else {
      return "#E87666";
    }
  }).
  on("mouseover", (event, d) => tooltip.
  transition().
  style("opacity", 1).
  style("cursor", "default").
  style("left", event.pageX + "px").
  style("top", event.pageY - 80 + "px").
  attr("data-year", d["year"]).
  text(() => formatMonth(d["month"]) + " " + d["year"] + ", Variance: " + d["variance"])).
  on("mouseout", () => tooltip.style("opacity", 0));

  //legend part
  let legendBox = svg.append("g").
  attr("id", "legend");

  let legend = legendBox.selectAll("#legend").
  data(variance).
  enter().
  append("g");

  legend.append("rect").
  attr("x", w - 35).
  attr("y", 150).
  attr("width", 20).
  attr("height", 15).
  style("fill", "#54CDF5").
  append("title").
  text("Light blue is for when variance is less than -4 degrees");

  legend.append("rect").
  attr("x", w - 35).
  attr("y", 135).
  attr("width", 20).
  attr("height", 15).
  style("fill", "#2287A8").
  append("title").
  text("Navy is for when variance is less than -2 and more than -4 degrees");

  legend.append("rect").
  attr("x", w - 35).
  attr("y", 120).
  attr("width", 20).
  attr("height", 15).
  style("fill", "#F2C76F").
  append("title").
  text("Yellow is for when variance is less than 0 and more than -2 degrees");

  legend.append("rect").
  attr("x", w - 35).
  attr("y", 105).
  attr("width", 20).
  attr("height", 15).
  style("fill", "#F2A66F").
  append("title").
  text("Orange is for when variance is more than 0 and less than 2 degrees");

  legend.append("rect").
  attr("x", w - 35).
  attr("y", 90).
  attr("width", 20).
  attr("height", 15).
  style("fill", "#E87666").
  append("title").
  text("Red is for when variance is more than 2 degrees");

  legend.append("text").
  attr("x", w - 45).
  attr("y", 75).
  text("Legend").
  attr("font-size", 12).
  attr("letter-spacing", 0.4);
});