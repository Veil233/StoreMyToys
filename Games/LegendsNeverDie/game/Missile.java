package game;

public class Missile extends MovableObject {
    public int speed;

    /*构造方法*/
    public Missile(int x , int y){
        this.x=x;
        this.y=y;
        this.image=Start.missileOfHeroImg;
        this.width=this.image.getWidth();
        this.height=this.image.getHeight();
        this.speed=5;
    }

    /*导弹前进*/
    public void move() {
        this.x += this.speed;
    }

    /*敌方导弹反向移动*/
    public void moveReverse() {
            this.speed=6;
            this.x-=this.speed;
    }

}
