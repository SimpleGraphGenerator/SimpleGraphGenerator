function goToGraph(graphURL) {
  window.location.href = graphURL;
}

let dataInputsCount = 1; // Keep track of the number of data input fields
let barGraph; // To store the Chart.js instance

function addDataInput() {
  dataInputsCount++;

  const dataInputContainer = document.createElement("div");
  dataInputContainer.classList.add("data-input");

  const nameLabel = document.createElement("label");
  nameLabel.classList.add("input-label");
  nameLabel.textContent = `Data Name(${dataInputsCount}):`;
  dataInputContainer.appendChild(nameLabel);

  const nameInput = document.createElement("input");
  nameInput.classList.add("input-field", "data-name");
  nameInput.type = "text";
  dataInputContainer.appendChild(nameInput);

  const valueLabel = document.createElement("label");
  valueLabel.classList.add("input-label");
  valueLabel.textContent = `Data Value(${dataInputsCount}):`;
  dataInputContainer.appendChild(valueLabel);

  const valueInput = document.createElement("input");
  valueInput.classList.add("input-field", "data-value");
  valueInput.type = "number";
  dataInputContainer.appendChild(valueInput);

  const dataFieldsContainer = document.getElementById("dataFields");
  dataFieldsContainer.appendChild(dataInputContainer);
}

function generateBarGraph() {
  const dataLabels = [];
  const dataValues = [];
  const backgroundColors = [];

  // Loop through data input fields and collect data
  for (let i = 0; i < dataInputsCount; i++) {
    const nameInput = document.querySelectorAll(".data-name")[i];
    const valueInput = document.querySelectorAll(".data-value")[i];

    if (nameInput.value && valueInput.value) {
      dataLabels.push(nameInput.value);
      dataValues.push(Number(valueInput.value));

      // Generate random RGB color for each bar
      const randomColor = `rgb(${getRandomValue(180, 255)}, ${getRandomValue(
        180,
        255
      )}, ${getRandomValue(180, 255)})`;
      backgroundColors.push(randomColor);
    }
  }

  // Set the maximum X value to 999999
  const maxX = 999999;

  // Get other settings like min X and Y values
  const maxYInput = document.getElementById("maxY");
  const maxY =
    maxYInput.value !== "" ? Number(maxYInput.value) : Math.max(...dataValues); // Use the user input or the largest data value as maxY

  // Get axis title inputs
  const xAxisTitle = document.getElementById("xAxisTitle").value;
  const yAxisTitle = document.getElementById("yAxisTitle").value;

  // Get graph title input
  const graphTitle = document.getElementById("graphTitle").value;

  // Ensure xAxisTitle is defined
  const xAxisConfig = xAxisTitle ? { display: true, text: xAxisTitle } : {};

  // Configure and create the bar graph using Chart.js
  const ctx = document.getElementById("BarGraph").getContext("2d");
  if (barGraph) {
    barGraph.destroy();
  }
  barGraph = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dataLabels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: graphTitle || "Bar Graph",
          font: {
            size: 20,
          },
        },
      },
      scales: {
        x: {
          min: 0,
          max: maxX,
          title: {
            display: true,
            text: xAxisTitle || "X Axis", // Use xAxisTitle variable
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
          min: 0,
          max: maxY,
          title: {
            display: true,
            text: yAxisTitle || "Y Axis", // Use yAxisTitle variable
          },
          ticks: {
            font: {
              size: 16,
            },
          },
        },
      },
    },
  });
}

// Helper function to generate a random value between min and max (inclusive)
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function copyToClipboard() {
  const canvas = document.getElementById("BarGraph");

  // Create a temporary canvas with a white background
  const copyCanvas = document.createElement("canvas");
  copyCanvas.width = canvas.width;
  copyCanvas.height = canvas.height;
  const copyCtx = copyCanvas.getContext("2d");
  copyCtx.fillStyle = "white"; // Set background color to white
  copyCtx.fillRect(0, 0, copyCanvas.width, copyCanvas.height);

  // Temporarily change the background color before rendering the image
  const originalBackgroundColor =
    barGraph.config.data.datasets[0].backgroundColor;
  barGraph.config.data.datasets[0].backgroundColor = "white";
  barGraph.update();

  // Draw the bar graph on the new canvas
  copyCtx.drawImage(canvas, 0, 0);

  // Restore the original background color
  barGraph.config.data.datasets[0].backgroundColor = originalBackgroundColor;
  barGraph.update();

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

function downloadBarGraph() {
  const canvas = document.getElementById("BarGraph");

  // Create a new canvas with a white background
  const whiteBackgroundCanvas = document.createElement("canvas");
  whiteBackgroundCanvas.width = canvas.width;
  whiteBackgroundCanvas.height = canvas.height;
  const ctx = whiteBackgroundCanvas.getContext("2d");
  ctx.fillStyle = "white"; // Set background color to white
  ctx.fillRect(0, 0, whiteBackgroundCanvas.width, whiteBackgroundCanvas.height);

  // Draw the bar graph onto the new canvas
  ctx.drawImage(canvas, 0, 0);

  // Create a new anchor element to trigger the download
  const anchor = document.createElement("a");
  anchor.href = whiteBackgroundCanvas.toDataURL("image/jpeg");
  anchor.download = "bar_graph.jpg";

  // Simulate a click on the anchor to start the download
  anchor.click();
}
