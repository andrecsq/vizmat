define(()=>function(matrixes){
    try{
        matrixes.B = math.lusolve(matrixes.A, matrixes.C);
      }catch(e){
        Messages.error(e);
      }
});