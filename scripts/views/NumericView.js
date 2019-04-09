class NumericView extends View{
    get style(){
        return `
         <style>
            .answer .matrix-container{
              border-color:${Colors.g.fg2};
            }
            .answer .matrix-name:hover{
              max-height: 15px;
              background-color: unset;
              box-shadow: unset;
            }
            .body{
                margin:0;
                padding:0;
            }
            .box{
                /*border:1px solid #aaa;*/
                border-radius: 5px;
                padding:10px;
                display: flex;
            }
            .matrix-container{
                margin-top: 40px;
                display:inline-block;
                border-left:3px solid ${Colors.g.bg1};
                border-right:3px solid ${Colors.g.bg1};
                border-radius:10px;
                padding:5px;
                max-width:100%;
            }
            .matrix-container .inner-vector{
                display:inline-block;
                max-width:100%;
            }
            
            .matrix-container .input{
                max-width:100%;
                min-width:20px;
                min-height: 10pt;
                margin:5px;
                font-family:helvetica, arial;
                font-size:10pt;
                padding:3px;
                border:none;
                -moz-appearance:none;
                -webkit-appearance: none;
                background-color:rgba(0,0,0,0.03);
                border-radius:3px;
                overflow:hidden;
            }
            input{
                -webkit-appearance:none;
                appearance:none;
                -moz-appearance:none;
                border-bottom:1px solid #000;
                border-left:none;
                border-right:none;
                border-top:none;
                width:40px !important;
            }
            .label-size{
                font-size:10pt;
            }
            .var-container{
                display:inline-block;
            }
            canvas{
              border-radius:5px;
            }
            .var-descriptor{
                position: relative;
                color:${Colors.g.bg1};
                display:flex;
                justify-content:center;
                width: inherit;
                text-align: center;
                font-family: helvetica, arial;
            }
            
            .answer .var-descriptor{
                color:${Colors.g.fg2};
            }
            
            .matrix-name:hover{
                max-height: initial;
                background-color: white;
                box-shadow: 0 0 15px rgba(0,0,0,0.2);
                
            }
            
            input[type=number]{
                -moz-appearance: textfield;
                -webkit-appearance: textfield;
                appearance: text-field;
                text-align: center;
            }
            
            .matrix-name{
                max-height: 15px;
                overflow: hidden;
                position: absolute;
                padding: 10px 0;
                background-color: transparent;
                transition: box-shadow 300ms linear background-color 300ms linear  max-height 300ms linear;
                border-radius: 5px;
                width: 100%;
                min-width: 90px;
                max-width: 200px;
            }
            
            .matrix-name span{
                font-size: 14pt;
            }
            .matrix-name .dim-label{
                font-size: 8pt;
            }
            .matrix-name a{
                font-size: 8pt;
            }
            
            
            #openDim:hover{
                display: inline !important;
            }
            
            .matrix-dim span{
              white-space:nowrap;
            }
            
            .operator{
                display: inline-flex;
                align-items: center;
                padding: 0 10px;
            }
            </style>
        `
    }
    constructor(){
        super();
        this.matrixHtml = this.getMatrix(name, this._matrixes);
        console.log(this.matrixHtml);
        this._container.append(this.matrixHtml);
        this.setupHTML();
        this.setupEvents();
    }
    getMatrix(name, est){
        let ansClass = "";
        if (_formulas[est.op].out.indexOf(name) >= 0) ansClass = "answer";
        return $(`
          <div style='display:inline-block'>
            <div id="var-${name}" class="var-container ${ansClass}">
              <div class="var-descriptor">
                <div class="matrix-name">
                  <label>
                    <span>${name}</span>
                    <span class="dim-label"></span>
                  </label>
                  <div class="matrix-dim">
                    <span>
                      <label class="label-size" for="${name}-dim-r">rows:</label>
                      <input id="${name}-dim-r" tabindex="-1" type="number" value="0">
                    </span>
                    <span>
                      <label class="label-size" for="${name}-dim-c">cols:</label>
                      <input id="${name}-dim-c" tabindex="-1" type="number" value="0">
                    </span>
                  </div>
                </div> 
              </div>
              <div class="matrix-container">
              </div>
            </div>
          </div>
      `);
    }
    onMatrixChange() {

    }

}

define(()=>NumericView);