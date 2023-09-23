let pieChart;

function generatePieChart() {
  const graphTitle = document.getElementById("graphTitle").value || "Pie Chart";
  const showPercentages = document.getElementById("showPercentages").checked;
  const showValues = document.getElementById("showValues").checked;
  const textColor = document.getElementById("textColor").value;

  const dataNameInputs = document.querySelectorAll(".data-name");
  const dataValueInputs = document.querySelectorAll(".data-value");

  const dataNames = Array.from(dataNameInputs).map((input) =>
    input.value.trim()
  );
  const dataValues = Array.from(dataValueInputs).map((input) =>
    parseFloat(input.value.trim())
  );

  if (dataNames.length !== dataValues.length) {
    alert("Number of data names and values must match.");
    return;
  }

  const canvas = document.getElementById("pieChart");
  const ctx = canvas.getContext("2d");

  if (pieChart) {
    pieChart.destroy();
  }

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: dataNames,
      datasets: [
        {
          data: dataValues,
          backgroundColor: generateRandomColors(dataValues.length),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        title: {
          display: true,
          text: graphTitle,
          color: textColor,
          fontSize: 24, 
        },
        tooltip: {
          enabled: false,
        },
        legend: {
          position: "right", 
          labels: {
            font: {
              size: 18,
            },
            generateLabels: function (chart) {
              if (chart.data.datasets.length > 0) {
                const dataset = chart.data.datasets[0];
                const total = dataset.data.reduce((a, b) => a + b, 0);

                return dataset.data.map(function (value, index) {
                  const percentage = ((value / total) * 100).toFixed(2);
                  const text = chart.data.labels[index];

                  let label = text;

                  if (showPercentages) {
                    label += `: ${percentage}%`;
                  }

                  if (showValues) {
                    label += ` (${value})`;
                  }

                  return {
                    text: label,
                    fillStyle: dataset.backgroundColor[index],
                    hidden: isNaN(value) || value === 0,
                    lineCap: "round",
                    fontColor: textColor,
                  };
                });
              }
              return [];
            },
          },
        },
      },
    },
  });
}

let dataInputCount = 1; // Initialize the data input count

function addDataInput() {
  const dataInputContainer = document.querySelector(".data-input");
  const newField = document.createElement("div");

  // Create and increment the data input count
  dataInputCount++;

  newField.innerHTML = `
<label class="input-label">Data Name(${dataInputCount}):</label>
<input class="input-field data-name" type="text" />
<label class="input-label">Data Value(${dataInputCount}):</label>
<input class="input-field data-value" type="number" />
`;
  dataInputContainer.appendChild(newField);
}

function resetPieChart() {
  if (pieChart) {
    pieChart.destroy();
    document.getElementById("dataInput").value = "";
    document.getElementById("valuesInput").value = "";
    document.getElementById("graphTitle").value = "";
    document.getElementById("showPercentages").checked = false;

    const canvas = document.getElementById("pieChart");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function copyPieChart() {
  if (pieChart) {
    const canvas = document.getElementById("pieChart");
    const copyCanvas = createCopyCanvas(canvas);

    const dataUrl = copyCanvas.toDataURL("image/png");

    const img = new Image();
    img.src = dataUrl;

    const container = document.createElement("div");
    container.appendChild(img);

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

function downloadPieChart() {
  if (pieChart) {
    const canvas = document.getElementById("pieChart");
    const copyCanvas = createCopyCanvas(canvas);

    const anchor = document.createElement("a");
    anchor.href = copyCanvas.toDataURL("image/jpeg");
    anchor.download = "pie_chart.jpg";

    anchor.click();
  }
}

function createCopyCanvas(originalCanvas) {
  const copyCanvas = document.createElement("canvas");
  copyCanvas.width = originalCanvas.width;
  copyCanvas.height = originalCanvas.height;
  const copyCtx = copyCanvas.getContext("2d");
  copyCtx.fillStyle = "white";
  copyCtx.fillRect(0, 0, copyCanvas.width, copyCanvas.height);
  copyCtx.drawImage(originalCanvas, 0, 0);
  return copyCanvas;
}

function generateRandomColors(numColors) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.7)`;
    colors.push(color);
  }
  return colors;
}
