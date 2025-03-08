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

const default_scalars = ['Therm.conductivity(W/(mK))', 'T(sol)' ,'T(liqu)', 'Vf_DIAMOND_A4']

// const cmaps_ = [["pink", "red"], ["cyan", "blue"], ["yellow", "green"], ["#fd8d3c", "#bd0026"], ["purple", "green"], ["blue", "green"]]

const cmaps = [
    ["#440154", "#3B528B", "#21908D", "#5DC963", "#FDE725"], // Viridis
    ["#3B4CC0", "#778BEB", "#D1D1D1", "#E66B60", "#B40426"], // Coolwarm
    ["#000004", "#420A68", "#932667", "#DD513A", "#FBA40A"],  // Inferno
    ["#3B4CC0", "#778BEB", "#D1D1D1", "#E66B60", "#B40426"], // Coolwarm

];

const num_hex=4
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}


document.getElementById('ClearSvg').addEventListener('click', () => {
    // console.log("\n shfshfkshfks \n")
    d3.selectAll("svg")
        .remove();
})


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

//This is for adding the scalar fields in the contour dropdown
d3.select("#contour_field")
.selectAll("option")
.data(scalars)
.enter()
.append("option")
.text(d => d)
.attr("value", d => d);

//This list determines the selected contour scalar field
document.getElementById("contour_field").addEventListener("change", function(event) {
    contour_field = event.target.value
    // console.log(contour_field)
    let field_index = scalars.indexOf(contour_field)
    try{
        fetch("http://127.0.0.1:5000/field_range", {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                scalar_field: contour_field,
            })
        })
        .then(response => response.json())
        .then(result => {
            max_val = result.max
            min_val = result.min
            // console.log(max_val)
            // console.log(min_val)
            document.getElementById("contour_control").max = max_val
            document.getElementById("contour_control").min = min_val 

            d3.select("#minVal")
                .text(min_val.toFixed(1))

            d3.select("#maxVal")
                .text(max_val.toFixed(1))
            

        })
    } catch (error){
        console.error("dataoopsie:", error);
    }
    // console.log(contour_field)
});



let vertices = []
let points = []
let scalar_fields = [] 
let affine_vertices= []
let selectedFile = ""
let gradient_mode = 0
let contour_mode = 0
let selected_point = ""
let selected_fig = ""
let contour_field = ""

// THE LOAD DATA BUTTON
//loading happens here
document.getElementById('loadButton').addEventListener('click', () => {
    selectedFile = document.getElementById('fileSelector').value
    let hexagonDropdowns = getScalarsFromDropdown();
    // console.log(hexagonDropdowns)

    // console.log(selectedFile)
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
            affine_vertices = result.inputs

            // console.log(vertices)
            // console.log(points)
            // console.log(scalar_fields)

            renderhexagons(0, scalar_fields[0]);
            // renderhexagons(1, scalar_fields[1]);
            // renderhexagons(2, scalar_fields[2]);
            // renderhexagons(3, scalar_fields[3]);
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

function show_data(id)
{
    let scalars = getScalarsFromDropdown();
    id = id.replace('point_', '')
    id = parseInt(id)
    for(let i = 0; i < 4; i++)
    {
        d3.select("#show_data")
        .append("text")
        .attr("x",0)
        .attr("y",(i+1)*50)
        .html("<b>"+scalars[i] + ":</b> <br>" + String(scalar_fields[i][id]))
        .append('br')
        .append('br')
        .append("text")
    }
    for(let i = 0; i<6; i++){
        d3.select("#show_datapoints")
            .append("text")
            .attr("x",0)
            .attr("y",0)
            .html("<b>"+ vertex_labels[i]+":</b>"+affine_vertices[id][i]+"<br>")
    }

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
                        .attr("stroke-width",4)
                        .attr("r",8)
                    show_data(this.className.baseVal)
                })
                .on("mouseout", function(event){
                    // highlightpoints("."+this.className.baseVal)
                    if(selected_point != this.className.baseVal)
                    {
                        d3.selectAll("."+this.className.baseVal)
                            .attr("stroke-width",0)
                            .attr("r",1)
                        d3.selectAll(".dabba").selectAll("*").remove();
                    }
                 })
                 .on("click", function(event){
                    // highlightpoints("."+this.className.baseVal)
                    d3.selectAll("."+this.className.baseVal)
                        .attr("stroke","black")
                        .attr("stroke-width",4)
                        .attr("r",8)
                     show_data(this.className.baseVal)
                     selected_point = this.className.baseVal
                     selected_fig = this.id
                     selected_fig = selected_fig.replace("point_","")
                     selected_fig = selected_fig[0]
                     selected_fig = document.getElementById("scalar_dropdown"+selected_fig).value
                     console.log("CHECK: ",selected_fig)

                 })
                    
        })
}

