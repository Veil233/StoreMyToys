package game;


public class Obstacle extends MovableObject{

    /*构造方法*/
    public Obstacle(int x){
        super();
        this.image=Start.obstacleImg;
        this.x=x;
        this.y=400;
        this.width=this.image.getWidth();//185
        this.height=this.image.getHeight();//83
        this.speed=Start.speed;
    }

    /*生成物随地图移动（相对静止）*/
    public void move() {
        this.x -= this.speed;
    }
}
