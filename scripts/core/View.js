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
        });
       
        $(this._container.body).html('');
        $(this._container.header).html('');
        this.onOutChange();
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