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

async function checkDuplicate(courseCode, userId) {
  try {
    let response = await axios.get(
      `http://localhost:3000/ap/checkDuplicate?courseCode=${courseCode}&userId=${userId}`
    );
    const responseStatus = response.status;
    const responseData = response.data;
    console.log(responseData);
    if (responseData.boolean && responseStatus === 200) {
      console.log(responseData.message); // Course Exists
      return responseData.boolean; // True
    }
    if (!responseData.boolean && responseStatus === 200) {
      console.log(responseData.message); // Course Does Not Exists
      return responseData.boolean; // False
    }
    if (!responseData.boolean && responseStatus === 404) {
      console.log(response.message); // User not found
      return response.boolean; // False
    }
    if (!responseData.boolean && responseStatus === 500) {
      console.log(responseData.message); // Internal Server Error
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
      return false;
    } else {
      console.log(`Something went wrong: ${error}`);
      return false;
    }
  }
}

async function deleteCourseTree(userId, courseCode) {
  try {
    let response = await axios.get(
      `http://localhost:3000/ap/deleteCourse?userId=${userId}&courseCode=${courseCode}`
    );
    console.log(response);
    const responseData = response.data;
    const responseStatus = response.status;
    console.log(!responseData.boolean && responseStatus === 404);
    if (responseData.boolean && responseStatus === 200)
      return responseData.boolean;
    if (!responseData.boolean && responseStatus === 400)
      console.log(responseData.error);
    if (!responseData.boolean && responseStatus === 404) {
      console.error(responseData.error);
      return { boolean: false, error: "Course not found" };
    }
    if (!responseData.boolean && responseStatus === 500)
      console.error(responseData.error);
  } catch (error) {
    console.error(error.response.status);
    if (error.response.status === 404) {
      console.error(error);
      return { boolean: false, error: "Course not found" };
    }
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
    for (let child_1 of mainTreeChild) {
      for (let child_2 of tempTreeChildren) {
        if (child_1.name !== child_2.name) {
          mainTree.children.push(child_2);
        }
      }
    }
  }
  // Removing duplicate keys
  // Reference: https://stackoverflow.com/questions/45439961/remove-duplicate-values-from-an-array-of-objects-in-javascript
  mainTree["children"] = mainTree.children.reduce((unique, o) => {
    if (
      !unique.some((obj) => obj.name === o.name && obj.children === o.children)
    ) {
      unique.push(o);
    }
    return unique;
  }, []);

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
    courseButton.className = "btn btn-outline-secondary btn-sm my-1 w-100";
    courseButton.id = courseCode;
    courseButton.textContent = `${courseName} - ${courseCode}`;
    hiddenPTag.style.display = "none";
    courseButton.addEventListener("click", async () => {
      try {
        let fetchTree = await getUserTree("123");
        if (fetchTree) {
          if (fetchTree.children.length === 3)
            alert(
              "Cannot add more than 3 core courses as per university guidelines. Please remove course courses"
            );
        }
        let tree = await onHoverShowTree(courseCode);
        if (await checkDuplicate(courseCode, userId)) {
          return console.log("Course Already Exists");
        }
        await addTree(userId, tree);
      } catch (error) {
        console.error("Error adding course tree:", error);
      }
    });
    courseButton.addEventListener("mouseenter", async (event) => {
      if (await checkDuplicate(courseCode, userId)) {
        return console.log("Course Already Exists");
      }
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
async function chart(data, userId, color) {
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
  const width = 1100;
  const height = 100;

  // Compute the graph and start the force simulation.
  // let demo = {
  //   name: "CS",
  //   children: [
  //     { name: "CS_546", children: [{ name: "CS_547", children: [] }] },
  //   ],
  // };
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
        .strength(0.5)
    )
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  // Create the container SVG.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height]);
  // .attr("style", "max-width: 100%; height: 90%; border: 1px solid black;");
  // .attr("style", "border: 1px solid black;");

  // Append links.
  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-dashoffset", 0);

  // Append nodes.
  const node = svg
    .append("g")
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("fill", (d) =>
      d.data.name === "CS"
        ? "#FFE31A"
        : d.parent && d.parent.data.name === "CS"
        ? "#7ED4AD"
        : d.children
        ? null
        : "#000"
    )
    .attr("stroke", (d) => {
      d.data.name === "CS"
        ? "#FFE31A"
        : d.parent && d.parent.data.name === "CS"
        ? "#7ED4AD"
        : d.children
        ? null
        : "#fff";
    })
    .attr("r", 0)
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

  const cross = svg
    .append("g")
    .selectAll("text.cross")
    .data(
      nodes.filter(
        (d) =>
          (d.data.name !== "CS" && // Exclude the root nodes
            d.children &&
            d.children.length > 0) ||
          (d.parent && d.parent.data.name === "CS") // Include nodes that have children
        // d.parent && // include if the node has a parent and that parent is the root node
        // d.parent.data.name === "CS" // Include if the direct parent is the root node
      )
    ) // Exclude the cross button for the root node ("CS") and for nodes that have children
    .join("text")
    .attr("class", "cross")
    .attr("dy", -10)
    .attr("x", 20)
    .attr("fill", "black")
    .attr("font-size", "17px")
    .attr("cursor", "pointer")
    .attr("style", "border: 1px solid black")
    .text("x")
    .on("click", async (event, d) => {
      console.log(d.data.name);
      let deleteCourseResult = await deleteCourseTree(userId, d.data.name);
      console.log(deleteCourseResult.boolean);
      if (deleteCourseResult.boolean) {
        window.location.reload();
      } else {
        d3.select("#chart svg").remove();
        window.location.reload();
      }
    });

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    // .attr("x1", (d) => d.source.x)
    // .attr("y1", (d) => d.source.y)
    // .attr("x2", (d) => d.source.x) // Start links with zero length
    // .attr("y2", (d) => d.source.y) // Start links with zero length
    // .transition() // Animate the links
    // .duration(50) // Animation duration in milliseconds
    // .attr("x2", (d) => d.target.x)
    // .attr("y2", (d) => d.target.y);

    node
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .transition()
      .delay(250) // Delay until link animations complete
      .duration(50) // Animation duration in milliseconds
      .attr("r", 4); // Final radius of nodes

    // Update label positions to follow nodes
    label.attr("x", (d) => d.x).attr("y", (d) => d.y);

    // Update cross button position
    cross.attr("x", (d) => d.x + 20).attr("y", (d) => d.y - 20);
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
    } else {
      if (flag) {
        data = await renderHoverTree(courseCode);
      } else {
        data = await getUserTree("123");
      }
    }

    const svgNode = await chart(data, "123");
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

async function chartLegend(color) {
  const svgLegend = d3
    .select("#chart-legend")
    .append("svg")
    .attr("width", 200) // Set width as needed for the legend
    .attr("height", 50)
    .style("display", "block") // Make SVG block-level for centering
    .style("margin", "0 auto"); // Center horizontally inside the parent div

  // Create a node (circle) for the legend
  svgLegend
    .append("circle")
    .attr("cx", 20) // X position of the center of the circle
    .attr("cy", 25) // Y position of the center of the circle
    .attr("r", 4) // Radius of the circle
    .attr("fill", "#7ED4AD") // Fill color of the node
    .attr("stroke", "#000") // Border color of the node
    .attr("stroke-width", 2);

  // Add a label next to the node and center it horizontally
  svgLegend
    .append("text")
    .attr("x", 30) // Position the text next to the node
    .attr("y", 25) // Vertically align the text with the circle
    .attr("dy", ".35em") // Vertically center the text within the block
    .attr("text-anchor", "start") // Align text to the left (next to the circle)
    .text("Core Course") // The label text
    .style("font-size", "14px")
    .style("fill", "#333"); // Text color
}

async function main() {
  // let colorList = [
  //   "#000",
  //   "#d55e00",
  //   "#cc79a7",
  //   "#0072b2",
  //   "#f0e442",
  //   "#009e73",
  // ];
  // let pointer = 0;
  // let color = "";
  // async function changeColor() {}
  // let changeColorBtn = document.getElementById("change-color-btn");
  // changeColorBtn.addEventListener("click", async () => {
  //   await changeColor();
  // });
  await renderCourses();
  await renderChart();
  await chartLegend();
}

await main();
