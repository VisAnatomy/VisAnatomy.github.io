// will initialize the actual page content of the browser
// left side will contain the checkboxes for every tag
// right side will display a quick pre-image for the charts

// Splits up the screen into two portions for the faceted browising nav and the image grid displays

export function addPageBody() {
  const bodyDiv = document.getElementById("pagebody");

  bodyDiv.innerHTML = `

    <!-- actual page content -->
<div class="content">
    <div class="row">
        <!-- faceted browsing navigation -->
        <div
            class="col s4"
            style="
                position: fixed;
                top: 70px;
                left: 0px;
                bottom: 0px;
                overflow-y: auto;
            "
        >
            <div id="browserForm">
                <form action="#" id="facetedbrowsingform">
                    <div class="criteriagroup">
                        <ul class="collapsible">
                            <!-- Visualization elements -->
                            <li class="active">
                                <div class="collapsible-header">Visualization Elements</div>
                                <div class="collapsible-body">
                                    <div class="row">
                                        <div class="cols6">
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="area" value="area" />
                                                    <span>Area Chart</span>
                                                </label>
                                            </p>
                                            
                                            <p>
                                                <label>
                                                <input type="checkbox" name="bar" value="bar" />
                                                <span>Bar Chart</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="BoxAndWhisker" value="BoxAndWhisker" />
                                                <span>Box and Whisker Plot</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="bubble" value="bubble" />
                                                <span>Bubble Chart</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="bullet" value="bullet" />
                                                <span>Bullet Chart</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="bump" value="bump" />
                                                <span>Bump Chart</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="calendar" value="calendar" />
                                                <span>Calendar</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="candlestick" value="candlestick" />
                                                <span>Candlestick Chart</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="circle" value="circle" />
                                                <span>Circle Packing</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="connected" value="connected" />
                                                <span>Connected Dot Plot</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="connectedsp" value="connectedsp" />
                                                <span>Connected Scatterplot</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="density" value="density" />
                                                <span>Density Plot</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="diverging" value="diverging" />
                                                <span>Diverging Stacked Bar Chart</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="donut" value="donut" />
                                                <span>Donut Chart</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="dot" value="dot" />
                                                <span>Dot Plot</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="geo" value="geo" />
                                                <span>Geo Heatmap</span>
                                                </label>
                                            </p>
                    
                                            <p>
                                                <label>
                                                <input type="checkbox" name="grouped" value="grouped" />
                                                <span>Grouped Bar Chart</span>
                                                </label>
                                            </p>
                                        </div>
                                        <div class="col s6">
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="heatmap" value="heatmap" />
                                                    <span>Heatmap</span>
                                                </label>
                                            </p>
                                            
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="kagi" value="kagi" />
                                                    <span>Kagi Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="line" value="line" />
                                                    <span>Line Graph</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="marimekko" value="marimekko" />
                                                    <span>Marimekko Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="matrix" value="matrix" />
                                                    <span>Matrix Diagram</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="parallel" value="parallel" />
                                                    <span>Parallel Coordinates Plot</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="pie" value="pie" />
                                                    <span>Pie Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="polar" value="polar" />
                                                    <span>Polar Area Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="radar" value="radar" />
                                                    <span>Radar Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="radial" value="radial" />
                                                    <span>Radial Bar Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="range" value="range" />
                                                    <span>Range Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="scatterplot" value="scatterplot" />
                                                    <span>Scatterplot</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="spiral" value="spiral" />
                                                    <span>Spiral Plot</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="stacked" value="stacked" />
                                                    <span>Stacked Area Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="stacked-bar" value="stacked-bar" />
                                                    <span>Stacked Bar Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="stream" value="stream" />
                                                    <span>Stream Graph</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="treemap" value="treemap" />
                                                    <span>Treemap</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="violin" value="violin" />
                                                    <span>Violin Plot</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="waffle" value="waffle" />
                                                    <span>Waffle Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="waterfall" value="waterfall" />
                                                    <span>Waterfall Chart</span>
                                                </label>
                                            </p>
                                                
                                            <p>
                                                <label>
                                                    <input type="checkbox" name="word" value="word" />
                                                    <span>Word Cloud</span>
                                                </label>
                                            </p>

                                            <p>
                                                <label>
                                                <input type="checkbox" name="_bespoke" value="_bespoke" />
                                                <span>Composite</span>
                                                </label>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>

        <!-- search result image cards go here -->
        <div
            class="col s8"
            style="
                position: fixed;
                top: 75px;
                right: 0px;
                bottom: 0px;
                overflow-y: auto;
            "
        >
            <!-- <span>Search Results....</span> -->

            <!-- TODO: submit user data -->
            <!-- Modal Trigger -->
            <!-- <a class="waves-effect waves-light btn modal-trigger" href="#bookmarkModal" style="float: right; margin-right: 2px;">Bookmarks</a> -->
            <!-- Modal Trigger -->
            <!-- <a class="waves-effect waves-light btn modal-trigger" href="#modal1" style="float: right; margin-right: 2px;">Instructions</a> -->
            <div id="selectedterms">
                <div class="chips chips-initial"></div>
            </div>
            <div id="examplecards"></div>
        </div>

    </div>
</div>

<!-- Instructions Modal Structure -->

<!-- Bookmarks Modal Structure -->
<div id="bookmarkModal" class="modal modal-fixed-footer">
    <div class="modal-content">
        <!-- bookmarked views -->
        
        <div style="position: fixed;">
            <h3>Annotations View</h3>
        </div>
        
        <div id="bkModalContentsvg" style="position: fixed; width: 40%; margin-top: 3.2%;">
        </div>
        
        <div style="margin-left: 40%; margin-top: 3.2%;">
            <div id="json-display"></div>
        </div>
        
    </div>
    <div class="modal-footer">
    <a id="bkModalClose" href="#!" class="modal-close waves-effect waves-green btn-flat"
        >Close</a
    >
    </div>
</div>

<!-- <script type="text/javascript">

    //set user details for logging purposes
    var userdetails= {{data|tojson}}
</script> -->

    `;
}
