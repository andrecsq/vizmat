define(()=>function(matrixes){
    try{
        matrixes.C = math.add(matrixes.A,matrixes.B);
    }catch (e) {
        Messages.error(e);
    }
});