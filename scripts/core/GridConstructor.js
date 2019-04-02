class GridConstructor{
    constructor(rows,cols,container,views, formulas, matrixes){
        this.formulas = formulas;
        this.matrixes = matrixes;
        this.container = container;
        this.elements=[];
        this.views = views;
        for(let i=0;i<rows;i++){
            this.elements.push([]);
            for(let j=0;j<cols;j++){
                this.elements[i].push([i,j]);
            }
        }
        this.createGridCells(this.elements);
    }

   loadCell(r, c){
        let last= r==this.elements.length-1;
        let viewsNames="";
        for(let i in this.views) {
            viewsNames += `<option value="${i}">${i}</option>`;
        }
        return `<section id="grid-${r}-${c}" style="grid-area: r${r}-c${c}" class="vis-container">
                    <div class="config">
                        <select class="chooseView">
                            ${viewsNames}
                        </select>
                    </div>
                    <div class="content"></div>
                    <div class="spanButton ${(last?"hide":"")}">
                        <span data-expand="down"><i class="fas fa-angle-down"></i></span>
                        <span data-expand="up"><i class="fas fa-angle-up"></i></span>
                    </div>
                </section>`;
    }
    
    rearrangeCells(){
        this.GridCells(this.elements,false);
    }

    createGridCells(){
        this.GridCells(this.elements, true);
    }

    GridCells(elements, create){
        let gridElements = [];
        let templateArea="";
        for(let i=0;i<elements.length;i++){
            templateArea+=`"`;
            for(let j=0;j<elements[0].length;j++){
                if(elements[i][j][0] !== i || elements[i][j][1]!==j){
                    this.container.find(`#grid-${i}-${j}`).css({"display":"none"});
                }
                else{ 
                    if(create){
                        let cell=$(this.loadCell(i,j));
                        this.setEvents(cell,i,j);
                        gridElements.push(cell);
                    }else{
                        this.container.find(`#grid-${i}-${j}`).css({"display":""});
                    }
                }
                templateArea+=`r${elements[i][j][0]}-c${elements[i][j][1]} `;
            }
            templateArea+=`"`;
        }
        this.container[0].style.gridTemplateAreas=templateArea;
        if(create)this.container.append(gridElements);
    }

    loadViewObj(cell,view,r,c){
        let viewClassContainer = this.views[view];

        if(viewClassContainer.colspan!==undefined && viewClassContainer.colspan>1){
            this.setColspan(r,c,viewClassContainer.colspan);
        }else{
            
        }

        let viewObj = new(viewClassContainer.class)();
        viewObj._container = cell[0];
        viewObj._matrixes = this.matrixes;
        viewObj._matrixNames = cell[0];
    }

    setEvents(cell,r,c){
        let _this=this;
        let viewChooser =cell.find(".chooseView");
        let expandUp = cell.find("[data-expand=up]");
        let expandDown = cell.find("[data-expand=down]");

        expandUp.on("click",e=>{
            _this.setRowspan(r,c,-1);
        });

        expandDown.on("click",e=>{
            _this.setRowspan(r,c,1);
        });

        viewChooser.on("change",e=>{
           let value = viewChooser.val();
           _this.loadViewObj(cell,value,r,c);
        });
    }

    setColspan(r,c,colspan){
        if(this.elements[0].length >= (c+colspan)){
            for(let i = r;i<this.elements.length;i++){
                let elmCell = this.elements[i][c];
                if(elmCell[0]===r && elmCell[1]===c){
                    for(let j=c;j<this.elements[0].length;j++){
                        this.elements[i][j] = [r,c];
                    }
                }
            }
            this.rearrangeCells();
        }
    }

    setRowspan(r,c,rowspan){
        if(rowspan!=0){
            let up = rowspan<0, acol = c;
            rowspan = Math.abs(rowspan);
            while(acol < this.elements[0].length && this.elements[r][acol][0]===r && this.elements[r][acol][1]===c){
                if(!up) for(let i = r; i <= (r+rowspan); i++)  this.elements[i][acol] = [r,c];
                else for(let i = (r+rowspan); i > r ; i--) this.elements[i][acol] = [i,acol,1];
                acol++;
            }
            this.rearrangeCells();
        }
    }
}
