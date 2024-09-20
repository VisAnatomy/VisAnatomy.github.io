// *** file to initialize browser functionality ***


// import './materialize.js';

// import the json editor library to display json in bookmark popup
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css"; // Import CSS for jsoneditor


import { Examples } from "./loadexamples.js";
import { parseCSV } from "./parseAnnotations.js"

var M;
var selectedTags = []; // global array holding list of currently selected chips
let examples; // global var used to hold an examples object
let tagData = []; // global var that will hold csv data from parseAnnotations.js that will be displayed as tags on example cards

var allSVGElementID = [];
var idMappings = {}; // To track original to new ID mappings
var indices = {}; // To track the number of each element type

// helper function called to initialize the global examples object used in this file (initialize.js)
function initializeExamples() {
  return new Promise((resolve) => {
    const exampleInstance = new Examples(() => {
      resolve(exampleInstance);
    });
  });
}

// begins initialization of all methods
export async function init(materializeJS) {
  // sets the global var M to the materialize js script object dynamically imported in main.js
  // so it can be used in this file as well
  M = materializeJS;
  // console.log('this should be the materialize js object', M);

  examples = await initializeExamples(); // will wait for examples to be fully initialized
  // document.addEventListener('DOMContentLoaded', function() {
  //     // Initialize Materialize components
  //     console.log('--> materialize components initialized')
  //     M.AutoInit();
  // });

  // Call parseCSV and assign the result to the global variable tagData
  await parseCSV().then(data => {
    tagData = data;
    // console.log('tagData:', tagData); // Optionally log the data
  }).catch(error => {
    console.error('Error loading CSV data:', error);
  });
  // console.log(Array.isArray(tagData));
  /****  testing *****/
  // console.log(tagData[2].Type === "Area Chart")

  // initializes modal
  initializeModal();

  // creates placeholder chips
  formSubmission();

  //adds all examples
  fetchExamples("all");

  // initializes chips and search bar
  // initiateChips([]);
}

// initializes Modals from materialize-css
function initializeModal() {
  // document.addEventListener('DOMContentLoaded', function() {
  //     var elems = document.querySelectorAll('.modal');
  //     var instances = M.Modal.init(elems);
  // });

  // console.log(typeof M);
  // accesses modal HTML element
  var modalWindow = document.querySelector("#bookmarkModal");
  // creates a listener for when link is clicked that initializes new modal
  if (modalWindow) {
    M.Modal.init(modalWindow, {
      onOpenStart: function (modal, trigger) {
        console.log("opened bookmarks");

        // will update modalWindow with necessary new data for clicked chart
        bookmarkModal(trigger.id);
      },
    });
  }

  // adds event listener to close button of modal that clears bk modal
  document
    .getElementById("bkModalClose")
    .addEventListener("click", function () {
      document.getElementById("bkModalContentsvg").innerHTML = "";
      document.getElementById("json-display").innerHTML = "";
    });
}

