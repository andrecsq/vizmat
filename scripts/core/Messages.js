class Messages{
    static load(container){
        Messages.container = $(".messages-container");
    }

    static contentWrapper(msg,type){ 
        return $(`
            <div class="msg-${type.toLowerCase()}">
                <div class="msg"><strong>${type}</strong>: ${msg}</div>
                <div class="close"> <i class="fas fa-times"></i> </div>
            <div>
        `);
    }

    static showToast(msg,type,debug){
        switch (type) {
            case "Error":console.error(`${type}: ${msg}`.toString()); break;
            case "Warning":console.warn(`${type}: ${msg}`.toString()); break;
            default: if(debug) console.log(`${type}: ${msg}`.toString()); break;
        }
        let msgWrapp = Messages.contentWrapper(msg,type);
        
        let timewait = 3000;

        Messages.container.append(msgWrapp);
        let closeTime = setTimeout(()=>{
            msgWrapp.remove();
        },timewait);

        msgWrapp.find(".close").on("click",e=>{
            clearTimeout(closeTime);
            msgWrapp.remove();
        })
        msgWrapp.on("mouseover",e=>{
            clearTimeout(closeTime);
        })
        msgWrapp.on("mouseout",e=>{
            closeTime = setTimeout(()=>{
                msgWrapp.remove();
            },timewait);
        })

    }

    static error(msg,debug){
        Messages.showToast(msg,"Error",debug);
    }
    
    static info(msg,debug){
        Messages.showToast(msg,"Info",debug);
    }
    
    static warn(msg,debug){
        Messages.showToast(msg,"Warning",debug);
    }

    static success(msg,debug){
        Messages.showToast(msg,"Success",debug);
    }
}


Messages.load();