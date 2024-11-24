// Global Variable
let flag = false;
let showTree = {};

// API
async function getAllCourses() {
  try {
    let response = await axios.get("http://localhost:3000/ap/getCourse");
    const courseData = response.data;
    if (!Object.keys(courseData).includes("error")) {
      return courseData;
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

async function getCourseByCourseCode(courseCode) {
  try {
    let response = await axios.get(
      `http://localhost:3000/ap/getCourse/${courseCode}`
    );
    const courseData = response.data;
    if (!Object.keys(courseData).includes("error")) {
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

async function getAllCorePathCourses() {
  try {
    let response = await axios.get(
      "http://localhost:3000/ap/getCorePathCourses"
    );
    let courseData = response.data;
    if (!Object.keys(courseData).includes("error")) {
      return courseData;
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

async function getUserTree(userID) {
  try {
    let response = await axios.get(
      `http://localhost:3000/ap/getTree/${userID}`
    );
    const treeData = response.data;
    if (!Object.keys(treeData).includes("error")) {
      return treeData.tree;
    } else {
      console.error(treeData.error);
    }
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(`Something went wrong ${error}`);
    }
  }
}

async function addTree(userId, tree) {
  try {
    let response = await axios.put(`http://localhost:3000/ap/addTree`, {
      userId,
      tree,
    });
    console.log(`addTree response: ${response}`);
    if (response.data.success) {
      console.log(`addTree response.data.message: ${response.data.message}`);
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error(`Something went wrong ${error}`);
  }
}

// Logic

async function showCoursePath(courseCode) {
  // Fetch course data
  let courseData = await getCourseByCourseCode(courseCode);
  let allCourseData = await getAllCourses();
  let allCourses = allCourseData.data;

  // Initialize the tree
  let tempTree = { name: "CS", children: [] };
  let coreCourse = { name: courseData.courseCode, children: [] };
  tempTree.children.push(coreCourse);

  // Recursive function to add courses
  function addCourse(obj) {
    // Find prerequisites for the current course
    let preReq = allCourses
      .filter((course) => course.prerequisite.includes(obj.name))
      .flatMap((course) => course.courseCode); // Assuming `prerequisite` is an array
    // Add prerequisites as children
    for (let courseCode of preReq) {
      let childObj = { name: courseCode, children: [] };
      obj.children.push(childObj);
      addCourse(childObj); // Recursively add child nodes
    }
  }

  // Start building the tree
  addCourse(coreCourse);

  // Return the constructed tree
  return tempTree;
}

// console.log(await showCoursePath("CS_546"));

async function onHoverShowTree(courseCode) {
  let tempTree = await showCoursePath(courseCode); // get temp tree
  let mainTree = await getUserTree("123"); // get main tree
  let mainTreeChild = mainTree.children; // main tree child
  let tempTreeChildren = tempTree.children;
  if (mainTreeChild.length === 0) {
    mainTree.children = tempTreeChildren;
  } else {
    for (let child_1 of treeChild) {
      for (let child_2 of tempTreeChildren) {
        if (child_1.name !== child_2.name) {
          mainTree.children.push(child_2);
        }
      }
    }
  }
  flag = true;
  console.log("result tree", JSON.stringify(mainTree));
  return mainTree;
}

async function addCourseButton(courseName, courseCode, userId) {
  const courseList = document.getElementById("courses");
  if (courseList) {
    const courseButton = document.createElement("button");
    const hiddenPTag = document.createElement("p");
    hiddenPTag.textContent = courseCode;
    hiddenPTag.id = "hidden-p-tag";
    courseButton.className = "course-btn";
    courseButton.id = courseCode;
    courseButton.textContent = `${courseName} - ${courseCode}`;
    hiddenPTag.style.display = "none";
    courseButton.addEventListener("click", async () => {
      try {
        let tree = await onHoverShowTree(courseCode);
        await addTree(userId, tree);
      } catch (error) {
        console.error("Error adding course tree:", error);
      }
    });
    courseButton.addEventListener("mouseenter", async (event) => {
      const hiddentCourseCode = courseButton.querySelector("p").innerText;
      await renderHoverTree(hiddentCourseCode);
      await renderChart(hiddentCourseCode);
    });
    courseButton.addEventListener("mouseleave", async (event) => {
      flag = false;

      await renderChart();
    });

    courseList.appendChild(courseButton);
    courseButton.appendChild(hiddenPTag);
  }
}

// Chart
async function chart(data) {
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
  let demo = {
    name: "CS",
    children: [
      { name: "CS_546", children: [{ name: "CS_547", children: [] }] },
    ],
  };
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

// Rendering

async function renderCourses() {
  let coreCourse = await getAllCorePathCourses();
  for (let course of coreCourse) {
    await addCourseButton(course.courseName, course.courseCode, "123");
  }
}

async function renderHoverTree(courseCode) {
  return await onHoverShowTree(courseCode);
}

async function renderChart(courseCode) {
  async function addingChart(courseCode) {
    // Get and append the first chart (svgNode)
    let data;
    if (!courseCode) {
      data = await getUserTree("123");
    }
    if (flag) {
      data = await renderHoverTree(courseCode);
    } else {
      data = await getUserTree("123");
    }
    const svgNode = await chart(data);
    const mainElement = document.getElementById("chart");

    if (mainElement) {
      mainElement.innerHTML = ""; // Reset Chart
      mainElement.appendChild(svgNode); // Append the first chart to 'main' element
    } else {
      console.error("The 'main' element was not found in the DOM.");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", async function () {
      await addingChart(courseCode);
    });
  } else {
    await addingChart(courseCode);
  }
}

await renderCourses();
await renderChart();
