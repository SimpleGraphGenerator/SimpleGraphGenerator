let chartInstance = null; // Declare a variable to store the chart instance
// Array to store data points for each line
const lineDataPoints = [];

function addNewInputField() {
  const dataInputContainer = document.getElementById("dataInputContainer");
  // Create a new input element
  const newInput = document.createElement("input");
  newInput.className = "input-field";
  newInput.type = "text";
  newInput.placeholder = "(0, 1), (4, 1)";
  // Append the new input element to the container
  dataInputContainer.appendChild(newInput);
  // Add the input element to the array of data points
  lineDataPoints.push(newInput);
}

function generateLineGraph() {
  // Check if there is an existing chart instance and destroy it
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Get user input values
  const xRangeInput = document.getElementById("xRange").value;
  const yRangeInput = document.getElementById("yRange").value;

  // Split the input values into min and max values
  const [minX, maxX] = xRangeInput.split(",").map(parseFloat);
  const [minY, maxY] = yRangeInput.split(",").map(parseFloat);

  // Get other chart customization values
  const lineGraphTitle = document.getElementById("lineGraphTitle").value;
  const xAxisTitle = document.getElementById("xAxisTitle").value;
  const yAxisTitle = document.getElementById("yAxisTitle").value;

  // Create a context for the line graph
  const ctx = document.getElementById("lineGraph").getContext("2d");

  // Create an array to hold datasets for each line
  const datasets = [];

  // Process data points for each line
  lineDataPoints.forEach((input) => {
    const dataInput = input.value;

    // Parse data input into an array of (x, y) pairs
    const dataPoints = dataInput.match(/\(([^,]+),([^)]+)\)/g).map((point) => {
      const [x, y] = point.replace("(", "").replace(")", "").split(",");
      return { x: parseFloat(x), y: parseFloat(y) };
    });

    // Sort dataPoints by x values for correct order in the graph
    dataPoints.sort((a, b) => a.x - b.x);

    // Generate a random color for this line
    const randomColor = generateRandomColor();

    // Add a new dataset for this line
    datasets.push({
      data: dataPoints, // Use the dataPoints array directly
      label: lineGraphTitle, // You can customize this label
      borderColor: randomColor, // Apply random colors
      fill: false,
    });
  });

  // Create the line graph using Chart.js with multiple datasets
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: datasets[0].data.map((point) => point.x), // X-axis labels from the first dataset
      datasets: datasets,
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          min: minX,
          max: maxX,
          title: {
            display: true,
            text: xAxisTitle || "X Axis",
            font: {
              size: 16,
            },
          },
          ticks: {
            font: {
              size: 16,
            },
          },
        },
        y: {
          type: "linear",
          position: "left",
          min: minY,
          max: maxY,
          title: {
            display: true,
            text: yAxisTitle || "Y Axis",
            font: {
              size: 16,
            },
          },
          ticks: {
            font: {
              size: 16,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Show the legend
        },
        tooltip: {
          enabled: true, // Enable tooltips
        },
        title: {
          display: true,
          text: lineGraphTitle || "Line Graph", // Set the title dynamically
          font: {
            size: 20,
          },
        },
      },
    },
  });
}

// Function to reset the line graph
function resetLineGraph() {
  // Clear the chart
  const ctx = document.getElementById("lineGraph").getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Clear the input values
  document.getElementById("minX").value = "";
  document.getElementById("maxX").value = "";
  document.getElementById("minY").value = "";
  document.getElementById("maxY").value = "";

  // Clear the data input fields
  const dataInputContainer = document.getElementById("dataInputContainer");
  dataInputContainer.innerHTML = "";

  // Clear the line data points array
  lineDataPoints.length = 0;
}

function addNewInputField() {
  const dataInputContainer = document.getElementById("dataInputContainer");

  // Create a new input element
  const newInput = document.createElement("input");
  newInput.className = "input-field";
  newInput.type = "text";
  newInput.placeholder = "(0, 1), (4, 1)";

  // Append the new input element to the container
  dataInputContainer.appendChild(newInput);

  // Add the input element to the array of data points
  lineDataPoints.push(newInput);
}

// Function to add the original input field
function addOriginalInputField() {
  const dataInputContainer = document.getElementById("dataInputContainer");

  // Create the original input element
  const originalInput = document.createElement("input");
  originalInput.className = "input-field";
  originalInput.type = "text";
  originalInput.id = "dataInput"; // Set the same ID as the original input
  originalInput.placeholder = "(0, 1), (4, 1)";

  // Append the original input element to the container
  dataInputContainer.appendChild(originalInput);

  // Add the input element to the array of data points
  lineDataPoints.push(originalInput);
}

// Call the function to add the original input field when the page loads
addOriginalInputField();

function generateRandomColor() {
  // Generate random RGB values in the range (200, 255)
  const r = Math.floor(Math.random() * 56) + 100;
  const g = Math.floor(Math.random() * 56) + 100;
  const b = Math.floor(Math.random() * 56) + 100;
  return `rgb(${r},${g},${b})`;
}

// Function to copy the graph image to the clipboard
function copyToClipboard() {
  const originalCanvas = document.getElementById("lineGraph");
  const whiteBackgroundCanvas = document.createElement("canvas");
  whiteBackgroundCanvas.width = originalCanvas.width;
  whiteBackgroundCanvas.height = originalCanvas.height;
  const ctx = whiteBackgroundCanvas.getContext("2d");

  // Fill the canvas with a white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, whiteBackgroundCanvas.width, whiteBackgroundCanvas.height);

  // Draw the graph on the white background canvas
  ctx.drawImage(originalCanvas, 0, 0);

  whiteBackgroundCanvas.toBlob((blob) => {
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]).then(() => {});
  });
}

// Function to download the graph image with a white background as a JPEG file
function downloadLineGraph() {
  const originalCanvas = document.getElementById("lineGraph");
  const whiteBackgroundCanvas = document.createElement("canvas");
  whiteBackgroundCanvas.width = originalCanvas.width;
  whiteBackgroundCanvas.height = originalCanvas.height;
  const ctx = whiteBackgroundCanvas.getContext("2d");

  // Fill the canvas with a white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, whiteBackgroundCanvas.width, whiteBackgroundCanvas.height);

  // Draw the graph on the white background canvas
  ctx.drawImage(originalCanvas, 0, 0);

  // Convert the white background canvas to a JPEG image
  const jpegDataURL = whiteBackgroundCanvas.toDataURL("image/jpeg");

  // Create a download link and trigger the download
  const link = document.createElement("a");
  link.href = jpegDataURL;
  link.download = "line_graph.jpg";
  link.click();
}

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

// Function for Y-axis validation (similar to X-axis validation)
function validateMinMaxY(input, validationMessageId) {
  input.value = input.value.replace(/[^0-9,.-]/g, "");
  const [minYInput, maxYInput] = input.value
    .split(",")
    .map((val) => val.trim());
  const validationMessage = document.getElementById(validationMessageId);

  if (!isNaN(minYInput) && !isNaN(maxYInput) && minYInput >= maxYInput) {
    validationMessage.textContent =
      "The min and max Y values must not be equal, and min should be less than max.";
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

function validateDataInput(input) {
  input.value = input.value.replace(/[^0-9,.-]/g, "");
}
