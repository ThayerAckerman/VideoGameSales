class Side {
    constructor() {
        const bar = new Bar();
        const barLine = new BarLine();
        const tree = new Tree();

        var sideDiv = document.getElementById("side");
        d3.select("#side")
            .append("div")
                .append("input")
                    .attr("type", "checkbox")
                    .attr("checked", "true")
                .append("input")
                    .attr("type", "checkbox")
                    .attr("checked", "true")
                .append("input")
                    .attr("type", "checkbox")
                    .attr("checked", "true");
            

        const regions = [
            { label: "North America", value: "na" },
            { label: "Europe", value: "eu" },
            { label: "Japan", value: "jp" },
            { label: "Other", value: "other" }
        ];
    }


}

const side = new Side();