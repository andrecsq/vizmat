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
        this.visModal=$(this._container.modal);
        let visBody =  $(this._container.body);
        visBody.html('');
        let _this=this;
        this.onOutChange();
        this._loadEventOnResize();
        visBody.ready(function (e) {
            let w = visBody[0].offsetWidth;
            let h = visBody[0].offsetHeight;
            _this.onResize(w,h);
        });
    }

    _loadConfig(){
        let visModal = this.visModal;
        let mNames = this._matrixNames;
        for(let i=0;i<mNames.length;i++){
            let _this=this;
            let mName = mNames[i];
            let matrix = this._matrixes[mName];
            let matrixContent = this.getModalMatrix(mName);
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

    onResize(w,h){
        console.log(w,h);
    }

    _loadEventOnResize(){
        let _this=this;
        let visBody = this._container.body;
        let w = visBody.offsetWidth;
        let h = visBody.offsetHeight;
        $(window).resize(function(){
            let nw = visBody.offsetWidth;
            let nh = visBody.offsetHeight;
            if(nw!==w||nh!==h){
                h = nh;
                w = nw;
                _this.onResize(w,h);
            }

        });
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

    getModalMatrix(matrixName){
      return this.visModal.find(`[data-matrixName="${matrixName}"]`);
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