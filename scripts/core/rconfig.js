let _views = {};
let _formulas={};
let _matrixes = {};

let _Mhandler = {set:(target, name, value)=>{
    target[name]= value;
    _formulas[target['op']](target);
    _views.forEach(element=>element.onMatrixChange());
    return true;
}};

require.config({
    baseUrl: "scripts",
    paths: {
        views: "views",
        formulas: "formulas"
    },
    waitSeconds: 0
});

class View{
    constructor(matrixName,matrixes,container){
        this._matrixName = matrixName;
        this._matrixes = matrixes || _matrixes;
        this._container = container;
    }

    onMatrixChange(){
        console.log("matrix updated");
    }
}

require(["core/Matrixes","views/_registry","formulas/_registry"],(M,views,fn)=>{
    _matrixes = new Proxy(M,_Mhandler);

    for(let i=0;i<views.length;i++){
        require([`views/${views[i].file || views[i].name || views[i]}`],_View=>{
            if(_View!==undefined){
                let viewName = views[i].name || views[i];
                views[i].class = _View;
                _views[viewName] = views[i];
            }
        });
    }

    for(let i=0; i< fn.length;i++){
        require([`formulas/${fn[i].file || fn[i].name || fn[i]}`],_Fn=>{
            if(_Fn!==undefined){
                let fnName=fn[i].name || fn[i];
                let fnFile=fn[i].file || fnName;
                let fnOut = fn[i].out || ["C"];
                _formulas[fnName] = {out:fnOut, run: _Fn};
            }
        })
    }
});
