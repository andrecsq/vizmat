class Pair {
   constructor(x,y){
      this.x = x;
      this.y = y;
   }
}

let size, center, quant;
let ang = new Pair(0,0), result = new Pair(0,0);
let i_hat = new Pair(1,0), j_hat = new Pair(0,1);
let i_tgt = new Pair(1,0), j_tgt = new Pair(1,1); 
let vetor = new Pair(1,1);

// Matriz que armazena as transformações.
// Usada pra transformar a posição do mouse pra posição
// Correta em relação à origem do plano cartesiano
function ajeitaPonto(x, y){
  // TRANSFORMA DO PLANO NORMAL PRO TRANSFORMADO
  // 100, 100 do normal é 0,0 do transformado
  return new Pair(x - center, -y + center);  
}

function setup() {
  size = document.getElementById("item-00").clientWidth;
  center = size/2;
  quant = 3; // quantidade de marcações   
  base_step = (center-10)/quant; // esse -10 é a margem
    
  calculaAngulo(i_tgt, j_tgt);

  console.log("ok");
  let t = new Teste().cliquei();  
  console.log("ok2");
}

// Calcula ângulo entre base normal e base transformada
function calculaAngulo(i_go, j_go){
  // calcula angulo entre os i_hat e i_tgt
  let cos_ang = i_hat.x*i_go.x + i_hat.y*i_go.y;
  let d = sqrt(i_hat.x**2 + i_hat.y**2);
  d = d * sqrt(i_go.x**2 + i_go.y**2);
  cos_ang = cos_ang/d;
  ang.x = Math.acos(cos_ang);

  // Calculamos o determinante entre i_hat e i_tgt
  // Pra saber se o angulo é negativo ou positivo
  // Se determinante é positivo, o angulo é sentido horario
  // Que pra rotações aqui é negativo
  let det = i_hat.x*i_go.y - i_hat.y*i_go.x;
  ang.x = Math.sign(det)*ang.x;
  ang.x *= 180/PI;

  cos_ang = j_hat.x*j_go.x + j_hat.y*j_go.y;
  d = sqrt(j_hat.x**2 + j_hat.y**2);
  d = d * sqrt(j_go.x**2 + j_go.y**2);
  cos_ang = cos_ang/d;
  ang.y = Math.acos(cos_ang);

  det = j_hat.x*j_go.y - j_hat.y*j_go.x;
  ang.y = Math.sign(det)*ang.y;
  ang.y *= 180/PI;
}

function seta(sk, x, y){
  let sz = 7;   // tamanho das linhas da seta
  let ang = 40; // angulo de rotação das linhas da seta  

  sk.stroke('red');
  sk.strokeWeight(3);

  sk.line(0,0,x,y); // base  

  let d = sqrt(x*x + y*y); // tamanho
  let u = new Pair(x/d, y/d); // vetor unitario

  sk.push(); //reta de cima
    sk.translate(x,y);
    sk.rotate(-180+ang);
    sk.line(0,0,u.x*sz, u.y*sz);
  sk.pop();

  sk.push(); //reta de baixo
    sk.translate(x,y);
    sk.rotate(180-ang);   
    sk.line(0,0,u.x*sz, u.y*sz);
  sk.pop();
}

function desenhaPlano(sk, color, weight, i_go, j_go){
  sk.stroke(color);   
  sk.strokeWeight(weight);
  
  calculaAngulo(i_go, j_go);
   
  for (let i = -3*(quant+1); i <= 3*(quant+1); i++){   

    // linhas horizontais (centro em x = 0)      
    sk.push();      
      sk.translate(i*j_go.x*base_step, i*j_go.y*base_step);
      sk.rotate(ang.x);      
      if (i == 0) sk.strokeWeight(weight*3);
      sk.line(size, 0, -size, 0);  
    sk.pop(); 

    // linhas verticais (centro em y = 0)
    sk.push();
      sk.translate(i*i_go.x*base_step, i*i_go.y*base_step);
      sk.rotate(ang.y);
      if (i == 0) sk.strokeWeight(weight*3);
      sk.line(0, size, 0, -size);
    sk.pop();
  } 
}

