class GridConstructor{
    constructor(rows,container,views, formulas, matrixes,formulasSelector){
        this.matrixes = matrixes;
        this.formulaSelector = formulasSelector;
        this.matrixNames = Object.keys(matrixes);
        this.actualFormula=this.formulaSelector.val();
        this.matrixes.op = this.actualFormula;
        this.container = container;
        this.elements=[];
        this.views = views;
        for(let i=0;i<rows;i++){
            this.elements.push([]);
            for(let j=0;j<this.matrixNames.length;j++){
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
        this.mergeColumns(r,c,viewClassContainer.colspan);
        let viewObj = new(viewClassContainer.class)();
        viewObj._container = cell[0];
        viewObj._matrixNames = this.matrixNames.slice(c,c+viewClassContainer.colspan);
        viewObj._matrixes = this.matrixes;
    }

    setEvents(cell,r,c){
        let _this=this;
        let viewChooser =cell.find(".chooseView");
        let expandUp = cell.find("[data-expand=up]");
        let expandDown = cell.find("[data-expand=down]");

        expandUp.on("click",e=>{
            _this.mergeRows(r,c,-1);
        });

        expandDown.on("click",e=>{
            _this.mergeRows(r,c,1);
        });

        viewChooser.on("change",e=>{
           let value = viewChooser.val();
           _this.loadViewObj(cell,value,r,c);
        });

        this.formulaSelector.on("change",e=>{
            _this.actualFormula = $(_this.formulaSelector).val();
            _this.matrixes.op = _this.actualFormula;
        })
    }

    isRowsMerged(elm,r,c){
        return ( r+1 < elm.length    && elm[r+1][c][0]===elm[r][c][0] && elm[r+1][c][1]===elm[r][c][1])
            || ( r-1 >= 0             && elm[r-1][c][0]===elm[r][c][0] && elm[r-1][c][1]===elm[r][c][1]);
    }

    isColumnsMerged(elm,r,c){
        return ( c+1 < elm.length    && elm[r][c+1][0]===elm[r][c][0] && elm[r][c+1][1]===elm[r][c][1])
            || ( c-1 >= 0             && elm[r][c-1][0]===elm[r][c][0] && elm[r][c-1][1]===elm[r][c][1]);
    }

    mergeColumns(r,c,colspan){
        colspan = colspan===undefined?1:colspan;
        if(colspan>=1){
            let elements = JSON.parse(JSON.stringify(this.elements));
            let tam=0,left,acol = c, arow = r;

            for(let i=0; i < elements.length;i++){
                if(elements[arow][i][1]===c){
                    acol=i; tam++;
                }
            }
            left = colspan<tam;
            colspan = Math.abs(colspan-tam);
            while(arow < elements[0].length && elements[arow][acol][0]===r && elements[arow][acol][1]===c){
                if(!left) for(let i = acol; i <= (acol+colspan); i++) {
                    if(!this.isRowsMerged(elements,arow,i))
                        elements[arow][i] = [r,c];
                    else{
                        if(i===acol)continue;
                        throw "Não pode sobrepor célula mesclada";
                    }
                }else for(let i = acol; i > Math.max(c,acol-colspan) ; i--){
                    elements[arow][i] = [arow,i];
                }
                arow++;
                this.elements = elements;
                this.rearrangeCells();
            }
        }
    }

    mergeRows(r,c,rowspan){
        let elements = JSON.parse(JSON.stringify(this.elements));
        if(rowspan!==0){
            let up = rowspan<0, acol = c, arow = r;
            rowspan = Math.abs(rowspan);
            for(let i=0; i < elements.length;i++){
                arow = elements[i][acol][0]===r?i:arow;
            }
            while(acol < elements[0].length && elements[arow][acol][0]===r && elements[arow][acol][1]===c){
                if(!up) for(let i = arow; i <= (arow+rowspan); i++) {
                    if(!this.isColumnsMerged(elements,i,acol))
                        elements[i][acol] = [r,c];
                    else{
                        if(i===arow)continue;
                        throw "Não pode sobrepor célula mesclada";
                    }
                }
                else for(let i = arow; i > Math.max(r,arow-rowspan) ; i--){
                    elements[i][acol] = [i,acol];
                }
                acol++;
            }

            this.elements = elements;
            this.rearrangeCells();
        }
    }
}
