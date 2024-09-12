// eventually we want to convert the whole python backend into a javascript backend
// this is a translation of loadexamples.py in VisAnatomy/VisAnatomy_Browser/app into javascript

// const fs = require('fs');
// const csv = require('csv-parser');
// const Papa = require('papaparse');
import Papa from 'papaparse'

class Image {
    constructor(filename, description, source, tags) {
        this.filename = filename;
        this.description = description;
        this.source = source;
        this.tag = tags;
    }

    getFilename() {
        return this.filename;
    }

    getDescription() {
        return this.description;
    }

    getSource() {
        return this.source;
    }

    getMatchingTags(tags) {
        return [...new Set(this.tag.filter(tag => tags.includes(tag)))];
    }

    toString() {
        return `Filename: ${this.filename}\nDescription: ${this.description}\nSource: ${this.source}\nTags: ${this.tag.join(', ')}`;
    }
}

class Examples {
    // optional function (code) can be put in as parameter that is guaranteed to run after this.tags
    // is fully populated asynchronously
    // this ensures that the code will wait until the Examples object has been populated
    constructor(onTagsPopulated) {
        this.tags = {};
        // console.log('constructor has been called and this.tags has been initialized: ', this.tags);
        this.initialize().then(() => {
            if(onTagsPopulated){// if some code must be run after this.tags is populated
                onTagsPopulated()
            }
        });
    }
    // function to help with constructor initialization asynchronously
    async initialize(){
        await this.readTags();
        console.log("--> Tags of examples object have been fully populated");
    }
    async readTags() {
        
        
        
        // const svgJson = await fetch('SVG_Names.json')
        //     .then(response => response.json());


        // reads and parses thru examples_collection_output.csv
        // each row is an element of csv_file
        const csv_data = [];
        // fetching from the public folder
        await fetch('NEW-examples_collection_output.csv')
            .then(response => response.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true, // Set to true if the CSV has a header row
                    complete: (results) => {
                        csv_data.push(...results.data);
                    }
                });
            })
            .catch(error => console.error('Error fetching or parsing CSV file:', error));

        // console.log('csv_data', csv_data);

        // iterates thru all svg names and creates image object for each chart, 
        // which is then appended to the tags attribute(dictionary)
        for(let i = 0; i < csv_data.length; i++){
            let found_item = csv_data[i];
            let image = new Image(`${found_item['Type'].replace(/\s+/g, '')}${found_item['ID']}.png`, `${found_item['Type']} ${found_item['ID']}`, found_item['Link'], found_item['Tag']);
            if(this.tags[found_item['Tag'].trim()] == null){// array is placed in Examples object if its null
                this.tags[found_item['Tag'].trim()] = [];
            }
            this.tags[found_item['Tag'].trim()].push(image);

            // let target_value = svgJson[i].replace(".svg", '.png');
            // let row = csv_data.filter(element => element['Filename'] == target_value);
            // let found_item = row[0];
            // let image = new Image(`${found_item['Type'].replace(/\s+/g, '')}${found_item['ID']}.png`, `${found_item['Type']} ${found_item['ID']}`, found_item['Link'], found_item['Tag']);
            // if(this.tags[found_item['Tag'].trim()] == null){
            //     this.tags[found_item['Tag'].trim()] = [];
            // }
            // this.tags[found_item['Tag'].trim()].push(image);
        }

    }

    toString(){
        console.log("check")
        let str = "{\n";
        for(let key of Object.keys(this.tags)){
            str += key + ":\n"
            for(let i = 0; i < this.tags[key].length; i++){
                str += this.tags[key].join(',\n ')
            }
        }
        str += "}"
        return str;
    }


    /// parameter is an arraylist of tags
    // returns shuffled/randomized array of all the images corresponding to all the tags in parameter
    getImages(tag) {
        const examples = [];
        const examplesIds = new Set();
        for (const t of tag) {
            for (let image of this.tags[t]) {
                if (!examplesIds.has(image.filename)) {
                    const img = { ...image, tag: t };
                    examples.push(img);
                    examplesIds.add(img.filename);
                }
            }
        }
        // console.log(examples); // For debugging
        // shuffleArray(examples);
        return examples;
    }

    // returns a shuffled(randomized) array of all the images in this.tags
    getAllImages() {
        const examples = []; 
        const examplesIds = new Set();
        let keys_list = Object.keys(this.tags);

        for(let i = 0; i < keys_list.length; i++) {
            let key = keys_list[i];
            for(let j = 0; j < this.tags[key].length; j++){
                let image = this.tags[key][j];
                // if image is unique, then the image is added to examples
                if(!examplesIds.has(image.getFilename())){
                    const img = { ...image};
                    examples.push(img);
                    examplesIds.add(img['filename']);
                }
            }
        }
        // console.log(examples);

        // shuffleArray(examples);
        return examples;
    }

    // returns array of all tags
    getAllTags() {
        return Object.keys(this.tags);
    }

    // param is str, filename to be searched
    // returns exactly one image if one found in this.tags that matches
    // returns null if corresponding image not found
    getImage(filename) {
        for (const key of Object.keys(this.tags)){
            for (const image of this.tags[key]) {
                if (image.filename === filename) {
                    return image;
                }
            }
        }
        return null;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


//          TESTING
// const examples = new Examples(() => {
//     // code to be run after Examples object is initialized
//     console.log(examples.getAllImages());
//     // console.log(examples.getAllImages());
// });

// examples.getImages(['tag1', 'tag2']);
// console.log("This is test hehe: " + examples.area);

export { Examples };