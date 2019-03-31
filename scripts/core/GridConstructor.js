class GridConstructor{
    constructor(rows,cols,container){
        this.container = container;
        this.elements=[];
        for(let i=0;i<rows;i++){
            this.elements.push([]);
            for(let j=0;j<cols;j++){
                this.elements[i].push([i,j]);
            }
        }
        this.createGridCells(this.elements);
    }

   loadCell(r, c){
        return `<section id="grid-${r}-${c}" style="grid-area: r${r}-c${c}" class="vis-container">
                    <div class="config">
                        <select>
                            <option value=""></option>
                        </select>
                    </div>
                    <div class="content"></div>
                </section>`;
    }
    rerrangeCells(){
        this.GridCells(this.elements,false);
    }
    createGridCells(){
        this.GridCells(this.elements, true);
    }
    GridCells(elements, create){
        let gridElements = "";
        let templateArea="";
        for(let i=0;i<elements.length;i++){
            templateArea+=`"`;
            for(let j=0;j<elements[0].length;j++){
                if(elements[i][j][0] !== i || elements[i][j][1]!==j)
                    container.find(`#grid-${i}-${j}`).css({"display":"none"});
                else
                    if(create)gridElements+= this.loadCell(i,j);

                templateArea+=`r${elements[i][j][0]}-c${elements[i][j][1]} `;
            }
            templateArea+=`"`;
        }
        this.container[0].style.gridTemplateAreas=templateArea;
        if(create)this.container.html(gridElements);
    }
    setEvents(){
        this.container.children().each((elm)=>{
            $(elm).on("")
        });
    }
    setColspan(r,c,colspan){

    }
    setRowspan(r,c,colspan){

    }
}

let container = $(".main-content");
let grid = new GridConstructor(2,3,container);