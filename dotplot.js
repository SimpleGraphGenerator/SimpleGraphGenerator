function goToGraph(graphURL) {
  window.location.href = graphURL;
}

let dotPlotChart;

function validateDot(input) {
  input.value = input.value.replace(/[^0-9,.-]/g, "");
}

function validateMinMaxX(input) {
  input.value = input.value.replace(/[^0-9,.-]/g, "");
}
function validateDataInput(event) {
  // Get the pressed key from the event
  const keyPressed = event.key;

  // Define the allowed keys (numbers and commas)
  const allowedKeys = /^[0-9,]$/;

  // Check if the pressed key is allowed
  if (!allowedKeys.test(keyPressed)) {
    // Prevent the keypress if it's not allowed
    event.preventDefault();
  }
}

function validateDataInput(input) {
  input.value = input.value.replace(/[^0-9,.-]/g, "");
}

function validateMinMaxX(input) {
  input.value = input.value.replace(/[^0-9,.-]/g, "");

  const [minXInput, maxXInput] = input.value
    .split(",")
    .map((val) => val.trim());
  const validationMessage = document.getElementById("validationMessage");

  if (!isNaN(minXInput) && !isNaN(maxXInput) && minXInput >= maxXInput) {
    validationMessage.textContent =
      "The min and max X values must not be equal numbers, and min should be less than max.";
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

function updateDotRadius() {
  const dot = document.getElementById("dot");
  const windowWidth = window.innerWidth;

  if (windowWidth < 769) {
    // Set a small radius when the window width is less than 769
    dot.style.width = "50px";
    dot.style.height = "50px";
  } else if (windowWidth < 1000) {
    // Set a different radius when the window width is less than 1000
    dot.style.width = "75px";
    dot.style.height = "75px";
  } else {
    // Default radius for larger window sizes
    dot.style.width = "100px";
    dot.style.height = "100px";
  }
}
window.addEventListener("resize", adjustDotRadius);
adjustDotRadius();

function generateDotPlot() {
  let dataInput = document.getElementById("dataInput").value;
  dataInput = dataInput.replace(/,+$/, ""); // Remove trailing commas

  const dataPoints = dataInput
    .split(",")
    .map((point) => parseFloat(point.trim()));

  const minMaxXInput = document.getElementById("minMaxX").value;
  const [minXInput, maxXInput] = minMaxXInput
    .split(",")
    .map((val) => val.trim());

  // Parse minimum and maximum x values
  let minX, maxX;

  if (minXInput === "") {
    minX = Math.min(...dataPoints) - 1;
  } else {
    minX = parseFloat(minXInput);
  }

  if (maxXInput === "") {
    maxX = Math.max(...dataPoints) + 1;
  } else {
    maxX = parseFloat(maxXInput);
  }

  // If both min and max are still not provided, calculate from data
  if (isNaN(minX) && isNaN(maxX)) {
    minX = Math.min(...dataPoints) - 1;
    maxX = Math.max(...dataPoints) + 1;
  } else if (isNaN(minX)) {
    minX = Math.min(...dataPoints);
  } else if (isNaN(maxX)) {
    maxX = Math.max(...dataPoints) + 1; // Set max x to largest data point + 1
  }

  // Count the frequency of data points
  const frequencyData = {};
  dataPoints.forEach((value) => {
    if (!frequencyData[value]) {
      frequencyData[value] = 1;
    } else {
      frequencyData[value]++;
    }
  });

  // Check if there is a data point with a frequency greater than 27
  let adjustDotRadius = false;
  let repeatCount = 0; // Initialize repeatCount
  Object.values(frequencyData).forEach((frequency) => {
    if (frequency > 27) {
      adjustDotRadius = true;
      repeatCount = frequency; // Store the repeat count
    }
  });

  // Determine the dot radius based on whether adjustment is needed
  let dotRadius = 1;
  const screenWidth = window.screen.width;

  if (adjustDotRadius) {
    if (repeatCount >= 36) {
      dotRadius = 0.6; // Reduce dot radius to 60%
    }
    if (repeatCount >= 50) {
      dotRadius = 0.4; // Reduce dot radius to 40%
    }
    if (screenWidth <= 1000) {
      dotRadius = 0.1; // Reduce dot radius to 10% for small screens
    } else {
      dotRadius = 0.8; // Reduce dot radius to 80% for larger screens
    }
  }

  const dotLabel = document.getElementById("dotLabel").value;
  const backgroundColor = document.getElementById("backgroundColor").value;
  const textColor = document.getElementById("textColor").value;

  const canvas = document.getElementById("dotPlot");
  const ctx = canvas.getContext("2d");

  if (dotPlotChart) {
    dotPlotChart.destroy();
  }

  const labels = Object.keys(frequencyData).map(parseFloat);
  const data = labels.map((value) => ({
    x: value,
    y: frequencyData[value],
  }));

  const filteredData = data.filter(
    (point) => point.x >= minX && point.x <= maxX
  );

  const renderedDots = [];
  for (const point of filteredData) {
    const numDots = Math.abs(point.y);
    for (let i = 0; i < numDots; i++) {
      renderedDots.push({ x: point.x, y: i });
    }
  }

  // Determine the y-axis range based on the data
  let minY = Math.min(...filteredData.map((point) => point.y));
  let maxY = Math.max(...filteredData.map((point) => point.y));

  // Adjust the minY and maxY to ensure the lowest y-value dot is spaced correctly
  if (minY >= 0) {
    minY = -0.5;
    maxY = maxY + 7.5;
  } else {
    minY = minY - 10;
    maxY = maxY + 0.5;
  }

  const xAxisTitle = document.getElementById("xAxisTitle").value;

  dotPlotChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: dotLabel,
          data: renderedDots,
          borderColor: backgroundColor,
          backgroundColor: backgroundColor,
          pointRadius: 5 * dotRadius, // Adjust dot radius
          pointHoverRadius: 8 * dotRadius, // Adjust hover dot radius
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          min: minX,
          max: maxX,
          grid: {
            display: false,
            color: textColor, // Apply text color to the grid lines
          },
          ticks: {
            color: textColor, // Apply text color to the x-axis numbers
            font: {
              size: 16,
            },
          },
          title: {
            display: true,
            text: xAxisTitle,
            color: textColor, // Apply text color to the x-axis title
            font: {
              size: 24,
            },
          },
        },
        y: {
          min: minY, // Adjust y-axis range for spacing
          max: maxY,
          display: false,
          grid: { display: false }, // Remove vertical grid lines
        },
      },
      plugins: {
        legend: {
          display: true, // Show legend
          position: "top", // Position legend on top
          labels: {
            boxWidth: 0, // Remove box around legend label
            color: textColor, // Apply text color to legend labels
            font: {
              size: 24,
            },
          },
        },
        tooltip: {
          enabled: false, // Disable tooltip
        },
      },
      elements: {
        point: {
          backgroundColor: textColor, // Apply text color to the dots
          borderColor: textColor, // Apply text color to the dot borders
        },
      },
    },
  });

  // Apply custom text color to chart elements using CSS
  const chartContainer = canvas.closest(".chart-container");
  if (chartContainer) {
    chartContainer.style.color = textColor;
  }
}

