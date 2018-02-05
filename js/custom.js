/**
* Custom.js
* BBC Coding Assessment 2018
* @author Matthew Kent
*/
'use strict';

/**
 * Asynchronously load data from data.json using ES7 Fetch await
 * Handle any potential errors.
 */
async function loadData() {
    const response = await fetch('data.json');
    let data;
    if (response.ok) {
        data = await response.json();
    } else {
        data = `${response.status} when loading data.json`;
    }

    return data;
}

/**
 * @var headerArray - Array of formatted headers for the table
 * @var jsonKeys - Array of keys for the JSON objects
 */
let headerArray = ['Date', 'BBC One', 'BBC Two', 'BBC Three', 'BBC Four', 'BBC News 24', 'CBBC', 'CBeebies'];
let jsonKeys = ['date', 'bbcone', 'bbctwo', 'bbcthree', 'bbcfour', 'bbcnews24', 'cbbc', 'cbeebies'];

/**
 * filterKey()
 * @param {*string} key 
 * @param {*object} data 
 * @param {*string} type 
 * @return {*object} sorted
 * 
 * Sorts data into ascending and descending using keys.
 * The only key that is not handled the same is the date,
 * although the concept is here to handle numerous data types.
 * 
 * The date has the hyphen (-) replaced with an empty string, and then the 
 * value is parsed as an int to be sorted.
 * 
 * Makes use of ES6 arrow function (=>).
 */
function filterKey(key, data, type) {
    let comparison;

    if (type == 'asc') {
        if (key == 'date') {
            comparison = (k, kk) => parseInt(k.replace('-', '')) - parseInt(kk.replace('-', ''));
        } else {
            comparison = (k, kk) => data[k][key] - data[kk][key];
        }
    } else {
        if (key == 'date') {
            comparison = (k, kk) => parseInt(kk.replace('-', '')) - parseInt(k.replace('-', ''));
        } else {
            comparison = (k, kk) => data[kk][key] - data[k][key];
        }
    }

    let sorted = Object.keys(data).sort(comparison).reduce((a, d) => ({...a, ... {[d]: data[d]}}), {});

    return sorted;

}

/**
 * initFilter()
 * @param {*object} data 
 * 
 * Initialises the filter, removes the span class after filtering.
 */
function initFilter(data) {
    function reset() {
        let elems = document.querySelectorAll("#bbcdata th span"), obj;
        for (let i = 0; i < elems.length; i++) {
            obj = elems[i];
            obj.removeAttribute("class");
        }
    }

    /**
     * filter()
     * @param {*event} e 
     * Displays the filtered data in the tableData element. It also sets the data-type attribute
     * to the correct values after the user clicks within the header column. Span class is
     * set to the correct value in order to filter the data correctly.
     */
    function filter(e) {
        let tableData = document.getElementById("tbData"), elem = e.target;
        tableData.innerHTML = populateTable(filterKey(elem.getAttribute("data-key"), data, elem.getAttribute("data-type")));
        elem.setAttribute("data-type", elem.getAttribute("data-type") === "asc" ? "desc" : "asc");
        reset();
        elem.children[0].className = elem.getAttribute("data-type") === "asc" ? "desc" : "asc";

    }

    /**
     * Register onclick events for the table header columns. When the user
     * clicks on a header, pass the event to the filter function to display the
     * filtered data.
     */
    let elems = document.querySelectorAll("#bbcdata th"), obj;
    for (let i = 0; i < elems.length; i++) {
        obj = elems[i];
        obj.onclick = filter;
    }
}

/**
 * makeTable()
 * @param {*object} data 
 * @param {*string} type 
 * @return {*string} html
 * 
 * Constructs the HTML structure of the table, populates the header and table body with the
 * relevant object data. Returns the constructed HTML markup.
 */
function makeTable(data, type) {
    let html = "";
    html += "<thead><tr>";
    for (let i = 0; i < headerArray.length; i++) {
        html += "<th data-key=\"";
        html += jsonKeys[i];
        html += "\" data-type=\"asc\">";
        html += headerArray[i];
        html += "<span></span></th>";
    }
    html += "</tr></thead><tbody id=\"tbData\">";
    html += populateTable(data);
    html += "</tbody>";
    return html;
}

/**
 * populateTable()
 * @param {*object} data 
 * @return {*string} html
 * 
 * Populates the HTML table with the data object values. Loops through and determines that the first 
 * column will be a date and therefore to format it before hand.
 */
function populateTable(data) {
    let html = "";
    for (let i = 0; i < Object.keys(data).length; i++) {
        html += "<tr>";
        for (let j = 0; j < jsonKeys.length; j++) {
            html += "<td>";
            html += (j == 0) ? formatDate(Object.keys(data)[i].split('-')) : data[Object.keys(data)[i]][jsonKeys[j]];
            html += "</td>";
        }
        html += "</tr>";
    }
    return html;
}

/**
 * formatDate()
 * @param {*string} date 
 * @return {*string} formattedDate
 * 
 * Custom date formatting function. I chose to use a switch statement to highlight
 * another language construct however I could have stored the dates in an object and
 * dynamically attempted to return the key.
 */
function formatDate(date) {
    let year = date[0], month = date[1];
    switch (month) {
        case '01': month = 'January';
            break;
        case '02': month = 'February';
            break;
        case '03': month = 'March';
            break;
        case '04': month = 'April';
            break;
        case '05': month = 'May';
            break;
        case '06': month = 'June';
            break;
        case '07': month = 'July';
            break;
        case '08': month = 'August';
            break;
        case '09': month = 'September';
            break;
        case '10': month = 'October';
            break;
        case '11': month = 'November';
            break;
        case '12': month = 'December';
            break;

        default:
            return 'No Date';
    }

    return month + ' ' + year;
}

/**
 * makeBarGraph()
 * @param {*object} data 
 * 
 * Constructs the bar graph based off the data objects values. Determines chart headings and defines
 * a data set to be passed into highcharts.
 */
function makeBarGraph(data) {
    let seriesData = [];
    let headings = ["bbcfour", "bbcnews24", "bbcone", "bbcthree", "bbctwo", "cbbc", "cbeebies"];
    let dataSet = [[],[],[],[],[],[],[]];
    let keys;

    keys = Object.getOwnPropertyNames(data);
    let keyProperties = Object.values(data); // gets all headings of dates

    // populate headings
    for (let i in keyProperties) {
        let loop = 0;
        for (let j = 0; j < headings.length; j++) {
            dataSet[loop].push(keyProperties[i][headings[j]]);
            loop++;
        }

    }

    // Grab correct data from data set
    for (let i = 0; i < headings.length; i++) {
        let object = {
            name: headings[i],
            data: dataSet[i]
        }
        seriesData.push(object);
    }

    Highcharts.chart('barGraph', {
        chart: {
            type: 'column',
        },
        title: {
            text: 'BBC Monthly Broadcasting Data'
        },
        xAxis: {
            categories: keys,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Monthly Broadcasts'
            }
        },
        credits: {
            enabled: false
        },
        series: seriesData
    });
}