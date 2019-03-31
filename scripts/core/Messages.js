class Messages{
    static showToast(msg,type,color,debug){
        switch (type) {
            case "Error":console.error(`${type}: ${msg}`.toString()); break;
            case "Warning":console.warn(`${type}: ${msg}`.toString()); break;
        }

    }

    static error(msg,debug){
        Messages.showToast(msg,"Error","#d30000",debug);
    }
}