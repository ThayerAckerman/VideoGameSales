class Tree {
    constructor() {


        const div = document.getElementById("treemap");        
        const width = div.offsetWidth;
        const height = div.offsetHeight;


        const svg = d3.select("#treemap")
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        d3.csv("Video_Games.csv").then(data => {
            const objData = Object.groupBy(data, ({ Genre }) => Genre);
            Object.keys(objData).map(genre => objData[genre] = Object.groupBy(objData[genre], ({ Publisher }) => Publisher));
            
            data = []

            Object.keys(objData).forEach(genre => {
                let children = []
                Object.keys(objData[genre]).forEach(publisher => {
                    const curr = objData[genre][publisher];
                    curr.publisher = publisher;
                    children.push(curr)
                })
                data.push({genre: genre, children: children})
            })

            data = {children: data}

            console.log(objData);
            console.log(data);

            const root = d3.hierarchy(data).sum(d => d[0] ? d[0].NA_Sales : 0/*{ console.log(d[0].NA_Sales); return 1; }*/);
            console.log(root.leaves())
            d3.treemap()
                .size([width, height])
                .paddingTop(5)
                .paddingRight(3)
                .paddingInner(2)
                (root)

            
            svg.selectAll("rect")
                .data(root.leaves())
                .enter()
                .append("rect")
                    .attr("x", d => d.x0)
                    .attr("y", d => d.y0)
                    .attr("width", d => d.x1 - d.x0)
                    .attr("height", d => d.y1 - d.y0)
                    .style("stroke", "black")
                    .style("opacity", 0.5)


            svg.selectAll("text")
                .data(root.leaves())
                .enter()
                .append("text")
                    .attr("x", function(d){ return d.x0})
                    .attr("y", function(d){ return d.y0 + (d.y1 - d.y0)/4}) 
                    .text(function(d){ return d.data.publisher })
                    .attr("font-size", d => {

                        const height = d.y1 - d.y0;
                        const width = d.x1 - d.x0;

                        if (height < 30 || width < 20) {
                            return "0px";
                        } 

                        const use = height < width ? height : width;

                        console.log(d.data.publisher.length)

                        return `${use/4}px`;
                        
                    })
                    .attr("fill", "white")

            /*svg
                .selectAll("titles")
                .data(root.descendants().filter(function(d){return d.depth==1}))
                .enter()
                .append("text")
                    .attr("x", function(d){ return d.x0})
                    .attr("y", function(d){ return d.y0+21})
                    .text(function(d){ return d.data.genre })
                    .attr("font-size", "19px")
                    .attr("fill",  "black" )
            */
        })

        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json").then(data => {
            console.log(data);
        })

         

    }
}


const tree = new Tree();