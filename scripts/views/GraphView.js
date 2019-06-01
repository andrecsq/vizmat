class GraphView extends View{
    constructor(params){
        super(params);
        let b = $(this._container.body);
        let wrapperout = $(`<div style="min-height:300px; width:100%; display: flex; justify-content: center; align-itens; center"></div>`);
        let wrapper = $(`<div></div>`)[0];
        b.append(wrapperout[0]);
        wrapperout.append(wrapper);
        
        this.graphviz = d3.select(wrapper).graphviz()
        .fit(true)
        .zoom(false)
        this.timespan = 500;
        this.timeout = setTimeout(()=>{this.load();},this.timespan);
    }

    onMatrixChange(){
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>{this.load();},this.timespan);
    }

    onResize(w,h){
        this.graphviz.height(h);
        this.graphviz.width(w);
    }
    
    load(){
        
        let fM = this._matrixes[this._matrixNames[0]];
        let sM = this._matrixes[this._matrixNames[1]];
        let tM = this._matrixes[this._matrixNames[2]];
        let sS=sM.size();
        let tS=tM.size();
        let fS = fM.size();
        let dotSrc = `
            digraph {
            graph [pad="0.212,0.055" rankdir="LR"]
            node [style=filled]
        `
        
        for (let j = 0; j < sS[0]; j++) { 
            let value = trunca(sM.subset(math.index(j,0)));
            dotSrc += `B_${j}[fillcolor="${Colors.obj[0]}" pos="0,${-2*j }!" label="${value}"]\n`;
        }
        for (let i = 0; i < tS[0]; i++) { 
            let value = trunca(tM.subset(math.index(i,0)));
            dotSrc += `C_${i}[fillcolor="${Colors.obj[1]}" pos="4,${ -2*i }!" label="${value}"]\n`;
        }
        for (let j = 0; j < fS[1]; j++) { 
            for (let i = 0; i < fS[0]; i++) {
                let value = trunca(fM.subset(math.index(i,j)));
                if (value != 0) {
                    dotSrc +=  `B_${j} -> C_${i}[tailtooltip="A_${i}${j}" labeldistance=3 taillabel="${value}"]\n`;
                }
            }
        }
        
        dotSrc += `}`
        this.graphviz.renderDot(dotSrc);
    }
}


define(()=>GraphView);