let item_00 = new p5(function( sk ) {
  let cnv, dragging = -1;

  sk.setup = function() {  
    cnv = sk.createCanvas(size, size);
    sk.angleMode(DEGREES);   
    cnv.mousePressed(function () {
      
      // CHECA SE O PONTO SELECIONADO É ALGUM DOS PONTOS DE DRAG/DROP
      if (dragging == -1){ 
        let p = ajeitaPonto(mouseX, size+mouseY);
        p.x = p.x/base_step;
        p.y = p.y/base_step;
        
        if (dist(p.x, p.y, i_tgt.x, i_tgt.y) < 0.4) dragging = 0;        
        if (dist(p.x, p.y, j_tgt.x, j_tgt.y) < 0.4) dragging = 1;         
      }
      
    }); 
    
    cnv.mouseReleased(function() {
      dragging = -1;      
    });
  };

  sk.draw = function() {
    sk.background(0);
    sk.scale(1, -1);
    sk.translate(center,-center);  
    desenhaPlano(sk, 'lightgray', 0.5, i_hat, j_hat);
    if (dragging == 0){
      let p = ajeitaPonto(mouseX, size+mouseY);
      p.x = p.x/base_step;
      p.y = p.y/base_step;
      i_tgt = p;
      calculaAngulo(i_tgt, j_tgt);
    }
    if (dragging == 1){
      let p = ajeitaPonto(mouseX, size+mouseY);
      p.x /= base_step;
      p.y /= base_step;
      j_tgt = p;
      calculaAngulo(i_tgt, j_tgt);
    }
    
    desenhaPlano(sk, 'blue', 1, i_tgt, j_tgt);
    
    seta(sk, i_tgt.x*base_step, i_tgt.y*base_step);
    seta(sk, j_tgt.x*base_step, j_tgt.y*base_step);    
    
  };
}, "item-00");

let item_01 = new p5(function( sk ) {
  let cnv, dragging = -1;
  
  sk.setup = function() {  
    cnv = sk.createCanvas(size, size);
    sk.angleMode(DEGREES);
    cnv.mousePressed(function () {
      
      console.log(mouseX-size);
      console.log(mouseY+size);
      
      // CHECA SE O PONTO SELECIONADO É ALGUM DOS PONTOS DE DRAG/DROP
      if (dragging == -1){ 
        let p = ajeitaPonto(mouseX, size+mouseY);
        p.x = (p.x - size)/base_step;
        p.y /= base_step;
        
        console.log(p);
        
        if (dist(p.x, p.y, vetor.x, vetor.y) < 0.4) dragging = 0;
      }
      
    }); 
    
    cnv.mouseReleased(function() {
      dragging = -1;      
    });
  };

  sk.draw = function() {
    sk.background(0);
    sk.scale(1, -1);
    sk.translate(center,-center);     
    desenhaPlano(sk, 'lightgray', 0.5, i_hat, j_hat);
    if (dragging == -1) {
      seta(sk, base_step*vetor.x, base_step*vetor.y);
    } else {
      let p = ajeitaPonto(mouseX, size+mouseY);
      p.x = (p.x-size)/base_step;
      p.y /= base_step;        
      vetor = p;      
      seta(sk, p.x*base_step, p.y*base_step);
    }
  };
}, "item-01");

let item_02 = new p5(function( sk ) {
  let cnv, dragging = -1;
  
  sk.setup = function() {  
    cnv = sk.createCanvas(size, size);
    sk.angleMode(DEGREES);
  };

  sk.draw = function() {
    sk.background(0);
    sk.scale(1, -1);
    sk.translate(center,-center);    
    desenhaPlano(sk, 'lightgray', 0.5, i_hat, j_hat);
    desenhaPlano(sk, 'blue', 1, i_tgt, j_tgt);
    result = new Pair(0,0);
    result.x = i_tgt.x*vetor.x + j_tgt.x*vetor.y;
    result.y = i_tgt.y*vetor.x + j_tgt.y*vetor.y;
    seta(sk, base_step*result.x, base_step*result.y);
    
  };
}, "item-02");