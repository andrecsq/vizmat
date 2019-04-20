class View{
    constructor(params){
        Object.defineProperties(this, {
            _matrixNames:{
                value: params.matrixNames,
                writable: false,
                enumerable: true,
                configurable: false
            },
            _matrixes:{
                value: params.matrixes || _matrixes,
                writable: false,
                enumerable: true,
                configurable: false
            },
            _container:{
                value: {},
                writable: false,
                enumerable: true,
                configurable: false
            },
            _out:{
                value: params.out,
                writable: true,
                enumerable: true,
                configurable: false
            },
        });
        Object.defineProperties(this._container, {
            header:{
                value: params.container.querySelector(".config>.viewOptions"),
                writable: false,
                enumerable: true,
                configurable: false
            },
            body:{
                value: params.container.querySelector(".content"),
                writable: false,
                enumerable: true,
                configurable: false
            },
            modal:{
                value: params.container.querySelector(".vis-modal"),
                writable: false,
                enumerable: true,
                configurable: false
            }
        });

        let visBody =  $(this._container.body);
        visBody.html('');

        this.onOutChange();
    }

    _loadConfig(){
        let visModal = $(this._container.modal);
        let mNames = this._matrixNames;
        for(let i=0;i<mNames.length;i++){
            let _this=this;
            let mName = mNames[i];
            let matrix = this._matrixes[mName];
            let matrixContent = visModal.find(`[data-matrixName="${mName}"]`);
            matrixContent.html('');
            let inputcol = CfCo.numberInput('numcols','nº de Colunas<br>(vetores)',matrix.size()[1]);
            let inputrow = CfCo.numberInput('numrows','nº de Linhas<br>dimensão)',matrix.size()[0]);
            inputcol.find('input').on('change',function(){
                let val = parseInt($(this).val());
                val = val>=1?val:1;
                _this._matrixes[mName] = matrix.resize([matrix.size()[0],val]);
            });
            inputrow.find('input').on('change',function(){
                let val = parseInt($(this).val());
                val = val>=1?val:1;
                _this._matrixes[mName] = matrix.resize([val,matrix.size()[1]]);

            });
            matrixContent.append(inputrow[0]);
            matrixContent.append(inputcol[0]);
        }
    }


    _reloadConfig(){
        let visModal = $(this._container.modal);
        let mNames = this._matrixNames;
        let  btnMatrixNames = $(this._container.header).find(`[data-matrix-name]`);
        for(let i=0;i<mNames.length;i++){
            let mName = mNames[i];
            let matrix = this._matrixes[mName];
            let mSize = matrix.size();

            let btn = btnMatrixNames.filter(`[data-matrix-name=${mName}]`);
            btn.find('.numlin').text(mSize[0]);
            btn.find('.numcol').text(mSize[1]);

            let matrixContent = visModal.find(`[data-matrixName="${mName}"]`);

            let inputcol = matrixContent.find(`input[name=numcols]`);
            let inputrows = matrixContent.find(`input[name=numrows]`);
            inputcol.val(mSize[1]);
            inputrows.val(mSize[0]);
        }
    }

    async _onMatrixChange(){
        this._reloadConfig();
        this.onMatrixChange();
    }

    onMatrixChange(){
        console.log("matrix updated");
    }

    onOutChange(){
        if(this._out.includes(this._matrixNames[0])){
            $(this._container.body).parent().addClass("answer");
        }else{
            $(this._container.body).parent().removeClass("answer");
        }
    }

    insertCssFile(cssPath){
        let _this=this;
        require([`text!views/${cssPath}.css`], function(style){
            let _style = $(`<style>${style}</style>`);
            $(_this._container.body).prepend(_style);
        });
    }
    insertHtmlFile(htmlPath){
        let _this=this;
        require([`text!views/${htmlPath}.html`], function(html){
            let _html = $(`${html}`);
            $(_this._container.body).append(_html);
        });
  }

}