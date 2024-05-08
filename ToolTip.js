const tip = d3.select("body")
    .append("div")
    .attr("id", "tip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white");

class ToolTip {

    static addText(e, textArray) {
        console.log(e);
        tip.style("left", `${e.clientX + 5}px`);
        tip.style("top", `${e.clientY + 5}px`);
        tip.style("visibility", "visible");

        d3.selectAll("#tip").selectAll("*").remove();

        d3.select("#tip")
            .selectAll(".tip")
            .data(textArray)
            .enter()
            .append("p")
            .text(d=>d);
    }

    static hide() {
        tip.style("visibility", "hidden");
    }

}