function renderhexagons(div_num, scalar_field){
    const divId = "hexagon"+String(div_num)
    // console.log(divId)
    const colormap = cmaps[div_num]
    const hexagon1Div = document.getElementById(divId);
    // console.log(hexagon1Div)
    const height = Math.min(hexagon1Div.offsetWidth, hexagon1Div.offsetHeight)
    const width = height * 1.1

    
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
        //.attr("class", "hexpoints"+String(div_num))
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
        .attr("x", d => xScale(d[0])+(d[0] <= 0 ? -width * 0.09: width*0.02))  // Use xScale to map data to div's width
        .attr("y", d => yScale(d[1])+height*0.02)  // Use yScale to map data to div's height
        .attr("font-size", "14px")
        .attr("fill", "#999999")
        .text(d=>d[2]);
    const colorBarHeight = height
    const colorBarWidth = height*0.05
    const cmap_svg = d3.select("#"+divId)
        .append("svg")
        .attr("width", 4*colorBarWidth)
        .attr("height", colorBarHeight)
        .attr("class", "colormapsvg")
        .attr("id", "colormapsvg"+String(div_num));

    cmap_svg.append('g')
        .selectAll("rect")
        .data(d3.range(d3.min(scalar_field), d3.max(scalar_field), (d3.max(scalar_field) - d3.min(scalar_field)) / 100))
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => colorBarHeight - (i * (colorBarHeight / 100)) ) // Space out the rectangles vertically
        .attr("width", colorBarWidth)
        .attr("height", colorBarHeight / 100)  // Each rectangle's height is proportional
        .attr("fill", d => cmap(d));

    cmap_svg.append("text")
        .attr("id", "mincmap"+String(div_num))
        .attr("x", 2*colorBarWidth)  // Position the text slightly to the right of the color bar
        .attr("y", colorBarHeight-10)  // Position it at the bottom
        .attr("text-anchor", "middle")
        .text(d3.min(scalar_field).toFixed(1))  // Display the minimum value of the scalar field
        .style("font-size", "20px");
    cmap_svg.append("text")
        .attr("id", "maxcmap"+String(div_num))
        .attr("x", 2*colorBarWidth)  // Position the text slightly to the right of the color bar
        .attr("y", 30)  // Positin it at the top of the color bar
        .attr("text-anchor", "middle")
        .text(d3.max(scalar_field).toFixed(1))  // Display the maximum value of the scalar field
        .style("font-size", "20px");

    linkedhexagons()
}



document.getElementById('ClearSel').addEventListener('click', () => {
    handleDropdownChange("scalar_dropdown0", scalar_fields[0])
    handleDropdownChange("scalar_dropdown1", scalar_fields[1])
    handleDropdownChange("scalar_dropdown2", scalar_fields[2])
    handleDropdownChange("scalar_dropdown3", scalar_fields[3])
    try {
        fetch("http://127.0.0.1:5000/empty_path", {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
        })
        .then((response => response.json()))

    } catch (error){
        console.error("Error fetching dataoopsie:", error);
    }

})





