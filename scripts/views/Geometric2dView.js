class Geometric2dView extends View{
    constructor(params){
      super(params);
      this.est=this._matrixes;
      this.size = {w:200,h:200};
      this.center = {hor:(this.size.w/2),ver: (this.size.h/2)};
      this.matrixName = this._matrixNames[0];
      this.quant = 10;
      this.step=(this.center.hor-10)/this.quant;
      this.p5html = $(`<div id="geo-p5-${this.matrixName}" style="width: ${this.size.w}px; height: ${this.size.h}px;"></div>`)[0]
      this.onMatrixChange();
      this.createP5();
      this.dragging=-1;
      this.grids= 5;
      
      this.htmlContainer=$(this._container.body);
      this.htmlContainer.append(this.p5html);
    }


    onMatrixChange(){
     this.matrixEst = this.est[this.matrixName];
    }

    onResize(w, h) {
        this.size = {w:w,h:h};
        this.sk.resizeCanvas(this.size.w,this.size.h);
        this.center = {hor:(this.size.w/2),ver: (this.size.h/2)};
        this.step=(this.center.hor-10)/this.quant;
    }

    createP5(){
      let _this=this;
      this.p5 = new P5(sk=>{
          _this.sk=sk;
          sk.setup=()=>{_this.setupP5(sk);};
          sk.draw=()=>{_this.drawP5(sk);};
      },this.p5html);
    }


    onMoveStart(sk){
      if (this.dragging === -1){
        let p = this.calcPoint(sk.mouseX, sk.mouseY);
        p.x = p.x/this.step;
        p.y = p.y/this.step;
        for(let i=0;i<this.matrixEst.size()[1];i++){
          if (sk.dist(p.x.toFixed(2), p.y.toFixed(2), 
                  this.matrixEst.subset(math.index(0,i)), this.matrixEst.subset(math.index(1,i))) < 0.4) this.dragging = i;
        }     
      }
      this._matrixes[this.matrixName] = this._matrixes[this.matrixName];
    }
  

    onMoveEnd(sk){
      this.dragging = -1;
    }
  

    setupP5(sk){
      let _this=this;
      this.cnv = sk.createCanvas(this.size.w, this.size.h);
      this.cnv.canvas.style.visibility="visible";
      sk.angleMode(sk.DEGREES);

      this.cnv.touchStarted(()=>this.onMoveStart(sk)); 
      this.cnv.mousePressed(()=>this.onMoveStart(sk));
      this.cnv.mouseReleased(()=>this.onMoveEnd(sk));
      this.cnv.touchEnded(()=>this.onMoveEnd(sk));
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
        let i_tgt = {x: this.matrixEst.subset(math.index(0,0)), y: this.matrixEst.subset(math.index(1,0))};
        let j_tgt = {x: this.matrixEst.subset(math.index(0,1)), y: this.matrixEst.subset(math.index(1,1))};
        this.drawGuides(sk, `${Colors.g.fg2}`, 0.5, i_tgt, j_tgt); // TODO: passar pra nj
      }
      
      //desenhaPlano(sk, 'blue', 1, i_tgt, j_tgt);
      //console.log(this.matrixEst.shape[1]);
      for(let i=0;i<this.matrixEst.size()[1];i++){
        if(this.dragging==i){
          let p = this.calcPoint(sk.mouseX, sk.mouseY);
          p.x = p.x/this.step;
          p.y = p.y/this.step;
          this.matrixEst.subset(math.index(0,i),trunca((p.x)));
          this.matrixEst.subset(math.index(1,i),trunca((p.y)));
          this._matrixes[this.matrixName] = this._matrixes[this.matrixName];
        }
        
        this.drawArrow(sk,this.matrixEst.subset(math.index(0,i))*this.step, this.step*this.matrixEst.subset(math.index(1,i)),`${Colors.obj[i]}`);
        
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