package game;

public class Bullet extends MovableObject {
    private int speed;

    public Bullet(int x , int y){
        this.image=Start.bulletImg;
        this.width=this.image.getWidth();
        this.height=this.image.getHeight();
        this.x=x;
        this.y=y;
        this.speed=5;
    }

    /*子弹前进*/
    public void move(){
        this.x+=this.speed;
    }
}