function handleDropdownChange(dropId, scalar_field){
    const div_num = parseInt(dropId.charAt(dropId.length - 1));
    scalar_fields[div_num] = scalar_field

    colormap = cmaps[div_num]
    // console.log(colormap)
    const min = d3.min(scalar_field)
    const max = d3.max(scalar_field)
    const range = max-min

    const hexagon1Div = document.getElementById("hexagon"+String(div_num));
    const height = Math.min(hexagon1Div.offsetWidth, hexagon1Div.offsetHeight)
    const width = height * 1.1

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
                .attr("fill", d=> new_cmap(scalar_field[d[2]]))
                .attr("r", 1)
                .attr("stroke-width", 0); 
    const colorBarHeight = height
    const colorBarWidth = height*0.05
    const cmap_svg = d3.select("#colomapsvg"+String(div_num))
    // console.log(cmap_svg)
    // cmap_svg.selectAll("*")
    //     .remove()
    
    // cmap_svg.append('g')
    //     .selectAll("rect")
    //     .data(d3.range(d3.min(scalar_field), d3.max(scalar_field), (d3.max(scalar_field) - d3.min(scalar_field)) / 100))
    //     .enter()
    //     .append("rect")
    //     .attr("x", 0)
    //     .attr("y", (d, i) => colorBarHeight - (i * (colorBarHeight / 100)) ) // Space out the rectangles vertically
    //     .attr("width", colorBarWidth)
    //     .attr("height", colorBarHeight / 100)  // Each rectangle's height is proportional
    //     .attr("fill", d => new_cmap(d));

    // cmap_svg.append("text")
    //     .attr("x", 2*colorBarWidth)  // Position the text slightly to the right of the color bar
    //     .attr("y", colorBarHeight-10)  // Position it at the bottom
    //     .attr("text-anchor", "middle")
    //     .text(d3.min(scalar_field).toFixed(1))  // Display the minimum value of the scalar field
    //     .style("font-size", "20px");
    // cmap_svg.append("text")
    //     .attr("x", 2*colorBarWidth)  // Position the text slightly to the right of the color bar
    //     .attr("y", 30)  // Positin it at the top of the color bar
    //     .attr("text-anchor", "middle")
    //     .text(d3.max(scalar_field).toFixed(1))  // Display the maximum value of the scalar field
    //     .style("font-size", "20px");

    d3.select("#maxcmap"+String(div_num))
        .text(d3.max(scalar_field).toFixed(1))  // Display the maximum value of the scalar field
        .style("font-size", "20px");
    d3.select("#mincmap"+String(div_num))
        .text(d3.min(scalar_field).toFixed(1))  // Display the maximum value of the scalar field
        .style("font-size", "20px");
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

//This is for grad_forward and grad_backward

checkbox1 = document.getElementById('grad_check');

// Add an event listener for the 'change' event
checkbox1.addEventListener('change', function() {
    if (checkbox1.checked) {
        console.log('Checkbox is checked!');
        gradient_mode = 1
    } else {
        console.log('Checkbox is unchecked!');
        gradient_mode = 0
    }
})

checkbox2 = document.getElementById('contour_check');

// Add an event listener for the 'change' event
checkbox2.addEventListener('change', function() {
    if (checkbox2.checked) {
        // console.log('Checkbox is checked!');
        contour_mode = 1
    } else {
        // console.log('Checkbox is unchecked!');
        contour_mode = 0
    }
})

document.getElementById("grad_forward").addEventListener('click', () => {
    console.log(gradient_mode)
    if(gradient_mode === 1)
    {
        let id = selected_point.replace('point_', '')
        id = parseInt(id)
        // console.log(id)
        try {
            fetch("http://127.0.0.1:5000/grad_forward", {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    index: id,
                    column: selected_fig
                })
            })
            .then((response => response.json()))
            .then((result)=>{
                let grad_point = result.grad_point
                d3.selectAll(".point_"+String(grad_point))
                .raise()
                .attr("stroke","black")
                .attr("stroke-width",4)
                .attr("r",8)
                selected_point = "point_"+String(grad_point)
                console.log(selected_point)
            })



        } catch (error){
            console.error("Error fetching dataoopsie:", error);
        }
    }
});

document.getElementById("grad_backward").addEventListener('click', () => {
    console.log(gradient_mode)
    if(gradient_mode === 1)
    {
        let id = selected_point.replace('point_', '')
        id = parseInt(id)
        // console.log(id)
        try {
            fetch("http://127.0.0.1:5000/grad_backward", {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    index: id,
                    column: selected_fig
                })
            })
            .then((response => response.json()))
            .then((result)=>{
                let grad_point = result.grad_point
                d3.selectAll(".point_"+String(grad_point))
                .raise()
                .attr("stroke","black")
                .attr("stroke-width",4)
                .attr("r",8)
                selected_point = "point_"+String(grad_point)
                console.log(selected_point)
            })



        } catch (error){
            console.error("Error fetching dataoopsie:", error);
        }
    }
});

document.getElementById("contour_control").addEventListener('change', (e) => {
    // console.log(contour_mode)
    if(contour_mode === 1)
    {
        let value = e.target.value;
        // console.log(value)
        d3.select("#currentcontourval")
            .text("Current value: " +value)
        let col = scalars.indexOf(contour_field)
 
        try {
            fetch("http://127.0.0.1:5000/contour", {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value: value,
                    column: contour_field
                })
            })
            .then((response => response.json()))
            .then((result)=>{
                contour = result.contour
                // console.log(contour)
                let temp_color = getRandomColor()
                for(let i = 0; i<contour.length;i++)
                {
                    let selection = d3.selectAll(".point_"+String(contour[i]))
                    // console.log("ULT: ",selection.size())
                    d3.selectAll(".point_"+String(contour[i]))
                    .raise()
                    .attr("stroke","black")
                    .attr("fill",temp_color)
                    .attr("stroke-width",1)
                    .attr("r",3)
                }
            })


        } catch (error){
            console.error("Error fetching dataoopsie:", error);
        }
    }
});