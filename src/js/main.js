import "../styles/index.css";

// import Materialize stylesheet
import "../styles/materialize.min.css";

// import '../styles/nav.css'
// import './styles/browserForm.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

import { addPageBody } from "./addPagebody.js";
import { init } from "./initialize.js";

// Dynamically load the materialize JS
import("materialize-css/dist/js/materialize.min.js")
  .then(({ default: M }) => {
    console.log("==> Materialize JS loaded successfully:", M);
    // Check if document is already loaded
    if (document.readyState === "loading") {
      // Document is not fully loaded, wait for DOMContentLoaded
      document.addEventListener("DOMContentLoaded", function () {
        console.log(
          "==> DOMContentLoaded event fired, initializing all MaterializeCSS components now"
        );
        initializeMaterializeCSS(M);
      });
    } else {
      // Document is already loaded
      console.log(
        "==> Document already loaded, initializing all MaterializeCSS components now"
      );
      initializeMaterializeCSS(M);
    }
  })
  .catch((err) => {
    console.error("==> Materialize JS failed to load:", err);
  });

// document.addEventListener('DOMContentLoaded', function() {
//   // Initialize Materialize components
//   console.log('--> materialize components initialized')
//   M.AutoInit();
// });

document.querySelector("#app").innerHTML = `
  <div>
    <!-- add a divider row to contain the title of the page and other stuff -->
    <nav style="position: fixed; top: 0px">
      <div class="nav-wrapper">
        <a href="#" class="brand-logo left"
          >VisAnatomy: An SVG Chart Corpus with Fine-Grained Semantic Labels </a
        >
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li>
            <a href="javascript:void(0)"
              ><div
                id="counter"
                style="text-align: right; display: none"
                class="flow-text"
              >
                Time left: <span id="timer"></span></div
            ></a>
          </li>
          <!--- <li><a href="collapsible.html">JavaScript</a></li> --->
        </ul>
      </div>
    </nav>

    <!-- Split up the screen into two portions for the faceted browising nav and the image grid displays -->
    <div id="pagebody">
      <!--- will be initialized by addPagebody.js -->
    </div>
  </div>
`;
// adds pages HTML elements
addPageBody();

// initializes all materialize components and then begins page initialization
function initializeMaterializeCSS(M) {
  if (M) {
    M.AutoInit();
    console.log(
      "==> ALL MaterializeCSS components initialized successfully, calling init() now"
    );
    init(M); // initializes js for all components on page (from initialize.js)
  } else {
    console.error("==> ALL MaterializeCSS components failed to initialize");
  }
}

// setupCounter(document.querySelector('#counter'))
