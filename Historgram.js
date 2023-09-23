function resizeGraph() {
  // Get the current window dimensions
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  // Calculate the new dimensions for the graph
  const margin = { top: 40, right: 180, bottom: 40, left: 40 }; // Adjust the bottom margin
  const newWidth = window.innerWidth - margin.left - margin.right;
  const newHeight = screenHeight - margin.top - margin.bottom;

  // Update the graph within the container
  const svgContainer = d3.select("#histogramContainer");

  // Set the fixed height for the chart container
  svgContainer.style("height", newHeight + margin.top + margin.bottom + "px");

  // Select the SVG element and update its width and height
  const svg = d3.select("#histogram");
  svg.attr("width", newWidth + margin.left + margin.right);
  svg.attr("height", newHeight + margin.top + margin.bottom);
}

// Attach the resizeGraph function to the window's resize event
window.onresize = resizeGraph;

// Initial call to resize the graph when the page loads
resizeGraph();
let histogramData = null; // Store histogram data globally
let graphGenerated = false; // Flag to track if a graph is generated

function validateMinMaxX(input, validationMessageId) {
  input.value = input.value.replace(/[^0-9,.-]/g, "");
  const [minXInput, maxXInput] = input.value
    .split(",")
    .map((val) => val.trim());
  const validationMessage = document.getElementById(validationMessageId);

  if (!isNaN(minXInput) && !isNaN(maxXInput) && minXInput >= maxXInput) {
    validationMessage.textContent =
      "The min and max X values must not be equal, and min should be less than max.";
    validationMessage.style.display = "block";
    input.style.borderColor = "red";
    input.style.backgroundColor = "#ffeaea";
  } else {
    validationMessage.textContent = "";
    validationMessage.style.display = "none";
    input.style.borderColor = "";
    input.style.backgroundColor = "";
  }
}

function validateinput(input) {
  input.value = input.value.replace(/[^0-9,.-]/);
}

function generateOrUpdateHistogram() {
  if (graphGenerated) {
    // Reset the existing histogram
    resetHistogram();
  }

  // Get data input from the user
  const dataInput = document.getElementById("dataInput").value;
  const dataPoints = dataInput
    .split(",")
    .map((point) => parseFloat(point.trim()));

  // Get the user-specified maximum Y-axis value
  const maxYValueInput = document.getElementById("maxYValue").value;
  let maxYValue = null;

  if (maxYValueInput !== "") {
    maxYValue = parseFloat(maxYValueInput);
  }

  // Get the number of bins input
  const numBinsInput = document.getElementById("numBins");
  const numBins = parseInt(numBinsInput.value) || 10; // Default to 10 bins if not specified

  // Get the x-axis range input
  const xAxisRangeInput = document.getElementById("xAxisRange");
  const xAxisRange = xAxisRangeInput.value
    .split(",")
    .map((value) => parseFloat(value.trim()));

  // Get the Y-axis label input
  const yAxisLabelInput = document.getElementById("yAxisLabel");
  const yAxisLabel = yAxisLabelInput.value;

  // Get the X-axis label input
  const xAxisLabelInput = document.getElementById("xAxisLabel");
  const xAxisLabel = xAxisLabelInput.value;

  // Create a histogram
  const margin = { top: 40, right: 30, bottom: 120, left: 40 };
  const width = window.innerWidth - margin.left - margin.right;
  const height = window.innerHeight - margin.top - margin.bottom;

  // Get graph title input
  const graphTitleInput = document.getElementById("graphTitle");
  const graphTitle = graphTitleInput.value || "Histogram"; // Use "Histogram" if the user doesn't specify a title

  const svg = d3
    .select("#histogram")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain(xAxisRange).range([0, width]);

  const histogram = d3
    .histogram()
    .domain(x.domain())
    .thresholds(x.ticks(numBins))(dataPoints);

  // Adjust the Y-axis domain if a custom maxYValue is specified
  const y = d3
    .scaleLinear()
    .domain([0, maxYValue || d3.max(histogram, (d) => d.length)])
    .nice()
    .range([height, 0]);

  svg
    .selectAll(".histogram-bar")
    .data(histogram)
    .enter()
    .append("rect")
    .attr("class", "histogram-bar")
    .attr("x", (d) => x(d.x0))
    .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
    .attr("y", (d) => y(d.length))
    .attr("height", (d) => height - y(d.length));

  // Add the graph title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2) // Adjust the y-coordinate for the title
    .attr("text-anchor", "middle")
    .style("font-size", "18px") // Adjust font size as needed
    .text(graphTitle);

  // Add X and Y axis labels
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(10));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 35) // Adjust the y-coordinate to place it inside the SVG
    .attr("text-anchor", "middle")
    .text(xAxisLabel || "X-axis");

  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left - 4) // Adjust the y-coordinate to move the title left by 10 pixels
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(yAxisLabel || "Y-axis");

  graphGenerated = true; // Set the flag to indicate that a graph is generated
}

function resetHistogram() {
  // Clear the existing histogram
  d3.select("#histogram").selectAll("*").remove();

  const svgElement = document.getElementById("histogram");
  while (svgElement.firstChild) {
    svgElement.removeChild(svgElement.firstChild);
  }

  // Clear the stored histogram data
  histogramData = null;
  graphGenerated = false; // Reset the flag
}

// Function to copy the histogram as a JPEG image
function copyToClipboard() {
  const svgElement = document.getElementById("histogram");

  // Create a new clone of the SVG element
  const svgClone = svgElement.cloneNode(true);

  // Set background color to white
  svgClone.style.backgroundColor = "white";

  // Create a new canvas element
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set canvas dimensions
  canvas.width = svgElement.clientWidth;
  canvas.height = svgElement.clientHeight;

  // Create a data URL from the SVG
  const svgData = new XMLSerializer().serializeToString(svgClone);
  const img = new Image();

  img.onload = function () {
    // Draw the SVG image onto the canvas
    context.drawImage(img, 0, 0);

    // Convert the canvas to a data URL as JPEG
    const dataUrl = canvas.toDataURL("image/jpeg");

    // Create a temporary container element to hold the image
    const container = document.createElement("div");
    const imgElement = document.createElement("img");

    imgElement.src = dataUrl;
    container.appendChild(imgElement);

    // Copy the container content to the clipboard
    document.body.appendChild(container);
    const range = document.createRange();
    range.selectNode(container);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    document.body.removeChild(container);
  };

  img.src = "data:image/svg+xml;base64," + btoa(svgData);
}

// Function to download the histogram as a JPEG image
function downloadHistogram() {
  const svgElement = document.getElementById("histogram");

  // Create a new clone of the SVG element
  const svgClone = svgElement.cloneNode(true);

  // Set background color to white
  svgClone.style.backgroundColor = "white";

  // Create a new canvas element and context
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set canvas dimensions
  canvas.width = svgElement.clientWidth;
  canvas.height = svgElement.clientHeight;

  // Create a data URL from the SVG
  const svgData = new XMLSerializer().serializeToString(svgClone);
  const img = new Image();

  img.onload = function () {
    // Draw the SVG image onto the canvas
    context.drawImage(img, 0, 0);

    // Convert the canvas to a data URL as JPEG
    const dataUrl = canvas.toDataURL("image/jpeg");

    // Create a new anchor element to trigger the download
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = "histogram.jpg";

    // Simulate a click on the anchor to start the download
    anchor.click();
  };

  img.src = "data:image/svg+xml;base64," + btoa(svgData);
}
