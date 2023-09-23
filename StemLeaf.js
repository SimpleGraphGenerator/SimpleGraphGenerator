function generateSLplot() {
  const leafType = "single";
  const dataInput = document.getElementById("dataInput").value;
  const graphTitle = document.getElementById("graphTitle").value;

  // Change the textColor to black (#000000)
  const textColor = "#000000";

  const stemLeafPlotData = processStemLeafData(dataInput, leafType);
  displayStemLeafPlot(stemLeafPlotData, graphTitle, textColor);
}

function resetSLplot() {
  document.getElementById("dataInput").value = "";
  document.getElementById("graphTitle").value = "";
  const stemLeafPlot = document.getElementById("stemLeafPlot");
  stemLeafPlot.innerHTML = "";
}

function copySLplot() {
  const chartContainer = document.getElementById("stemLeafPlot");
  const range = document.createRange();
  range.selectNode(chartContainer);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

function processStemLeafData(dataInput, leafType) {
  const data = dataInput.split(",").map((value) => parseInt(value.trim()));
  const plotData = {};

  data.forEach((value) => {
    const stem = Math.floor(value / 10);
    const leaf = leafType === "single" ? value % 10 : value % 100;

    if (!plotData[stem]) {
      plotData[stem] = [];
    }
    plotData[stem].push(leaf);
  });

  return plotData;
}

function displayStemLeafPlot(plotData, title, textColor) {
  const stemLeafPlot = document.getElementById("stemLeafPlot");

  // Create a div element for the title and set its styles
  const titleElement = document.createElement("div");
  titleElement.className = "stem-leaf-title"; // Apply the CSS class for styling
  titleElement.textContent = title; // Set the title text
  titleElement.style.color = textColor; // Set the text color

  // Append the title element to the stemLeafPlot container
  stemLeafPlot.appendChild(titleElement);

  // Calculate the maximum number of digits in the stem
  let maxStemDigits = 0;

  Object.keys(plotData).forEach((stem) => {
    if (stem.length > maxStemDigits) {
      maxStemDigits = stem.length;
    }
  });

  const stemLeafEntries = [];

  // Construct stem-and-leaf entries with leading spaces for alignment
  Object.keys(plotData).forEach((stem) => {
    const leafList = plotData[stem].sort((a, b) => a - b).join(", ");
    const spacesNeeded = 2 * (maxStemDigits - stem.length); // Add two spaces for alignment
    const spaces = " ".repeat(spacesNeeded); // Add leading spaces
    const stemLeafEntry = `${spaces}${stem} | ${leafList}`;
    stemLeafEntries.push(stemLeafEntry);
  });

  // Determine the maximum number of digits in the leaves
  let maxLeafDigits = 0;

  stemLeafEntries.forEach((entry) => {
    const leafPart = entry.split("|")[1].trim();
    const leaves = leafPart.split(",").map((leaf) => leaf.trim());

    leaves.forEach((leaf) => {
      if (leaf.length > maxLeafDigits) {
        maxLeafDigits = leaf.length;
      }
    });
  });

  // Display the stem-and-leaf entries with additional leading spaces for alignment
  stemLeafEntries.forEach((entry) => {
    const [stemPart, leafPart] = entry.split("|");
    const leaves = leafPart
      .trim()
      .split(",")
      .map((leaf) => leaf.trim());
    const spacesNeeded = 2 * (maxLeafDigits - leaves[0].length); // Add two spaces for alignment
    const additionalSpaces = " ".repeat(spacesNeeded); // Add additional leading spaces
    const alignedEntry = `${stemPart} | ${additionalSpaces}${leafPart}`;
    const stemLeafEntry = `<div class="stem-leaf-entry">${alignedEntry}</div>`;
    stemLeafPlot.innerHTML += stemLeafEntry;
  });

  // Apply CSS style to preserve spaces for alignment
  stemLeafPlot.style.whiteSpace = "pre";

  const plotEntries = stemLeafPlot.querySelectorAll(".stem-leaf-entry");
  plotEntries.forEach((entry) => {
    entry.style.color = textColor;
  });
}

//fix comma at end of data bug
function processStemLeafData(dataInput, leafType) {
  const data = dataInput
    .split(",")
    .map((value) => value.trim()) // Trim whitespace
    .filter((value) => value !== ""); // Filter out empty values

  const plotData = {};

  data.forEach((value) => {
    const parsedValue = parseInt(value);

    if (!isNaN(parsedValue)) {
      const stem = Math.floor(parsedValue / 10);
      const leaf = leafType === "single" ? parsedValue % 10 : parsedValue % 100;

      if (!plotData[stem]) {
        plotData[stem] = [];
      }
      plotData[stem].push(leaf);
    }
  });

  return plotData;
}
