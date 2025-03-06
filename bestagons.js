// document.getElementById('loadButton').addEventListener('click', () => {
//     const selectedFile = document.getElementById('fileSelector').value;
//     // console.log(selectedFile)
//     // response = fetch("http://127.0.0.1:5000/load_tsv")

//     // fetch('http://127.0.0.1:5000/load_tsv', {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify({ filename: selectedFile })
//     // })
//     // .then(data => {
//     //     console.log(data);
//     // })
//     // .catch(error => console.error("Error fetching dataoopsie:", error));
//     console.log(selectedFile)
// });


// document.querySelectorAll('.grid-item').forEach(item => {
//     const svg = d3.select(item).append("svg");
//     const width = 80, height = 80;
//     const hexagon = [
//         [width / 2, 0], [width, height / 4], [width, (3 * height) / 4],
//         [width / 2, height], [0, (3 * height) / 4], [0, height / 4]
//     ];
//     svg.append("polygon")
//         .attr("points", hexagon.map(d => d.join(",")).join(" "))
//         .attr("fill", "#888")
//         .attr("stroke", "black")
//         .attr("stroke-width", "2");
// });
const vertex_labels = ['KS1295[%]', '6082[%]', '2024[%]', 'bat-box[%]', '3003[%]', '4032[%]']
const scalars = ['KS1295[%]', '6082[%]', '2024[%]', 'bat-box[%]', '3003[%]', '4032[%]', 'Al', 'Si', 'Cu', 'Ni', 'Mg', 'Mn', 'Fe', 'Cr', 'Ti', 'Zr', 'V', 'Zn', 'Vf_FCC_A1', 'Vf_DIAMOND_A4', 'Vf_AL15SI2M4', 'Vf_AL3X', 'Vf_AL6MN', 'Vf_MG2ZN3', 'Vf_AL3NI2', 'Vf_AL3NI_D011', 'Vf_AL7CU4NI', 'Vf_AL2CU_C16', 'Vf_Q_ALCUMGSI', 'Vf_AL7CU2FE', 'Vf_MG2SI_C1', 'Vf_AL9FE2SI2', 'Vf_AL18FE2MG7SI10', 'eut. frac.[%]', 'eut. T ( C)', 'T_FCC_A1', 'T_DIAMOND_A4', 'T_AL15SI2M4', 'T_AL3X', 'T_AL6MN', 'T_MG2ZN3', 'T_AL3NI2', 'T_AL3NI_D011', 'T_AL7CU4NI', 'T_AL2CU_C16', 'T_Q_ALCUMGSI', 'T_AL7CU2FE', 'T_MG2SI_C1', 'T_AL9FE2SI2', 'T_AL18FE2MG7SI10', 'T(liqu)', 'T(sol)', 'delta_T', 'delta_T_FCC', 'delta_T_Al15Si2M4', 'delta_T_Si', 'CSC', 'YS(MPa)', 'hardness(Vickers)', 'CTEvol(1/K)(20.0-300.0 C)', 'Density(g/cm3)', 'Volume(m3/mol)', 'El.conductivity(S/m)', 'El. resistivity(ohm m)', 'heat capacity(J/(mol K))', 'Therm.conductivity(W/(mK))', 'Therm. diffusivity(m2/s)', 'Therm.resistivity(mK/W)', 'Linear thermal expansion (1/K)(20.0-300.0 C)', 'Technical thermal expansion (1/K)(20.0-300.0 C)']

const default_scalars = ['Therm.conductivity(W/(mK))', 'Therm. diffusivity(m2/s)', 'Therm.resistivity(mK/W)', 'Linear thermal expansion (1/K)(20.0-300.0 C)', 'Technical thermal expansion (1/K)(20.0-300.0 C)']

// const cmaps_ = [["pink", "red"], ["cyan", "blue"], ["yellow", "green"], ["#fd8d3c", "#bd0026"], ["purple", "green"], ["blue", "green"]]

