class NumericView extends View{
    constructor(params){
        super(params);
        this.name = this._matrixNames[0];
        this.insertCssFile("NumericView/NumericViewStyle");
        $(this._container.body).append($(this.getMatrix(this.name))[0]);
        this.setupHTML();
        this.setupEvents();
    }

    onMatrixChange() {
        this.setupHTML();
        this.setupEvents();
    }

    getMatrix(name){
      return `<div id="var-${name}-${uuid()}" class="var-container">
          <div class="numview-container">
          </div>
        </div>`
    }

    getCell(r,c,value,editable, color){
        return  $(`<div style='background-color:${color}40' class="numview-input" data-r="${r}" data-c="${c}" contenteditable="${editable}">${value}</div>`);
    }

    getVector(){
        return $(`<div class="inner-vector"></div>`);
    }

    checknumber(num){return ((num<48)||(num>57)) && num!==0 && num!==8 &&num!==46 &&num!==45 &&num!==13 &&num!==101; }

    filterKey(e,elm){
        if(this.checknumber(e.which||e.keycode) && !e.ctrlKey){e.preventDefault();return false;}
        else if((e.which||e.keycode)===13)elm.blur();
    }

    changeCell(e,elm){
        let row = parseInt(elm.getAttribute('data-r'));
        let col = parseInt(elm.getAttribute('data-c'));
        this._matrixes[this.name] = this._matrixes[this.name].subset(math.index(row,col),elm.value);
    }

    updateCell(e,elm){
        let newValue = parseFloat(elm.innerText);
        if(isNaN(newValue))newValue=0;
        if(elm.value!==newValue){
            elm.innerText = newValue;
            elm.value = newValue;
            this.changeCell(e,elm);
        }
    }

    setupEvents(){
        let _this = this;
        this._container.body.querySelectorAll(".numview-input").forEach(function(elm){
            $(elm).on("keypress",function(e){_this.filterKey(e,this);});
            $(elm).on("blur",function(e){_this.updateCell(e,this)});
        });
    }

    setupHTML(){
        let matrix = this._matrixes[this.name];
        let shape = matrix.size();
        let container = this._container.body.querySelector(".numview-container");
        container.innerHTML="";
        for(let j=0;j<shape[1];j++){//para cada coluna
            let vector = this.getVector();
            for(let i=0;i<shape[0];i++){//para cada linha
                let value = trunca(matrix.subset(math.index(i,j)));
                let editable = true;
                if (this._out.indexOf(this.name) >= 0) {
                    editable = false;
                }
                let cell = this.getCell(i,j,value,editable,Colors.obj[j]);
                vector.append(cell[0]);
            }
            container.append(vector[0]);
        }
    }

}

define(()=>NumericView);