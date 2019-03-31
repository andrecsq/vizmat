class Geometric2dView{
    constructor(est, matrixName, size, quant, transpose, htmlContainer, grids){
      this.est=est;
      this.transpose = transpose;
      this.center = {hor:(size.w/2),ver: (size.h/2)};
      this.matrixName = matrixName;
      this.quant = quant;
      this.step=(this.center.hor-10)/this.quant;
      this.p5html = html`<div id="p5-${matrixName}" style="width: ${size.w}px; height: ${size.h}px;  display: inline; margin: 10px;"></div>`
      this.onMatrixChange();
      this.size = size;
      this.createP5();
      this.dragging=-1;
      this.grids= grids
      
      this.htmlContainer=htmlContainer;
      this.htmlContainer.append(this.p5html);
    }
    onMatrixChange(){
      if(!this.transpose)this.matrixEst = this.est[this.matrixName];
      else this.matrixEst = this.est[this.matrixName].transpose();
    }
    createP5(){
      let _this=this;
      this.p5 = new P5(sk=>{
        sk.setup=()=>{_this.setupP5(sk);};
        sk.draw=()=>{_this.drawP5(sk);};
      },this.p5html);
    }
    setupP5(sk){
      let _this=this;
      this.cnv = sk.createCanvas(this.size.w, this.size.h);
      this.cnv.canvas.style.visibility="visible";
      sk.angleMode(sk.DEGREES);
      this.cnv.mousePressed(()=>{ // CHECA SE O PONTO SELECIONADO É ALGUM DOS PONTOS DE DRAG/DROP
        
        if (this.dragging == -1){ 
          let p = this.calcPoint(sk.mouseX, sk.mouseY);
          p.x = p.x/this.step;
          p.y = p.y/this.step;
          for(let i=0;i<this.matrixEst.shape[1];i++){
            if (sk.dist(p.x.toFixed(2), p.y.toFixed(2), 
                        this.matrixEst.get(0,i), this.matrixEst.get(1,i)) < 0.4) this.dragging = i;
          }     
        }
        this.cnv.mouseReleased(function() { _this.dragging = -1; });
      });  
    }
    
    drawP5(sk){
      sk.background(`${Colors.g.bg1}`);
      sk.scale(1,-1);
      sk.translate(this.center.hor,-this.center.ver);    
      //  this.drawGuides(sk, 'lightgray', 0.5, nj.array([1,0]), nj.array([0,1]));
      if (this.grids >= 1){
        this.drawGuides(sk, `${Colors.g.fg1}`, 0.3, {x: 1, y: 0}, {x: 0, y: 1}); // TODO: passar pra nj
      }
      if (this.grids >= 2){
        let i_tgt = {x: this.matrixEst.get(0,0), y: this.matrixEst.get(1,0)};
        let j_tgt = {x: this.matrixEst.get(0,1), y: this.matrixEst.get(1,1)};
        this.drawGuides(sk, `${Colors.g.fg2}`, 0.5, i_tgt, j_tgt); // TODO: passar pra nj
      }
      
      //desenhaPlano(sk, 'blue', 1, i_tgt, j_tgt);
      //console.log(this.matrixEst.shape[1]);
      for(let i=0;i<this.matrixEst.shape[1];i++){
        if(this.dragging==i){
          let p = this.calcPoint(sk.mouseX, sk.mouseY);
          p.x = p.x/this.step;
          p.y = p.y/this.step;
          this.matrixEst.set(0,i,trunca((p.x)));
          this.matrixEst.set(1,i,trunca((p.y)));
          this.est.op = this.est.op;
        }
        
        this.drawArrow(sk,this.matrixEst.get(0,i)*this.step, this.step*this.matrixEst.get(1,i),`#${Colors.obj[i]}`);
        
      }
    }
    
    drawGuides(sk, color, weight, i_go, j_go){
      sk.stroke(color);   
      sk.strokeWeight(weight);
  
      let ang = this.calculaAngulo(i_go, j_go);
      
      for (let i = -3*(this.quant+1); i <= 3*(this.quant+1); i++){   
  
        // linhas horizontais (centro em x = 0)      
        sk.push();      
          sk.translate(i*j_go.x*this.step, i*j_go.y*this.step);
          sk.rotate(ang.x);      
          if (i == 0) sk.strokeWeight(weight*3);
          sk.line(2*this.size.w, 0, -2*this.size.w, 0);  
        sk.pop(); 
  
        // linhas verticais (centro em y = 0)
        sk.push();
          sk.translate(i*i_go.x*this.step, i*i_go.y*this.step);
          sk.rotate(ang.y);
          if (i == 0) sk.strokeWeight(weight*3);
          sk.line(0, 2*this.size.h, 0, -2*this.size.h);
        sk.pop();
      } 
    }
    drawArrow(sk, x, y, color){
        let sz = 7;   // tamanho das linhas da seta
        let ang = 40; // angulo de rotação das linhas da seta  
        sk.stroke(color);
        sk.strokeWeight(2);
        sk.line(0,0,x,y); // base  
        let d = Math.sqrt(x*x + y*y); // tamanho
        let u = {x:(x/d),y:(y/d)}; // vetor unitario
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
    calcPoint(x,y){
      return {x:(x - this.center.hor),y:(-y + this.center.ver)};
    }
    calculaAngulo(i_go, j_go){
      // calcula angulo entre os i_hat e i_tgt
      let i_hat = ({x: 1, y: 0});
      let j_hat = ({x: 0, y: 1});  
      let cos_ang = i_hat.x*i_go.x + i_hat.y*i_go.y;
      let d = Math.sqrt(i_hat.x**2 + i_hat.y**2);
      let ang = ({x:0, y: 0});
      d = d * Math.sqrt(i_go.x**2 + i_go.y**2);
      cos_ang = cos_ang/d;
      ang.x = Math.acos(cos_ang);
  
      // Calculamos o determinante entre i_hat e i_tgt
      // Pra saber se o angulo é negativo ou positivo
      // Se determinante é positivo, o angulo é sentido horario
      // Que pra rotações aqui é negativo
      let det = i_hat.x*i_go.y - i_hat.y*i_go.x;
      ang.x = Math.sign(det)*ang.x;
      ang.x *= 180/Math.PI;
  
      cos_ang = j_hat.x*j_go.x + j_hat.y*j_go.y;
      d = Math.sqrt(j_hat.x**2 + j_hat.y**2);
      d = d * Math.sqrt(j_go.x**2 + j_go.y**2);
      cos_ang = cos_ang/d;
      ang.y = Math.acos(cos_ang);
  
      det = j_hat.x*j_go.y - j_hat.y*j_go.x;
      ang.y = Math.sign(det)*ang.y;
      ang.y *= 180/Math.PI;
      return ang;
    }
  }

define(()=>Geometric2dView);