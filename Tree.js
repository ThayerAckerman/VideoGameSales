class Tree {
    constructor() {


        this.div = document.getElementById("treemap");        
        this.width = this.div.offsetWidth - 30;
        this.height = this.div.offsetHeight - 30;


        

        d3.csv("Video_Games.csv").then(data => {
            this.render(data);
        })     

    }

    render(data) {

        const svg = d3.select("#treemap")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("transform", "translate(15, 0)")

        data = data.filter(d => d.Name != "");
        const max = d3.max(data, d => d.NA_Sales);

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
        //data.children = [data.children[0]]



        const color = d3.scaleLinear().domain([0, max]).range(["white", "blue"])

        const root = d3.hierarchy(data).sum(d => d[0] ? d[0].NA_Sales : 0/*{ console.log(d[0].NA_Sales); return 1; }*/);

        d3.treemap()
            .size([this.width, this.height])
            .paddingTop(28)
            .paddingRight(5)
            .paddingInner(3)
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
                .style("fill", d => color(d.data[0].NA_Sales));



        let cwidth = 0;
        svg.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
                .attr("x", function(d){ return d.x0})
                .attr("y", function(d){ return d.y0}) 
                .text(function(d){ return d.data.publisher })
                .attr("font-size", function(d) {

                    const height = d.y1 - d.y0;
                    cwidth = d.x1 - d.x0;

                    if (height < 30 || cwidth < 50) {
                        return "0px";
                    } 

                    d.width = cwidth;
                    d3.select(this).attr("width", cwidth);
                    console.log(d3.select(this).attr("width"))

                    const use = height < cwidth ? height : cwidth;

                    
                    return `${use/4}px`;
                    
                })
                .attr("fill", function(d) {

                    return "black"

                })
                .call(wrap, cwidth);
            

            
                
        function wrap(text, width) {
            
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1,
                    x = text.attr("x"),
                    y = text.attr("y"),
                    dy = 0, 
                    tspan = text.text(null)
                                .append("tspan")
                                .attr("x", x)
                                .attr("y", y)
                                .attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        word = word.length > 10 && width < 50 ? word.substring(0, 7) + "..." : word;
                        tspan = text.append("tspan")
                                    .attr("x", x)
                                    .attr("y", y)
                                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                                    .text(word);
                    }
                }
            });
        }
        svg
            .selectAll("titles")
            .data(root.descendants().filter(function(d){return d.depth==1}))
            .enter()
            .append("text")
                .attr("x", function(d){ return d.x0})
                .attr("y", function(d){ return d.y0+21})
                .text(function(d){ return d.data.genre })
                .attr("font-size", "19px")
                .attr("fill",  "lightgray" )
            
    }
}


const tree = new Tree();