async function bookmarkModal(id) {
  var exampleCards = document.getElementById("bkModalContentsvg");
  var jsonDisplay = document.getElementById("json-display");

  // Clears previous content in exampleCards component
  while (exampleCards.firstChild) {
    exampleCards.removeChild(exampleCards.firstChild);
  }

  console.log("selected bookmarks id", id);

  // Retrieves the chosen chart's svg image
  try {
    const svgResponse = await fetch("examples_svg/" + id.replace("png", "svg"));
    const svgText = await svgResponse.text();
    
    allSVGElementID = [];
    idMappings = {}; // Reset ID mappings
    indices = {}; // Reset indices
    exampleCards.innerHTML = svgText;
    console.log("svg retrieved and displayed");

    let vis = exampleCards.firstChild;
    let i = 0;

    // Wait for vis element to be created
    while (!vis || !(vis instanceof SVGElement)) {
      console.log("Waiting for vis element...");
      await delay(50);  // Wait 50ms before checking again
      vis = exampleCards.firstChild;
      i++;
      if(i == 30){//prevents infinite loop
        return error;
      }
    }

    vis.setAttribute("id", "vis");
    const svgElement = document.querySelector("#vis");
    svgElement.removeAttribute("viewBox");
    addClassAndIdToLeaves(svgElement);
    updateUseElementReferences(svgElement);

    vis.setAttribute("width", "100%");
    vis.setAttribute("height", "100%");
  } catch (error) {
    console.error("Error fetching SVG:", error);
  }

  // Fetches the chosen chart's annotations and displays those annotations
  try {
    const annotationResponse = await fetch("annotations/" + id.replace("png", "json"));
    const data = await annotationResponse.json();
    console.log(data);

    let allBBoxes = Object.values(data.annotations.allGraphicsElement);
    let vb = {
      left: allBBoxes.map((bbox) => bbox.left).reduce((a, b) => Math.min(a, b)),
      top: allBBoxes.map((bbox) => bbox.top).reduce((a, b) => Math.min(a, b)),
      right: allBBoxes.map((bbox) => bbox.right).reduce((a, b) => Math.max(a, b)),
      bottom: allBBoxes.map((bbox) => bbox.bottom).reduce((a, b) => Math.max(a, b)),
    };

    let margin = 15;
    let vbString = [
      vb.left - margin,
      vb.top - margin,
      vb.right - vb.left + margin * 2,
      vb.bottom - vb.top + margin * 2,
    ].join(",");

    let vis = exampleCards.firstChild;
    vis.setAttribute("viewBox", vbString);

    // Create the editor instance
    var editor = new JSONEditor(jsonDisplay, {
      mode: "view",
      modes: ["view", "code"], // available modes
      onError: function (err) {
        console.log(err);
      },
    });

    // Set JSON data
    editor.set(data);
  } catch (error) {
    console.log("annotations not found: " + error);
    var temp = { file: "missing" };

    // Create the editor instance
    var editor = new JSONEditor(jsonDisplay, {
      mode: "view",
      modes: ["view", "code"], // available modes
      onError: function (err) {
        console.log(err);
      },
    });

    // Set JSON data
    editor.set(temp);
  }

  // Utility function to introduce delay
  function delay(ms) {
    console.log("waiting for vis to be created");
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // fetches the chosen chart's annotations
  // and displays those annotations
  // fetch("../assets/annotations/"+id.replace("png", "json"))
  //     .then(r=> r.text())
  //     .then((text)=>{
  //         try {
  //             // viewer= documen.querySelector("#json-display")
  //             new JsonViewer({
  //                 value: JSON.parse(text),
  //                 defaultInspectDepth: 2,
  //                 theme: 'Light'
  //             }).render('#json-display')//https://www.jsdelivr.com/package/npm/@textea/json-viewer
  //             // viewer.data=JSON.parse(text) //https://github.com/alenaksu/json-viewer
  //             // $("span:contains('annotations:')").collapse("toggle")
  //         } catch (error) {
  //             console.log("annotations not found: " + error);
  //             var temp = '{"file" : "missing"}';
  //             new JsonViewer({
  //                 value: JSON.parse(j),
  //                 defaultInspectDepth: 2
  //             }).render('#json-display')
  //         }
  //     })
}

function addClassAndIdToLeaves(element) {
  // Set ID
  if (element.nodeType === Node.ELEMENT_NODE && element.nodeName !== "svg") {
    let originalId = element.getAttribute("id"); // Get original ID if exists
    if (!Object.keys(indices).includes(element.nodeName)) {
      indices[element.nodeName] = 0;
    }
    if (
      element.nodeName !== "linearGradient" &&
      element.nodeName !== "g" &&
      element.nodeName.indexOf(":") === -1
    ) {
      let newId = element.nodeName + indices[element.nodeName]++;
      element.setAttribute("id", newId);
      allSVGElementID.push(newId);
      if (originalId) {
        idMappings[originalId] = newId; // Track original to new ID
      }
    }
  }

  if (element.hasChildNodes()) {
    element.childNodes.forEach((childNode) => {
      addClassAndIdToLeaves(childNode);
    });
  } else {
    // Set class for specific elements
    setClassForSpecificElements(element);
  }
}

function setClassForSpecificElements(element) {
  if (
    [
      "rect",
      "circle",
      "ellipse",
      "text",
      "line",
      "polyline",
      "polygon", // Fixed typo 'polygon' to 'polygon'
      "path",
      "image",
      "use",
    ].includes(element.nodeName)
  ) {
    if (element.hasAttribute("class")) {
      const existingClasses = element.getAttribute("class").split(" ");
      if (!existingClasses.includes("mark")) {
        element.setAttribute("class", `${element.getAttribute("class")} mark`);
      }
    } else {
      element.setAttribute("class", "mark");
    }
  }
}

// After all elements have been processed, update <use> element references
function updateUseElementReferences(svgElement) {
  svgElement.querySelectorAll("use").forEach((use) => {
    let href = use.getAttribute("href") || use.getAttribute("xlink:href");
    if (href && href.includes("#")) {
      let originalId = href.split("#")[1];
      if (idMappings[originalId]) {
        let newHref = "#" + idMappings[originalId];
        use.setAttribute("href", newHref); // Update for modern browsers
        use.setAttribute("xlink:href", newHref); // Update for compatibility
      }
    }
  });
}

// any time form(checkboxes) changed, will update tiles on right
function formSubmission() {
  var form = document.querySelector("form");
  // adds event listener for any time a checkbox is changed (i.e. form is changed)
  form.addEventListener("change", (e) => {
    selectedTags = []; //empties the list of selected tags
    const checkboxes = document.querySelectorAll(
      "input[type=checkbox]:checked"
    ); // creates list of all checked checkboxes
    // iterates thru list and pushes all checked boxes into selectedTags list
    checkboxes.forEach(function (checkbox) {
      selectedTags.push(checkbox.value);
    });

    /*****  portion of code that seems to be useless *****/
    /*****          its supposedly supposed to compare a global oldTags var with the new selected tags, 
         *              and return any tags that are in the old tags but not the new (ones that were deleted
         * 
        // var deletedTag
        // if(oldtags.length > selectedTags.length){
        //     deletedTag=getDifference(selectedtags, oldtags)[0];
        // }
        // if (oldtags.length < selectedtags.length){
        //     // idek what is supposed to go here breh
        // }

        // function getDifference(setA, setB) {
        //     return setB.filter(x => !setA.includes(x));
        //   }


        var chipsData = (M.chips.getInstance(document.querySelector('.chips'))).chipsData;
        chipsData.forEach(e => {
            if (e.tag == deletedTag){
                //console.log('removing tag', e.tag)
            } else {
                if (!selectedtags.includes(e.tag)){
                    selectedtags.push(e.tag);
                }
            }
        });
                    ******/

    // sets chips array to be each element of selectedTags
    var chips = Array();
    selectedTags.forEach(function (currTag) {
      chips.push({
        tag: currTag,
      });
    });
    // console.log('selected chips: ', chips);
    // initalizes necessary chips based on selectedTags

    /******************************************************************************************** 
        initiateChips(chips);
        *********************************************************************************************/

    // fetches the necessary examples
    if (selectedTags.length == 0) {
      // no tags selected
      fetchExamples("all");
    } else {
      fetchExamples(selectedTags);
    }
  });
}

// initiates chips based on parameter (list of chips with currently selectedtags as its tags)
function initiateChips(data) {
  var tags = {};
  // gets list of all tags
  var keyList = examples.getAllTags();
  // console.log('keylist: ', keyList);

  // sets tags to be dictionary where each key is a tag and corresponding value is none/null
  keyList.forEach((key) => {
    tags[key] = null;
  });
  // console.log('check1: ', tags);

  /***** MIGHT NEED TO CONVERT TAGS INTO JSON OBJECT FOR .CHIPS TO WORK */

  document.querySelector(".chips-initial").M.Chips.init({
    data: data,
    autocompleteOptions: {
      data: tags,
      limit: Infinity,
      minLength: 1,
    },
    onChipDelete: (e, d) => {
      var chip = d.childNodes[0].textContext; // deleted chip
      // console.log("removing tag: ", chip);
      selectedTags = Array(); // resets global seletedTags array

      // loop to remove deleted chip from selectedTags[]
      const checkboxes = document.querySelectorAll(
        "input[type=checkbox]:checked"
      ); // creates list of all checked boxes
      checkboxes.forEach(function (checkbox) {
        // adds all checkboxes to selectedtags list
        selectedTags.push(checkbox.value);
        // if any of these tags is the removed chip, that tag is removed from selectedTags[]
        if (checkbox.value == chip) {
          checkbox.checked = false;
        }
      });

      // adds all the chips that are still selected to selectedtags
      var chipsData = M.Chips.getInstance(
        document.querySelector(".chips")
      ).chipsData;
      chipsData.forEach((e) => {
        selectedTags.push(e.tag);
      });
      //makes sure deleted chip is not in selectedTags[]
      selectedTags = selectedTags.filter(function (value, index, arr) {
        return value != chip;
      });

      // sets chips
      var chips = Array();
      selectedTags.forEach(function (currTag) {
        chips.push({
          tag: currTag,
        });
      });

      if (selectedTagsTags.length == 0) {
        // no tags selected
        fetchExamples("all");
      } else {
        fetchExamples(selectedTags);
      }
    },
    onChipAdd: (e, d) => {
      selectedTags = Array(); // resets global var
      // adds all chips to selected tags
      var chipsData = M.chips.getInstance(
        document.querySelector(".chips")
      ).chipsData;
      chipsData.forEach((e) => {
        selectedTags.push(e.tag);
      });

      // makes sure all checkboxes that have initialized chips are checked
      const checkboxes = document.querySelectorAll(
        "input[type=checkbox]:checked"
      ); // creates list of all checked boxes
      checkboxes.forEach(function (checkbox) {
        // checks off all necessary boxes
        if (selectedTags.includes(checkbox.value)) {
          checkbox.checked = true;
        }
      });

      fetchExamples(selectedTags);
    },
  });
}

// fetches necessary examples from examples object based on selectedTags
function fetchExamples(selTags) {
  // console.log('examples: ', examples);
  // console.log('jeff: ', examples.getAllImages());
  if (selTags == "all") {
    createExampleCards(examples.getAllImages());
  } else {
    createExampleCards(examples.getImages(selTags));
  }
}

// creates example cards based on parameter (list of examples objects)
function createExampleCards(examples) {
  console.log('examples', examples);
  console.log('tagData', tagData);

  var exampleCards = document.querySelector("#examplecards");
  while (exampleCards.firstChild) {
    // deletes all content existing within exampleCards component
    exampleCards.removeChild(exampleCards.firstChild);
  }

  if (examples.length == 0) {
    // if parameter has no examples
    exampleCards.innerHTML = "No results returned for search parameters";
  }

  // generate the html for each imagecard and append to the example cards
  var i = 0;
  var div = document.createElement("div"); // will be row of 3 example cards
  div.className = "row";
  while (i < examples.length) {
    var shortDesc = examples[i].description.split(" ").slice(0, 10).join(" ");
    var tag = ''; // will be string that's displayed in each example card
    // strings holding the data for each example from tagData[]
    var chartingTool = '';
    var chartSource = '';
    var sourceLink = '';
    
    // initializes chartingTool and chartSource with the corresponding data from Annotation Record csv
    var targetTag = examples[i].description.trimEnd();
    // console.log("'" + targetTag + "'")
    var foundRow;
    // console.log(typeof tagData[979].Type, tagData[979].Type)
    // console.log(typeof targetTag, targetTag)
    tagData.forEach(function(item) { 
      var itemName = item.Type + " " + item.ID;
      // console.log(itemName + ' | ' + targetTag);
      if(itemName === targetTag){
        foundRow = item;
        chartingTool = foundRow.charting_tool;
        chartSource = foundRow.chart_source;
        sourceLink = foundRow.source_link;
      };
    })
    
    // if chartingTool not specified then display chartSource
    if(chartingTool === ''){
      if(chartSource === ''){
        tag = 'Source Link'
      } else {
        tag = chartSource;
      }
    } else {
      tag = chartingTool;
    }
    
    
    // console.log(chartingTool);
    // console.log(chartSource);
    // console.log(sourceLink);

    var altimg = "sample-1.jpeg";

    var subdiv = document.createElement("div"); // will hold the individual examplecard HTML
    var source = ""; // source for image
    subdiv.className = "col s4"; // for materialize css grid formatting
    subdiv.innerHTML += `
      <div class="card sticky-action">
        <div class="card-image-pop">
          <div class="card-image waves-effect waves-block waves-light" id="wholeCard">
            <img class="activator" id="${examples[i].filename}" src="examples_png/${examples[i].filename}" alt="missing image" onerror="this.onerror=null; this.src='${altimg}'">
          </div>
          <div class="card-content">
            <p>
              <a class="modal-trigger" id="${examples[i].filename}" href="#bookmarkModal" data-id="${examples[i].filename}">
                ${examples[i].filename.slice(0, -4)}
              </a>
            </p>
            <p>
              <a id="${examples[i].filename}" onclick="expandExample('${examples[i].filename}')" target="_blank">
              </a>
            </p>
          </div>
        </div>
        <div class="card-action">
          <div class="search-chip">
            <a href="${sourceLink}" target="_blank">
              ${tag}
              <i class="material-icons"></i>
            </a>
          </div>
        </div>
      </div>  
    `;

    // appends this example card to div (current row)
    div.appendChild(subdiv);

    // if div is full (3 examplecards) then append to examplecards div and then reset div to new empty row
    if (div.childElementCount == 3 || i == examples.length - 1) {
      exampleCards.appendChild(div);
      div = document.createElement("div");
      div.className = "row";
    }
    i++;
  }
}
