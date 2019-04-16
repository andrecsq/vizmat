class NumericView extends View{
    constructor(params){super(params);        //this.name = this._matrixNames[0];
        //this.matrixHtml = this.getMatrix(this.name, this._matrixes);
       // this.getTemplates();
       this.insertCssFile("NumericView/NumericViewStyle");
       this._container.body.append($(this.getMatrix(this._matrixNames[0]))[0]);

    }

    getMatrix(name){
      let ansClass=""
      if(this._out.indexOf(name)!==-1)ansClass="answer"
      return `<div style='display:inline-block'>
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
      </div>`
    }
   

}

define(()=>NumericView);