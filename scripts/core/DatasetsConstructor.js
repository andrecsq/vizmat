class DatasetsConstructor{
    constructor(datasets, matrixes, container, openBtn, formulaSelector){
        this.container = container;
        this.matrixes = matrixes;
        this.openBtn = openBtn;
        this.closebtn = container.find('.close-button');
        this.body = this.container.find('.dataset-body');
        this.datasets = datasets;
        this.openBtn.click(()=>this.openBtnEvt());
        this.closebtn.click(()=>this.closeBtnEvt());      
        this.mountButtons();
        this.fnSelector = $("#formula")
    }
    btnHtml(datasetName){
        return `
            <a href='#' data-name='${datasetName}'>${datasetName}</a>
        `;
    }
    openBtnEvt(){
        this.container.parent().css('display','flex');
        $('body').css('overflow','hidden');
    }
    closeBtnEvt(){
        this.container.parent().css('display','');
        $('body').css('overflow','');
    }

    loadDataset(name){
        let data = this.datasets[name].content.data;
        let fn = this.datasets[name].content.formula;
        if(fn!=undefined){
            this.fnSelector.val(fn);
            this.fnSelector.trigger('change');
        }
        for(let i in data){
            this.matrixes[i] = math.clone(math.matrix(data[i]));
        }
        this.closeBtnEvt();
    }
    mountButtons(){
        this.body.empty();
        for(let i in this.datasets){
            let btn = $(this.btnHtml(i));
            this.body.append(btn);
            btn.click(()=>this.loadDataset(i));
        }
    }
}