const cmaps = [
    ["#440154", "#3B528B", "#21908D", "#5DC963", "#FDE725"], // Viridis
    ["#3B4CC0", "#778BEB", "#D1D1D1", "#E66B60", "#B40426"], // Coolwarm
    ["#000004", "#420A68", "#932667", "#DD513A", "#FBA40A"],  // Inferno
    ["#3B4CC0", "#778BEB", "#D1D1D1", "#E66B60", "#B40426"], // Coolwarm

];

const num_hex=4

for (i=0; i<num_hex; i++){
    let gridid = "#hexagon"+i.toString()
    let dropdownid = "scalar_dropdown"+i.toString()
    let dropdown = d3.select(gridid)
        .append("select")
        .attr("id", dropdownid)
        .attr("class", "scalar_dropdown");


    dropdown.selectAll("option")
        .data(scalars)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

        dropdown.property("value", default_scalars[i]);

}




let vertices = []
let points = []
let scalar_fields = [] 
let selectedFile = ""
// THE LOAD DATA BUTTON
//loading happens here
document.getElementById('loadButton').addEventListener('click', () => {
    selectedFile = document.getElementById('fileSelector').value
    let hexagonDropdowns = getScalarsFromDropdown();
    console.log(hexagonDropdowns)

    console.log(selectedFile)
    let num_scalars = hexagonDropdowns.length;
    try {
        fetch("http://127.0.0.1:5000/load_tsv", {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: selectedFile,
                scalars: hexagonDropdowns,
                numHexagons: num_scalars
            })
        })
        .then((response => response.json()))
        .then((result)=>{
            vertices = result.vertices;
            points = result.points;
            scalar_fields = result.scalar_fields;
            console.log(vertices)
            console.log(points)
            console.log(scalar_fields)
            // const hexagon1Div = document.getElementById("hexagon1");
            // const width = hexagon1Div.offsetWidth
            // const height = hexagon1Div.offsetHeight
            // console.log(width, height)

            renderhexagons(0, scalar_fields[0]);
            renderhexagons(1, scalar_fields[1]);
            renderhexagons(2, scalar_fields[2]);
            renderhexagons(3, scalar_fields[3]);
        })


    } catch (error){
        console.error("Error fetching dataoopsie:", error);
    }



});

function getScalarsFromDropdown() {
    let scalars = []
    for (let i=0; i<num_hex; i++){
        let scalar = document.getElementById(`scalar_dropdown${i}`).value;
        // console.log("scalar_dropdown${i}")
        if(scalar) {
            scalars.push(scalar);
        }
        

    }
    return scalars
}
 
function linkedhexagons(){
    let temp = d3.selectAll("circle")
    d3.selectAll("circle")
        .each(function(d){
            d3.select(this)
                .on("mouseover", function(event){
                   // highlightpoints("."+this.className.baseVal)
                   d3.selectAll("."+this.className.baseVal)
                        .attr("stroke","black")
                        .attr("stroke_width",4)
                        .attr("r",3)
                })
        })
}

