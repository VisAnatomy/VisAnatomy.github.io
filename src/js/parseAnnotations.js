// will parse Annotation Record csv file in /public
// for the needed info

// the additional info for each chart will be displayed as additional tags
// for each chart's example card

import Papa from 'papaparse'


export async function parseCSV() {
    
    const csv_data = [];

    await fetch('Annotation Record - [Augmentation] SVG Charts [ 8-13-24 ].csv')
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: (results) => {
                    const filteredData = results.data.map(row => {
                        return {
                            Type: row['Type'],
                            ID: row['ID'], 
                            charting_tool: row['charting tool'], 
                            chart_source: row['chart source'],
                            source_link: row['Source Link'],
                        };
                    });
                    csv_data.push(...filteredData);
                }
            });
        })
        .catch(error => console.error('Error fetching or parsing CSV file:', error));

    return csv_data;
}

