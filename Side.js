class Side {
    constructor() {
        d3.csv("Video_Games.csv").then(data => {
            let genres = ["All", ...new Set(data.map(d => d.Genre))];
            let publishers = ["All", ...new Set(data.map(d => d.Publisher))];

        var sideDiv = document.getElementById("side");
        const regionNames = [{Name: "North America", Color: '#ed5555'}, 
                            {Name: "Europe", Color: '#b4c468'},
                            {Name: "Japan", Color: '#b8a7ea'},
                            {Name: "Other", Color: '#b7e0dc'}
            ]

        const projectTitle = d3.select("#side")
            .append("div")
            .text("Visualizing Video Game Sales")
            .style("font-size", "32px")
            .style("color", "white")
            .style("font-weight", "bold");

        const authors = d3.select("#side")
            .append("div")
            .text("Thayer Ackerman, Zachary Crunkleton, Laura Roseman")
            .style("color", "lightgray");

        const regionsTitle = d3.select("#side")
            .append("div")
            .style("margin-top", "64px")
            .text("Regions")
            .style("font-size", "22px")
            .style("color", "lightgray")
            .style("font-weight", "bold");

        const regions = d3.select("#side")
            .selectAll(".regionsChecklist")
            .data(regionNames)
            .enter()
            .append("div");

        regions.append("input")
            .attr("type", "checkbox")
            .attr("checked", "true")
            .attr("name", d=>d.Name)
            .attr("class", "region")
            .on("change", function() {
                changeRegion();
            });

        regions.append("label")
            .style("color", d=>d.Color)
            .style("font-weight", "bold")
            .text(d=>d.Name)
            .attr("for", d=>d.Name);

        

        const treeTitle = d3.select("#side")
            .append("div")
            .style("margin-top", "64px")
            .text("Tree Options")
            .style("font-size", "22px")
            .style("color", "lightgray")
            .style("font-weight", "bold");
        var curPublisher = "All";
        var curGenre = "All";
        const genreTitle = d3.select("#side")
            .append("div")
            .text("Genre Tree Filter")
            .style("color", "lightgray")
            .style("font-weight", "bold");

        d3.select("#side")
            .append("select")
            .attr("id", "genreDropdown")
            .on("change", function(){
                curGenre = this.value
                tree.render({genre:curGenre, publisher:curPublisher})
            })
            .selectAll(".genreOption")
            .data(genres)
            .enter()
            .append("option")
            .text(d=>d);
    
        const pubTitle = d3.select("#side")
            .append("div")
            .text("Publisher Tree Filter")
            .style("color", "lightgray")
            .style("font-weight", "bold");

        d3.select("#side")
            .append("select")
            .attr("id", "publisherDropdown")
            .on("change", function(){
                curPublisher = this.value
                tree.render({genre:curGenre, publisher:curPublisher})
            })
            .selectAll(".publisherOption")
            .data(publishers)
            .enter()
            .append("option")
            .text(d=>d);

            const bar = new Bar();
            const barLine = new BarLine();
            const tree = new Tree();

            function changeRegion(){
                let regions = [];
        
                let regionCheckboxes = document.getElementsByClassName("region");
    
                for (let r of regionCheckboxes) {
                    if (r.checked) {
                        regions.push(r.name);
                    }
                }
    
                bar.render({"regions":regions});
                barLine.render({"regions":regions});
            }
        });   

    }


}

const side = new Side();