function renderhexagons(div_num, scalar_field){
    const divId = "hexagon"+String(div_num)
    console.log(divId)
    const colormap = cmaps[div_num]
    const hexagon1Div = document.getElementById(divId);
    console.log(hexagon1Div)
    const width = hexagon1Div.offsetWidth
    const height = hexagon1Div.offsetHeight
    
    // Define the scales for x and y using d3.scaleLinear
    const xScale = d3.scaleLinear()
        .domain([d3.min(vertices, d => d[0]), d3.max(vertices, d => d[0])])  // Data range
        .range([width*0.1, width*0.90]);  // Output range based on the div width
    
    const yScale = d3.scaleLinear()
        .domain([d3.min(vertices, d => d[1]), d3.max(vertices, d => d[1])])  // Data range
        .range([height*0.1, height*0.9]);  // Output range based on the div height

    const min = d3.min(scalar_field)
    const max = d3.max(scalar_field)
    const range = max-min


    const cmap = d3.scaleLinear()
        .domain([min, min+(range/4), min+(2*range/4), min+(3*range/4), max])  // Data range
        .range(colormap);  // Output range based on the div height
    
    // Select the div and append an SVG
    const svg = d3.select("#"+divId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "hexsvg"+String(div_num));
    const lineGenerator = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        .curve(d3.curveLinearClosed); 
    
    // Bind data and create circles
    svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[0]))  // Use xScale to map data to div's width
        .attr("cy", d => yScale(d[1]))  // Use yScale to map data to div's height
        .attr("r", 1)  // Set a radius for visibility
        .attr("fill", d=> cmap(scalar_field[d[2]])) // Set color
        .attr("id", d => ("point_"+String(div_num)+"_" + String(d[2])))
        // .attr("class", "hexpoints"+String(div_num))
        .attr("class", d => "point_"+String(d[2]));

    svg.append("path")
        .datum(vertices)  // Pass the array of points
        .attr("d", lineGenerator)  // Generate the path
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
        
    svg.selectAll("text")
        .data(vertices)
        .enter()
        .append("text")
        .attr("x", d => xScale(d[0])+width*0.02)  // Use xScale to map data to div's width
        .attr("y", d => yScale(d[1])+height*0.02)  // Use yScale to map data to div's height
        .attr("font-size", "14px")
        .attr("fill", "#999999")
        .text(d=>d[2]);
    linkedhexagons()
}





function handleDropdownChange(dropId, scalar_field){
    const div_num = parseInt(dropId.charAt(dropId.length - 1));
    colormap = cmaps[div_num]
    console.log(colormap)
    const min = d3.min(scalar_field)
    const max = d3.max(scalar_field)
    const range = max-min


    const new_cmap = d3.scaleLinear()
        .domain([min, min+(range/4), min+(2*range/4), min+(3*range/4), max])  // Data range
        .range(colormap);  
    // const new_cmap = d3.scaleLinear()
    //     .domain([min, max])  // Data range
    //     .range(["yellow", "green"]);

    d3.select("#hexsvg" + String(div_num))
        .selectAll("circle")
        .each(function(d) {  
            d3.select(this)
                .attr("fill", d=> new_cmap(scalar_field[d[2]]));  
        });
}



["scalar_dropdown0", "scalar_dropdown1", "scalar_dropdown2", "scalar_dropdown3"].forEach(id => {
    document.getElementById(id).addEventListener("change", function(event) {
        try{
            fetch("http://127.0.0.1:5000/change_hexagon", {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    scalar_field: event.target.value,
                    filename : selectedFile
                })
            })
            .then(response => response.json())
            .then(result => {
                scalar_field = result.scalar_field
                handleDropdownChange(id, scalar_field);

            })

        } catch (error){
            console.error("dataoopsie:", error);
        }
    });
});




document.getElementById('ClearSvg').addEventListener('click', () => {
    d3.selectAll("svg")
        .remove();
})

































// document.getElementsByClassName('scalar_dropdown').addEventListener('change', (e) => {
//     event_id =  e.target.id;
//     const scalar_attribute = document.getElementById(event_id).value;
//     console.log(selectedFile)
//     console.log(scalar_attribute)
//     console.log(event_id)
//     // response = fetch("http://127.0.0.1:5000/load_tsv")

//     // fetch('http://127.0.0.1:5000/load_tsv', {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify({ filename: selectedFile })
//     // })
//     // .then(response => response.json())
//     // .then(data => {
//     //     console.log(data);
//     //     document.getElementById('preview').textContent = JSON.stringify(data, null, 2);
//     // })
//     // .catch(error => console.error("Error fetching dataoopsie:", error));
// });

// document.getElementById("main-grid").addEventListener

// document.addEventListener("DOMContentLoaded", () => {
//     document.querySelector(".grid-container").addEventListener("click", (event) => {
//         if (event.target.classList.contains("dropdown-class")) {
//             console.log("Clicked element ID:", event.target.id);
//         }
//     });
// });