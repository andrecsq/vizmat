define(()=>function(matrixes){
    try{
        matrixes.C = math.multiply(matrixes.A,matrixes.B);
    }catch (e) {
        Messages.error("dimensões diferentes");
    }
});