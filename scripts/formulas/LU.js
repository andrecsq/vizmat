define(()=>function(matrixes){
    let a = math.lup(matrixes.C);
    matrixes.A = a.L;
    matrixes.B = a.U;
});