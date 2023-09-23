let dataInputsCount = 3; // Keep track of the number of data input fields
let radarChart; // To store the Chart.js instance

function addDataInput() {
  dataInputsCount++;

  const dataInputContainer = document.createElement("div");
  dataInputContainer.classList.add("data-input");

  const nameLabel = document.createElement("label");
  nameLabel.classList.add("input-label");
  nameLabel.textContent = `Data Name(${dataInputsCount}):`;

  const nameInput = document.createElement("input");
  nameInput.classList.add("form-control", "data-name");
  nameInput.type = "text";
  nameInput.id = `dataName${dataInputsCount}`;

  const valueLabel = document.createElement("label");
  valueLabel.classList.add("input-label");
  valueLabel.textContent = `Data Value(${dataInputsCount}):`;

  const valueInput = document.createElement("input");
  valueInput.classList.add("form-control", "data-value");
  valueInput.type = "number";
  valueInput.id = `dataValue${dataInputsCount}`;

  dataInputContainer.appendChild(nameLabel);
  dataInputContainer.appendChild(nameInput);
  dataInputContainer.appendChild(valueLabel);
  dataInputContainer.appendChild(valueInput);

  const optionsPanel = document.querySelector(".main-content");
  optionsPanel.insertBefore(
    dataInputContainer,
    optionsPanel.querySelector(".button")
  );
}

function generateRadarChart() {
  const dataLabels = [];
  const dataValues = [];

  // Loop through data input fields and collect data
  for (let i = 0; i < dataInputsCount; i++) {
    const nameInput = document.querySelectorAll(".data-name")[i];
    const valueInput = document.querySelectorAll(".data-value")[i];

    if (nameInput.value && valueInput.value) {
      dataLabels.push(nameInput.value);
      dataValues.push(Number(valueInput.value));
    }
  }

  const randomColor = getRandomColor();

  const data = {
    labels: dataLabels,
    datasets: [
      {
        label: "Data",
        data: dataValues,
        backgroundColor: randomColor,
        borderColor: randomColor,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const graphTitleInput = document.getElementById("graphTitleInput").value; // Get the user-inputted title

  const config = {
    type: "radar",
    data: data,
    options: {
      scales: {
        r: {
          beginAtZero: true, // Set the lowest tick to zero
          pointLabels: {
            font: {
              size: 14,
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.2)",
            z: 1, // Set z-index for the gridlines
          },
          ticks: {
            z: 2, // Set z-index for the axis ticks (higher value)
          },
        },
      },
      layout: {
        padding: 20,
      },
      plugins: {
        title: {
          display: true,
          text: graphTitleInput, // Use the user's input as the title
          position: "top", // Position the title above the graph
          font: {
            size: 24,
          },
        },
        legend: {
          display: false,
          enabled: false,
        },
        tooltip: {
          enabled: false,
          display: false,
        },
      },
    },
  };

  const ctx = document.getElementById("RadarChart").getContext("2d");
  if (radarChart) {
    radarChart.destroy();
  }
  radarChart = new Chart(ctx, config);
}

// Helper function to generate a random color
function getRandomColor() {
  const min = 120;
  const max = 210;
  const r = Math.floor(Math.random() * (max - min + 1)) + min;
  const g = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;
  return `rgba(${r},${g},${b}`;
}

function resetRadarChart() {
  // Clear all input fields
  const inputFields = document.querySelectorAll(".input-field");
  inputFields.forEach((field) => {
    field.value = "";
  });

  // Set the graph title to "Radar Chart"
  const graphTitleInput = document.getElementById("graphTitleInput");
  graphTitleInput.value = "Radar Chart";

  // Destroy the graph
  const existingChart = radarChart;
  if (existingChart) {
    existingChart.destroy();
  }

  // Clear the title content on the chart
  const graphTitleElement = document.getElementById("graphTitle");
  graphTitleElement.textContent = "";
}

function getRandomColor() {
  const min = 120;
  const max = 210;
  const r = Math.floor(Math.random() * (max - min + 1)) + min;
  const g = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;
  return `rgb(${r},${g},${b})`;
}

function copyToClipboard() {
  const canvas = document.getElementById("RadarChart");
  canvas.toBlob(function (blob) {
    navigator.clipboard
      .write([new ClipboardItem({ "image/png": blob })])
      .then(function () {
        // Show a message that the chart image has been copied
        showPopupMessage("Chart image copied to clipboard");
      })
      .catch(function (err) {
        console.error("Could not copy text: ", err);
        // Show an error message if copying fails
        showPopupMessage("Error copying chart image to clipboard");
      });
  }, "image/png");
}

function copyRadarChart() {
  const canvas = document.getElementById("RadarChart");
  const copyCanvas = createCopyCanvas(canvas);

  // Convert the new canvas to an image data URL
  const dataUrl = copyCanvas.toDataURL("image/jpeg");

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

  // Show a message that the chart image has been copied
  showPopupMessage("Chart image copied to clipboard");
}

function downloadRadarChart() {
  const canvas = document.getElementById("RadarChart");
  const copyCanvas = createCopyCanvas(canvas);

  const anchor = document.createElement("a");
  anchor.href = copyCanvas.toDataURL("image/jpeg");
  anchor.download = "radar_chart.jpg";

  anchor.click();
}

function createCopyCanvas(originalCanvas) {
  const copyCanvas = document.createElement("canvas");
  copyCanvas.width = originalCanvas.width;
  copyCanvas.height = originalCanvas.height;
  const copyCtx = copyCanvas.getContext("2d");

  // Fill the new canvas with a white background
  copyCtx.fillStyle = "white";
  copyCtx.fillRect(0, 0, copyCanvas.width, copyCanvas.height);

  // Draw the radar chart on the new canvas
  copyCtx.drawImage(originalCanvas, 0, 0);

  return copyCanvas;
}
