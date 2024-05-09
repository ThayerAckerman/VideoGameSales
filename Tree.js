class Tree {
    constructor() {


        this.div = document.getElementById("treemap");        
        this.width = this.div.offsetWidth - 30;
        this.height = this.div.offsetHeight - 30;


        

        d3.csv("Video_Games.csv").then(data => {
            this.data = data;
            this.render({});
        })     

    }

    render({genre, publisher}) {

        let data = this.data;

        d3.select("#treemap").selectAll("*").remove();
        const svg = d3.select("#treemap")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("transform", "translate(15, 0)")

        data = data.filter(d => d.Name != "");
        if (genre && (genre != "All")) {
            console.log(genre);
            data = data.filter(d => d.Genre == genre);
        }
        if (publisher && (publisher != "All")) {
            data = data.filter(d => d.Publisher == publisher);
        }
        
        const max = d3.max(data, d => parseFloat(d.NA_Sales));

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



        const color = d3.scaleLinear().domain([0, max]).range(["lightgray", "#7289da"])

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
                .attr("opacity", 0.8)
                .style("stroke-width", "0")
                .style("fill", d => color(d.data[0].NA_Sales))
                .on("mousemove", function(e, d) {
                    ToolTip.addText(e, [`Genre: ${d.data[0].Genre}`, `Publisher: ${d.data[0].Publisher}`, `NA Sales: ${d.data[0].NA_Sales}`]);
                    d3.select(this).style("opacity", 1);
                })
                .on("mouseout", function(){
                    ToolTip.hide();
                    d3.select(this).style("opacity", 0.8);
                })



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

                    let use = height < cwidth ? height : cwidth;
                    use /= 4;
                    use = use > 50 ? 50 : use;
                                        
                    return `${use}px`;
                    
                })
                .attr("fill", function(d) {

                    return "black"

                })
                .call(wrap, cwidth);
            

            
                
        function wrap(text, width) {

            width = root.leaves().length == 1 ? 30 : width;
            
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
