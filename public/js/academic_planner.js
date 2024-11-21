const data = {
  name: "Root",
  children: [
    { name: "Child 1" },
    {
      name: "Child 2",
      children: [{ name: "Grandchild 1" }, { name: "Grandchild 2" }],
    },
  ],
};

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

async function chart() {
  // Specify the chart’s dimensions.
  const width = 928;
  const height = 600;

  // Compute the graph and start the force simulation.
  const root = d3.hierarchy(data);
  const links = root.links();
  const nodes = root.descendants();

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.data.name)
        .distance(50)
        .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-50))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  // Create the container SVG.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Append links.
  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line");

  // Append nodes.
  const node = svg
    .append("g")
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("fill", (d) => (d.children ? null : "#000"))
    .attr("stroke", (d) => (d.children ? null : "#fff"))
    .attr("r", 3.5)
    .call(drag(simulation));

  node.append("title").text((d) => d.data.name);

  node
    .append("text")
    .attr("dy", -10) // Position the label above the node
    .attr("x", 6) // Add some space between the node and the label
    .attr("text-anchor", "middle") // Center the text horizontally
    .text((d) => d.data.name); // Set the label text to the node's name

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });

  //   invalidation.then(() => simulation.stop());

  return svg.node();
}

async function renderChart() {
  document.addEventListener("DOMContentLoaded", async function () {
    const svgNode = await chart();
    document.querySelector("main").appendChild(svgNode);
  });
}

renderChart();
