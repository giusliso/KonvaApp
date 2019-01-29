import { of, Observable } from "rxjs";
import { OnInit, Component, ViewChild } from "@angular/core";
import { KonvaComponent, KonvaModule } from "ng2-konva";
import * as Konva from 'konva';

@Component({
  selector: "app-root",
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public stage: Konva.Stage;
  public backgroudLayer: Konva.Layer;
  public pointsLayer: Konva.Layer;
  public tooltipLayer: Konva.Layer;
  public tooltip: Konva.Label;
  public learningPathLayer: Konva.Layer;
  private zoomLevel = 1;

  constructor() {
 
  }
  public handleClick(component) {
    console.log("Hello Circle", component);
  }

  public ngOnInit() {
    this.stage = new Konva.Stage({
      container: 'container',
      width: 500,
      height: 600
    });
   

    this.initTooltips();
    this.AddBackground();
 
    this.stage.on('mousemove', () => {
      if(this.zoomLevel !== 1){
        var pos = this.stage.getPointerPosition();
        this.stage.x( - (pos.x));
        this.stage.y( - (pos.y));
        this.stage.draw();
      }
    });
    this.stage.add(this.backgroudLayer); 
    this.pointsLayer = new Konva.Layer();
    this.stage.add(this.pointsLayer);

    this.tooltipLayer = new Konva.Layer();
    this.tooltipLayer.add(this.tooltip);
    this.stage.add(this.tooltipLayer);
    this.learningPathLayer = new Konva.Layer();
    this.stage.add(this.learningPathLayer);
    this.stage.on('click', e => this.addPoint(e))

    // Set zindex
    this.backgroudLayer.setZIndex(0); 
    this.learningPathLayer.setZIndex(1);
    this.pointsLayer.setZIndex(2);
    this.tooltipLayer.setZIndex(3);

  }

  public zoomIn() {
    this.zoomLevel += 0.25;
    this.stage.scale({
        x : this.zoomLevel,
        y : this.zoomLevel
    });
    this.stage.batchDraw();
  }

  public zoomOut() {
    if(this.zoomLevel !== 1){
      this.zoomLevel -= 0.25;
      if(this.zoomLevel == 1){
        this.stage.position({
          x : this.zoomLevel,
          y : this.zoomLevel
        });
      }

      this.stage.scale({
          x : this.zoomLevel,
          y : this.zoomLevel
      });
      this.stage.batchDraw();
    }
  }

  public learningPath() {
    const points = this.pointsLayer.getChildren();

    for(let i = 0; i<points.length; i++){
      const circle = points[i] as Konva.Circle;
      const circleA = points[i + 1] as Konva.Circle;
      const color = 'green';
      if(circleA !== undefined) {
        var arrow = new Konva.Line({
          points: [circle.getAttrs().x, circle.getAttrs().y, 
            circleA.getAttrs().x, circleA.getAttrs().y],
          fill: color,
          stroke: color,
          strokeWidth: 3
        });
      }
      this.learningPathLayer.add(arrow);
    }
    this.learningPathLayer.draw();
  }

  public AddBackground() {
    this.backgroudLayer = new Konva.Layer();
    
    var imageObj = new Image();
    imageObj.src = 'assets/landmark.jpg';
    imageObj.onload = () => {

      var adjHeight = this.stage.getWidth() * (imageObj.height / imageObj.width) ;

       // darth vader
        var imgToDraw = new Konva.Image({
          image: imageObj,
          x: 0,
          y: 0,
          width: this.stage.getWidth(),
          height: adjHeight,
          draggable: false
      });
      
      this.backgroudLayer.add(imgToDraw);
      this.backgroudLayer.draw();
    }; 
  }

  private addPoint(event) {
    var mousePos = this.stage.getPointerPosition();
    var circle = new Konva.Circle({
      x: mousePos.x ,
      y: mousePos.y ,
      radius: 5,
      name: 'Target ' + this.pointsLayer.getChildren().length,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 1
    });

    // tooltip
    circle.on("mousemove", () => {
        var mousePos = this.stage.getPointerPosition();
        this.tooltip.position({
            x : mousePos.x + 5,
            y : mousePos.y + 5
        });
        this.tooltip.getText().text(circle.name());
        this.tooltip.show();
        this.tooltipLayer.batchDraw();
    });

    circle.on("mouseout", () => {
        this.tooltip.hide();
        this.tooltipLayer.draw();
    });

    console.log(circle);
    this.pointsLayer.add(circle);
    this.pointsLayer.draw();
  }

  private initTooltips () {
    this.tooltip = new Konva.Label({
      opacity: 0.75,
      visible: false,
      listening: false
    });
    this.tooltip.add(new Konva.Tag({
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        fill: 'black'
    }));

    this.tooltip.add(new Konva.Text({
        text: '',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white'
    }));
  }
}