function resetDotPlot() {
  if (dotPlotChart) {
    dotPlotChart.destroy();
    document.getElementById("dataInput").value = "";
    document.getElementById("minX").value = "";
    document.getElementById("maxX").value = "";
    document.getElementById("dotLabel").value = "Dot graph"; // Reset label
    document.getElementById("xAxisTitle").value = "X Axis Title"; // Reset x-axis title
    document.getElementById("backgroundColor").value = "#808080";
    document.getElementById("textColor").value = "#808080"; // Reset text color
  }
}

function copyToClipboard() {
  if (dotPlotChart) {
    const canvas = document.getElementById("dotPlot");

    // Create a new canvas with a white background
    const copyCanvas = document.createElement("canvas");
    copyCanvas.width = canvas.width;
    copyCanvas.height = canvas.height;
    const copyCtx = copyCanvas.getContext("2d");
    copyCtx.fillStyle = "white"; // Set background color to white
    copyCtx.fillRect(0, 0, copyCanvas.width, copyCanvas.height);

    // Temporarily change the background color to white before rendering the image
    const originalBackgroundColor =
      dotPlotChart.config.data.datasets[0].backgroundColor;
    dotPlotChart.config.data.datasets[0].backgroundColor = "white";
    dotPlotChart.update();

    // Draw the dot plot on the new canvas
    copyCtx.drawImage(canvas, 0, 0);

    // Restore the original background color
    dotPlotChart.config.data.datasets[0].backgroundColor =
      originalBackgroundColor;
    dotPlotChart.update();

    // Convert the new canvas to an image data URL
    const dataUrl = copyCanvas.toDataURL("image/png");

    // Create an image element and set its source to the data URL
    const img = new Image();
    img.src = dataUrl;

    // Create a temporary container element to hold the image
    const container = document.createElement("div");
    container.appendChild(img);

    // Copy the container content to the clipboard
    document.body.appendChild(container);
    const range = document.createRange();
    range.selectNode(container);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    document.body.removeChild(container);
  }
}
function downloadDotPlot() {
  if (dotPlotChart) {
    const canvas = document.getElementById("dotPlot");

    // Create a new canvas with a white background
    const copyCanvas = document.createElement("canvas");
    copyCanvas.width = canvas.width;
    copyCanvas.height = canvas.height;
    const copyCtx = copyCanvas.getContext("2d");
    copyCtx.fillStyle = "white"; // Set background color to white
    copyCtx.fillRect(0, 0, copyCanvas.width, copyCanvas.height);

    // Temporarily change the background color to white before rendering the image
    const originalBackgroundColor =
      dotPlotChart.config.data.datasets[0].backgroundColor;
    dotPlotChart.config.data.datasets[0].backgroundColor = "white";
    dotPlotChart.update();

    // Draw the dot plot on the new canvas
    copyCtx.drawImage(canvas, 0, 0);

    // Restore the original background color
    dotPlotChart.config.data.datasets[0].backgroundColor =
      originalBackgroundColor;
    dotPlotChart.update();

    // Convert the new canvas to an image data URL
    const dataUrl = copyCanvas.toDataURL("image/jpeg");

    // Create a new anchor element to trigger the download
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = "dot_plot.jpg";

    // Simulate a click on the anchor to start the download
    anchor.click();
  }
}
