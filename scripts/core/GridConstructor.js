class GridConstructor{
    constructor(rows,container,views,loadedViews, formulas, matrixes,formulasSelector){
        this.matrixes = matrixes;
        this.formulas = formulas;
        this.loadedViews=loadedViews;
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
        let matrixNameButtons="";
        let matrixNameModals="";
        let matrixNameTitles="";
        for(let i in this.views) {
            viewsNames += `<option value="${i}">${i}</option>`;
        }
        for(let i=0;i<this.matrixNames.length;i++){
            matrixNameTitles += `<div class="matrix-name-title matrix-name-title-${this.matrixNames[i]}"><span>${this.matrixNames[i]}</span></div>`;
            matrixNameButtons += this.getmatrixOptionsButton(this.matrixNames[i]);
            matrixNameModals+=this.getmatrixOptionsModalContainer(this.matrixNames[i]);
        }



       return  `<section id="grid-${r}-${c}" style="grid-area: r${r}-c${c}" class="vis-container">
                    <div class="vis-modal"> 
                        <div class="close-button">
                            <span><i class="fa fa-times"></i></span>
                        </div>    
                        <div class="vis-modal-content">
                            ${matrixNameTitles}
                            <div class="itens">
                                ${matrixNameModals}
                            </div>
                        </div>            
                    </div>
                   
                    <div class="config">
                        <div class="mainOptions">
                            <div class="header-input-group">
                                <select class="chooseView">
                                    ${viewsNames}
                                </select>
                            </div>
                        </div>
                        <div class="viewOptions">
                            ${matrixNameButtons}
                        </div>
                    </div>
                    <div class="content"></div>
                    <div class="wrappspanButton">
                        <div data-dir="down" class="spanButton ${(last?"hide":"")}">
                            <span data-expand="down"><i class="fas fa-angle-down"></i></span>
                            <span data-expand="up"><i class="fas fa-angle-up"></i></span>
                        </div>
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

    loadFormula(){
        let oldFormula = this.actualFormula;
        let newFormula = $(this.formulaSelector).val();
        try{
            this.matrixes.op = newFormula;
            for(let i in this.loadedViews){
                if(this.loadedViews.hasOwnProperty(i)){
                    this.loadedViews[i]._out=this.formulas[this.actualFormula].out;
                    this.loadedViews[i].onOutChange();
                }
            }           

            this.actualFormula = newFormula;
        }catch(e){
            Messages.error(e);
            this.matrixes.op = oldFormula;
            this.actualFormula = oldFormula;
        }
       
    }

    getmatrixOptionsButton(matrixName){
        return `<div data-matrix-name="${matrixName}" class="m-options hide">
                    <div>
                        ${matrixName}
                    </div>
                    <div class="matrix-size">
                        (<span class="numlin">0</span>
                        x
                        <span class="numcol">0</span>)
                    </div>       
                </div>`;
    }

    getmatrixOptionsModalContainer(matrixName){
        return `<div data-matrixName="${matrixName}" class="vis-modal-content-matrix vis-modal-content-matrix-${matrixName}"> 
                </div>`;
    }

    loadViewObj(cell,view,r,c){
        let viewClassContainer = this.views[view];
        let colspan = viewClassContainer.colspan || 1;
        let out = this.formulas[this.formulaSelector.val()].out;
        this.mergeColumns(r,c,colspan,cell);
        let matrixNames = this.matrixNames.slice(c,c+colspan);
        let viewObj = new (viewClassContainer.class)({out:out,container:cell[0],matrixNames:matrixNames,matrixes:this.matrixes});
        this.loadedViews[view+"-"+r+"-"+c]= viewObj;
        let visModal = $(cell).find(".vis-modal");
        let visBody = $(viewObj._container.body);
        let visHeader = $(viewObj._container.header);
        this.loadVisModals(matrixNames,visModal,visBody,visHeader);
        viewObj._loadConfig();
    }

    setEvents(cell,r,c){
        let _this=this;
        let viewChooser =cell.find(".chooseView");
        let expandUp = cell.find("[data-expand=up]");
        let expandDown = cell.find("[data-expand=down]");
        let oldView = viewChooser.val();
        _this.loadViewObj(cell,oldView,r,c);
        expandUp.on("click",function(){

            try{
                _this.mergeRows(r,c,-1,this);
            }catch(e){
                Messages.error(e,true);
            }
        });

        expandDown.on("click",function(){
            try{
                _this.mergeRows(r,c,1,this);
            }catch(e){
                Messages.error(e,true);
            }
        });

        viewChooser.on("change",e=>{
           let value = viewChooser.val();
           try{
               _this.loadViewObj(cell,value,r,c);
               oldView = value;
           }catch(e){
                Messages.error(e,true);
                viewChooser.val(oldView);
           }
        });

        this.formulaSelector.on("change",e=>{
            _this.loadFormula();
        })
        this.loadFormula();
    }

    isRowsMerged(elm,r,c){
        return ( r+1 < elm.length    && elm[r+1][c][0]===elm[r][c][0] && elm[r+1][c][1]===elm[r][c][1])
            || ( r-1 >= 0             && elm[r-1][c][0]===elm[r][c][0] && elm[r-1][c][1]===elm[r][c][1]);
    }

    isColumnsMerged(elm,r,c){
        return ( c+1 < elm[0].length    && elm[r][c+1][0]===elm[r][c][0] && elm[r][c+1][1]===elm[r][c][1])
            || ( c-1 >= 0             && elm[r][c-1][0]===elm[r][c][0] && elm[r][c-1][1]===elm[r][c][1]);
    }

    mergeColumns(r,c,colspan){
        colspan = colspan===undefined?1:colspan;
        if(colspan>=1){
            if(c+colspan>this.elements[0].length) {
                throw `View Maior que espaço alocado! tente alocar na ${(1 + colspan - this.elements[0].length)}ª célula`;
            }
            let elements = JSON.parse(JSON.stringify(this.elements));
            let tam=0,left,acol = c, arow = r;

            for(let i=0; i < elements[0].length;i++){
                if(elements[arow][i][1]===c){
                    acol=i; tam++;
                }
            }
            
            left = colspan<tam;
            colspan = Math.abs(colspan-tam);

            while(arow < elements.length && elements[arow][acol][0]===r && elements[arow][acol][1]===c){
                if(!left) for(let i = acol; i <= (acol+colspan); i++) {
                    if(!(this.isRowsMerged(elements,arow,i)||this.isColumnsMerged(elements,arow,i)))
                        elements[arow][i] = [r,c];
                    else{
                        if(i===acol)continue;
                        throw "Não pode sobrepor célula mesclada";
                    }
                }else for(let i = acol; i > Math.max(c,acol-colspan) ; i--){
                    elements[arow][i] = [arow,i];
                }
                arow++;
            }
            this.elements = elements;
            this.rearrangeCells();
        }
    }

    mergeRows(r,c,rowspan,elm){
        let elements = JSON.parse(JSON.stringify(this.elements));
        let lastcell;
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
                    lastcell=i;
                }
                else for(let i = arow; i > Math.max(r,arow-rowspan) ; i--){
                    elements[i][acol] = [i,acol];
                    lastcell=i;
                }
                acol++;
            }


            if(up && arow-rowspan===r){
                $(elm).parent().attr("data-dir","down");
            }else if(arow+rowspan===(elements.length-1)){
                $(elm).parent().attr("data-dir","up");
            }else{
                $(elm).parent().attr("data-dir","both");
            }

            this.elements = elements;
            this.rearrangeCells();
        }
    }

    loadVisModals(matrixNames,visModal,visBody,visHeader){
        let  btnMatrixNames = visHeader.find(`[data-matrix-name]`),
            modalOptions = visModal.find(`.vis-modal-content`), modalOptionsContents = modalOptions.find(`.itens`).children();

        btnMatrixNames.addClass("hide");
        modalOptionsContents.addClass("hide");
        visModal.addClass("hide");
        for(let i =0;i<matrixNames.length;i++){
            let mName = matrixNames[i];
            let mSize = this.matrixes[mName].size();
            let btn = btnMatrixNames.filter(`[data-matrix-name=${matrixNames[i]}]`);
            btn.find('.numlin').text(mSize[0]);
            btn.find('.numcol').text(mSize[1]);
            let closeBtn = visModal.find(`.close-button`);
            closeBtn.on("click",function(){
                let container = $(this).closest(`.vis-container`);
                let modal = container.find('.vis-modal');
                let modalContents = modal.find(`.vis-modal-content-matrix, .matrix-name-title`);
                modal.addClass("hide");
                modalContents.addClass("hide");
            });
            btn.removeClass("hide");
            btn.on("click",function(){
                let container = $(this).closest(`.vis-container`);
                let modal = container.find('.vis-modal');
                let modalContents = modal.find(`.vis-modal-content-matrix, .matrix-name-title`);
                let modalContent = modalContents.filter(`.vis-modal-content-matrix-${matrixNames[i]}, .matrix-name-title-${matrixNames[i]}`);
                modalOptions.scrollTop(0);
                modal.removeClass("hide");
                modalContents.addClass("hide");
                modalContent.removeClass("hide");
            });
        }
    }
}
