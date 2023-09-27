let scatterPlotChart;
let lineOfBestFitEnabled = false;

function validateMinMaxX(input, validationMessageId) {
  input.value = input.value.replace(/[^0-9,.\s-]/g, "");
  const [minXInput, maxXInput] = input.value
    .split(",")
    .map((val) => parseFloat(val.trim()));

  const validationMessage = document.getElementById(validationMessageId);

  if (!isNaN(minXInput) && !isNaN(maxXInput) && minXInput >= maxXInput) {
    validationMessage.textContent =
      "The min and max X values must not be equal, and min should be less than max. The correct format is (min,max)";
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

function validateMinMaxY(input, validationMessageId) {
  input.value = input.value.replace(/[^0-9,.\s-]/g, "");
  const [minYInput, maxYInput] = input.value
    .split(",")
    .map((val) => parseFloat(val.trim()));

  const validationMessage = document.getElementById(validationMessageId);

  if (!isNaN(minYInput) && !isNaN(maxYInput) && minYInput >= maxYInput) {
    validationMessage.textContent =
      "The min and max Y values must not be equal, and min should be less than max. The correct format is (min,max)";
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

function allowNumbersCommasAndParentheses(event) {
  const inputField = event.target;
  const inputValue = inputField.value;

  // Remove any characters that are not numbers, commas, periods (.), minus sign (-), or parentheses
  const filteredValue = inputValue.replace(/[^0-9,().-]/g, "");

  // Update the input field value with the filtered value
  inputField.value = filteredValue;
}

function toggleLineOfBestFit() {
  const checkbox = document.getElementById("toggleLineOfBestFit"); // Get the checkbox element
  lineOfBestFitEnabled = checkbox.checked; // Update the status

  // Re-generate the scatter plot based on the updated checkbox status
  generateScatterPlot();
}

const dataInput = document.getElementById("dataInput");
const xAxisRange = document.getElementById("xAxisRange");
const yAxisRange = document.getElementById("yAxisRange");

dataInput.addEventListener("input", allowNumbersCommasAndParentheses);
xAxisRange.addEventListener("input", allowNumbersAndCommas);
yAxisRange.addEventListener("input", allowNumbersAndCommas);

function removeLineOfBestFit() {
  // Remove the line of best fit
  if (scatterPlotChart) {
    scatterPlotChart.data.datasets = scatterPlotChart.data.datasets.filter(
      (dataset) => dataset.label !== "Line of Best Fit"
    );
    scatterPlotChart.update();
  }
}
function calculateLineEquation(dataPoints) {
  // Calculate the line of best fit (linear regression)
  const n = dataPoints.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (const point of dataPoints) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumX2 += point.x * point.x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Format the equation
  const equation = `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;

  return equation;
}

function generateScatterPlot() {
  // Get input values
  const dataInput = document.getElementById("dataInput").value;
  const dataPoints = parseDataInput(dataInput);

  const xAxisTitle = document.getElementById("xAxisTitle").value;
  const yAxisTitle = document.getElementById("yAxisTitle").value;
  const xAxisRange = document.getElementById("xAxisRange").value.split(",");
  const yAxisRange = document.getElementById("yAxisRange").value.split(",");
  const graphTitleInput = document.getElementById("graphTitle");
  const graphTitle = graphTitleInput.value || "Scatter Plot";

  // Extract minimum and maximum values for X and Y axes
  const minX = parseFloat(xAxisRange[0]);
  const maxX = parseFloat(xAxisRange[1]);
  const minY = parseFloat(yAxisRange[0]);
  const maxY = parseFloat(yAxisRange[1]);

  // Create a scatter plot dataset
  const dataset = {
    data: [],
    backgroundColor: "rgba(3, 94, 252, 1)",
    borderColor: "rgba(3, 94, 252, 1)",
    borderWidth: 1,
    pointRadius: 5,
    pointHoverRadius: 5,
    order: 2, // Set a lower order for dots
  };

  for (const point of dataPoints) {
    if (
      point.x >= minX &&
      point.x <= maxX &&
      point.y >= minY &&
      point.y <= maxY
    ) {
      dataset.data.push(point);
    }
  }

  // Create a line of best fit dataset
  const regressionData = calculateLineOfBestFit(dataset.data);
  const regressionDataset = lineOfBestFitEnabled
    ? {
      label: "Line of Best Fit",
      data: regressionData,
      type: "line",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 0,
      order: 1, // Set a higher order for the line of best fit
    }
    : null;

  // Calculate the equation of the line of best fit
  const equation = lineOfBestFitEnabled
    ? calculateLineEquation(regressionData)
    : "";

  const canvas = document.getElementById("scatterPlot");
  const ctx = canvas.getContext("2d");

  if (scatterPlotChart) {
    scatterPlotChart.destroy();
  }

  scatterPlotChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [dataset, regressionDataset].filter(Boolean),
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: xAxisTitle,
            font: {
              size: 16,
            },
          },
          ticks: {
            font: {
              size: 16,
            },
          },
          min: minX,
          max: maxX,
        },
        y: {
          title: {
            display: true,
            text: yAxisTitle,
            font: {
              size: 16,
            },
          },
          ticks: {
            font: {
              size: 16,
            },
          },
          min: minY,
          max: maxY,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        title: {
          display: true,
          text: graphTitle,
          font: {
            size: 24,
          },
        },
        // Add a custom text for the subtitle (equation of the line of best fit)
        subtitle: {
          display: true,
          text: lineOfBestFitEnabled ? `Line of Best Fit: ${equation}` : "",
          font: {
            size: 16,
          },
        },
      },
    },
  });
}

// Function to calculate the line of best fit
function calculateLineOfBestFit(dataPoints) {
  // Calculate the line of best fit (linear regression)
  const n = dataPoints.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (const point of dataPoints) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumX2 += point.x * point.x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Generate data points for the line of best fit
  const regressionData = [];
  for (const point of dataPoints) {
    const x = point.x;
    const y = slope * x + intercept;
    regressionData.push({ x, y });
  }

  return regressionData;
}

// Function to parse data input in the format "(x, y), (x, y), ..."
function parseDataInput(dataInput) {
  const dataPairs = dataInput.match(
    /\(\s*([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)\s*\)/g
  );
  if (!dataPairs) {
    return [];
  }
  return dataPairs.map((pair) => {
    const match = pair.match(
      /\(\s*([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)\s*\)/
    );
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    return { x, y };
  });
}
function resetScatterPlot() {
  // Clear input fields
  document.getElementById("dataInput").value = "";
  document.getElementById("xAxisRange").value = "";
  document.getElementById("yAxisRange").value = "";
  document.getElementById("xAxisTitle").value = "X Axis";
  document.getElementById("yAxisTitle").value = "Y Axis";
  document.getElementById("graphTitle").value = "Scatter Plot";
  document.getElementById("toggleLineOfBestFit").checked = false;

  // Remove the graph
  if (scatterPlotChart) {
    scatterPlotChart.destroy();
  }
}

function copyToClipboard() {
  const canvas = document.getElementById("scatterPlot");
  const graphTitle = document.getElementById("graphTitle").textContent; // Get the graph title
  const ctx = canvas.getContext("2d");

  // Create a temporary canvas with a white background
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height + 40; // Add extra space for the title
  const tempCtx = tempCanvas.getContext("2d");

  // Fill the temporary canvas with a white background
  tempCtx.fillStyle = "white";
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw the graph onto the temporary canvas
  tempCtx.drawImage(canvas, 0, 40); // Leave space for the title

  // Add the title to the temporary canvas
  tempCtx.fillStyle = "black";
  tempCtx.font = "bold 20px Arial";
  tempCtx.textAlign = "center";
  tempCtx.fillText(graphTitle, tempCanvas.width / 2, 20);

  // Copy the image data to the clipboard
  tempCanvas.toBlob((blob) => {
    const clipboardData = new ClipboardItem({ "image/png": blob });

    navigator.clipboard.write([clipboardData]);
  }, "image/png");
}

function downloadScatterPlot() {
  const canvas = document.getElementById("scatterPlot");
  const graphTitle = document.getElementById("graphTitle").textContent; // Get the graph title
  const ctx = canvas.getContext("2d");

  // Create a temporary canvas with a white background
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height + 40; // Add extra space for the title
  const tempCtx = tempCanvas.getContext("2d");

  // Fill the temporary canvas with a white background
  tempCtx.fillStyle = "white";
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw the graph onto the temporary canvas
  tempCtx.drawImage(canvas, 0, 40); // Leave space for the title

  // Add the title to the temporary canvas
  tempCtx.fillStyle = "black";
  tempCtx.font = "bold 20px Arial";
  tempCtx.textAlign = "center";
  tempCtx.fillText(graphTitle, tempCanvas.width / 2, 20);

  // Create a data URL for the combined image
  const downloadURL = tempCanvas.toDataURL("image/jpeg");

  // Create an anchor element for downloading
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadURL;
  downloadLink.download = "scatter_plot.jpg";
  downloadLink.click();
}
