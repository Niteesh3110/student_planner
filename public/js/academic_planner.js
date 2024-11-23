// import { getCourseByCourseCode } from "../../data/academic_planner.js";

async function getAllCourses() {
  try {
    let response = await axios.get("http://localhost:3000/ap/getCourse");
    const courseData = response.data;
    return courseData;
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(`Something went wrong ${error}`);
    }
  }
}

async function getCourseByCourseCode(courseCode) {
  try {
    let response = await axios.get(
      `http://localhost:3000/ap/addCourse/${courseCode}`
    );
    const courseData = response.data;
    if (courseData.boolean) {
      return courseData.courseData;
    } else {
      console.error(courseData.error);
    }
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(`Something went wrong ${error}`);
    }
  }
}

// console.log(await getCourseByCourseCode("CS_546"));

const data = {
  name: "CS",
  children: [
    { name: "Child 1" },
    {
      name: "Child 2",
      children: [{ name: "Grandchild 1" }, { name: "Grandchild 2" }],
    },
    {
      name: "Child3",
      children: [
        { name: "demo1", children: { name: "hello" } },
        { name: "demo2" },
      ],
    },
  ],
};

async function getUserTree(userID) {
  try {
    let response = await axios.get(
      `http://localhost:3000/ap/getTree/${userID}`
    );
    console.log(response);
  } catch (error) {}
}

async function addCourseToTree(courseCode) {
  let courseData = await getCourseByCourseCode(courseCode);
  if (courseData.prerequisite.length !== 0) {
  } else {
    tree.children.push({ name: courseData.courseCode });
  }
}

async function addCourseButton(courseName, courseCode) {
  const courseList = document.getElementById("courses");
  if (courseList) {
    const courseButton = document.createElement("button");
    courseButton.id = "course-btn";
    courseButton.onclick(await addCourseToTree(courseCode));
    courseList.appendChild();
  }
}

async function chart() {
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
  // Specify the chart’s dimensions.
  const width = 700;
  const height = 500;

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
        .id((d) => d.id)
        .distance(100)
        .strength(2)
    )
    .force("charge", d3.forceManyBody().strength(-500))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  // Create the container SVG.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: 100%;");
  // .attr("style", "border: 1px solid black;");

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
    .attr("r", 4)
    .call(drag(simulation));

  node.append("title").text((d) => d.data.name);

  const label = svg
    .append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
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

    // Update label positions to follow nodes
    label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  //   invalidation.then(() => simulation.stop());

  return svg.node();
}

async function renderChart() {
  document.addEventListener("DOMContentLoaded", async function () {
    // Get and append the first chart (svgNode)
    const svgNode = await chart();
    const mainElement = document.getElementById("chart");

    if (mainElement) {
      mainElement.appendChild(svgNode); // Append the first chart to 'main' element
    } else {
      console.error("The 'main' element was not found in the DOM.");
    }
  });
}

renderChart();
