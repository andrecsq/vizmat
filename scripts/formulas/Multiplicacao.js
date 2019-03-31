define(()=>function(matrixes){
    try{
        matrixes.C = matrixes.A.dot(matrixes.B);
    }catch (e) {
        Message.error("dimensões diferentes");
    }
});