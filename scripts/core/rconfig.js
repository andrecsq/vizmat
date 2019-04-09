let _views = {};
let _formulas={};
let _matrixes = {};

let _Mhandler = {set:(target, name, value)=>{
    target[name]= value;
    _formulas[target['op']](target);
    _views.forEach(element=>element.onMatrixChange());
    return true;
}};

Colors= {
    g: {
        bg1:    '#263238',
        bg2:    '#4499aa',
        fg1:    '#fefefe',
        fg2:    '#bf360c',
        typo:   '#222222',
    },
    obj: [
        '#ff0029', '#377eb8', '#66a61e', '#984ea3', '#00d2d5', '#ff7f00', '#af8d00',
        '#7f80cd', '#b3e900', '#c42e60', '#a65628', '#f781bf', '#8dd3c7', '#bebada',
        '#fb8072', '#80b1d3', '#fdb462', '#fccde5', '#bc80bd', '#ffed6f', '#c4eaff',
        '#cf8c00', '#1b9e77', '#d95f02', '#e7298a', '#e6ab02', '#a6761d', '#0097ff',
        '#00d067', '#f43600', '#4ba93b', '#5779bb', '#927acc', '#97ee3f', '#bf3947',
        '#9f5b00', '#f48758', '#8caed6', '#f2b94f', '#eff26e', '#e43872', '#d9b100',
        '#9d7a00', '#698cff', '#d9d9d9', '#00d27e', '#d06800', '#009f82', '#c49200',
        '#cbe8ff', '#fecddf', '#c27eb6', '#8cd2ce', '#c4b8d9', '#f883b0', '#a49100',
        '#f48800', '#27d0df', '#a04a9b'
    ]
};

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
        this._matrixNames = matrixName;
        this._matrixes = matrixes || _matrixes;
        this._container = container;
    }

    onMatrixChange(){
        console.log("matrix updated");
    }
}

async function mainLoad(M,views,fn){
    _matrixes = new Proxy(M,_Mhandler);

    for(let i=0;i<views.length;i++){
        await new Promise(function(resolve,reject){
            require([`views/${views[i].file || views[i].name || views[i]}`],_View=>{
                let viewName = views[i].name || views[i];
                if(_View!==undefined && _views[viewName]===undefined){
                    views[i].class = _View;
                    _views[viewName] = views[i];
                }
                resolve();
            });
        });
    }

    let formulaOptions = "";

    for(let i=0; i< fn.length;i++){
        await new Promise((resolve,reject)=> {
            require([`formulas/${fn[i].file || fn[i].name || fn[i]}`], _Fn => {
                if (_Fn !== undefined) {
                    let fnName = fn[i].name || fn[i];
                    let fnFile = fn[i].file || fnName;
                    let fnOut = fn[i].out || ["C"];
                    _formulas[fnName] = {out: fnOut, run: _Fn};
                    formulaOptions+=`<option value="${fnName}">${fnName}</option>`
                }
                resolve();
            })
        })
    }

    let formulaSelector=$("#formula");

    formulaSelector.html(formulaOptions);

    let container = $(".main-content");
    let grid = new GridConstructor(3,container,_views,_formulas,_matrixes,formulaSelector);

}

require(["core/Matrixes","views/_registry","formulas/_registry"],(M,views,fn)=>{ mainLoad(M,views,fn); });