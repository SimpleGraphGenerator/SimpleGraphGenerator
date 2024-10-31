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
  const showValues = document.getElementById("showValues").checked;
  const chooseColor = document.getElementById("chooseColor").checked;
  const selectedColor = document.getElementById("barColor").value;

  // Loop through data input fields and collect data
  for (let i = 0; i < dataInputsCount; i++) {
    const nameInput = document.querySelectorAll(".data-name")[i];
    const valueInput = document.querySelectorAll(".data-value")[i];

    if (nameInput.value && valueInput.value) {
      dataLabels.push(nameInput.value);
      dataValues.push(Number(valueInput.value));

      // Use selected color if checkbox is checked; otherwise, use random colors
      const barColor = chooseColor ? selectedColor : `rgb(${getRandomValue(180, 255)}, ${getRandomValue(180, 255)}, ${getRandomValue(180, 255)})`;
      backgroundColors.push(barColor);
    }
  }

  const maxYInput = document.getElementById("maxY");
  const maxY = maxYInput.value !== "" ? Number(maxYInput.value) : Math.max(...dataValues);

  const xAxisTitle = document.getElementById("xAxisTitle").value;
  const yAxisTitle = document.getElementById("yAxisTitle").value;
  const graphTitle = document.getElementById("graphTitle").value;

  const ctx = document.getElementById("BarGraph").getContext("2d");
  if (barGraph) {
    barGraph.destroy();
  }
  barGraph = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dataLabels,
      datasets: [{
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
      }],
    },
    options: {
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: graphTitle || "Bar Graph",
          font: { size: 20 },
        },
        tooltip: { enabled: false }, // Disable tooltips on hover
      },
      hover: { mode: null }, // Disable hover effect
      scales: {
        x: {
          title: { display: true, text: xAxisTitle || "X Axis", font: { size: 16 }},
          ticks: { font: { size: 16 }},
        },
        y: {
          max: maxY,
          title: { display: true, text: yAxisTitle || "Y Axis", font: { size: 16 }},
          ticks: { font: { size: 16 }},
        },
      },
      animation: {
        onComplete: function() {
          if (showValues) {
            const chartInstance = barGraph;
            const ctx = chartInstance.ctx;
            ctx.font = "14px Arial";
            ctx.fillStyle = "#ffffff"; // White color to make it visible inside colored bars
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            chartInstance.data.datasets.forEach(function(dataset, i) {
              const meta = chartInstance.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                const data = dataset.data[index];
                ctx.fillText(data.toFixed(2), bar.x, bar.y + 15); // Adjust +15 to position within the bar
              });
            });
          }
        },
      },
    },
  });
}

// Helper function to generate a random value between min and max (inclusive)
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function toggleColorPicker() {
  const colorPickerContainer = document.getElementById("colorPickerContainer");
  const chooseColor = document.getElementById("chooseColor").checked;

  // Show or hide the color picker based on the checkbox state
  colorPickerContainer.style.display = chooseColor ? "block" : "none";
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
