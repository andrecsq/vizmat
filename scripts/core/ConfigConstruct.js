class CfCo{
    static _inputGroup(elm,id,label,size){
        size = size || 50;
        return`<div class="input-group w-${size}">
            <div class="input-group-label">
            <label for="${id}">${label}:</label>
            </div>
            <div class="input">
                ${elm}
            </div>
        </div>`;
    }

    static _Input(id, type, name, value){
        value = value || "";
        return `<input type="${type}" id="${id}" name="${name}" value="${value}">`;
    }

    static _selectOption(label,value){
        value=value || label;
        return `<option value="${value}">${label}</option>`
    }

    static _Select(id, name, options){
        return `<select id="${id}" name="${name}">
                    ${options}
                </select>`;
    }

    static numberInput(name,label,value,size){
        let id = uuid();
        return $(CfCo._inputGroup(CfCo._Input(id,'number',name,value),id,label,size));
    }

    static txtInput(name,label,value,size){
        let id = uuid();
        return $(CfCo._inputGroup(CfCo._Input(id,'text',name,value),id,label,size));
    }

    static checkInputs(name,label,values,size){
        let elmString = "";
        for(let i in values){
            let id = uuid();
            elmString += `<div>
                                <label for="${id}">${i}</label>
                                ${CfCo._Input(id,'checkbox',name,values[i])}
                            </div>`;
        }
        return $(CfCo._inputGroup(elmString,id,label,size));
    }

    static buttonInput(name,label,value,size){
        let id = uuid();
        return $(CfCo._inputGroup(CfCo._Input(id,'button',name,value),id,label,size));
    }

    static radioInputs(name,label,values,size){
        let elmString = "";
        for(let i in values){
            let id = uuid();
            elmString += `<div>
                                <label for="${id}">${i}</label>
                                ${CfCo._Input(id,'radio',name,values[i])}
                            </div>`;
        }
        return $(CfCo._inputGroup(elmString,id,label,size));
    }

    static selectInput(name, label, values,size){
        let elmString = "";
        let id = uuid();
        for(let i in values){
            elmString += CfCo._selectOption(i,values[i]);
        }
        return $(CfCo._inputGroup(CfCo._Select(id,name,elmString),id,label,size));
    }

}