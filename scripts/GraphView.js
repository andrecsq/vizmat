class GraphView {
    graphviz = d3.graphviz(graph)
        .transition(() => d3.transition().duration(100))
        .fit(true)
        .engine("neato")
        .renderDot(graphContainer)
        .zoom(false)
        .on("end", () => d3.select(graph).dispatch("load"));


    load(){
        var n=M.B.selection.shape[0]
        var m=M.C.selection.shape[0]
        var dotSrc = `
            digraph {
            graph [pad="0.212,0.055" rankdir="LR"]
            node [style=filled]
        `
        for (var j = 0; j < n; j++) { 
            dotSrc += `B_`+ j + `[fillcolor="#${Colors.obj[0]}" pos="0,` + -2*j 
            + `!" label="` + trunca(M.B.selection.data[j]) + `"]\n`;
        }
        for (var i = 0; i < m; i++) { 
            dotSrc += `C_`+ i + `[fillcolor="#${Colors.obj[1]}" pos="4,` + -2*i 
            + `!" label="` + trunca(M.C.selection.data[i]) + `"]\n`;
        }
        
        for (var j = 0; j < n; j++) { 
            for (var i = 0; i < m; i++) {
            if (M.A.selection.data[i*m+j] != 0) {
                dotSrc +=  `B_` + j + ` -> C_` + i + `[tailtooltip="A_` + i + `` 
                + j + `" labeldistance=3 taillabel="` + M.A.selection.data[i*m+j] + `"]\n`;
            }
            
            }
        }
        dotSrc += `}`;
        return dotSrc;
    }
}