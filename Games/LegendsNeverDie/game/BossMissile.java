package game;

public class BossMissile extends Missile {
    public BossMissile(int x , int y){
        super(x , y);
        this.x=x;
        this.y=y;
        this.image=Start.missileOfBossImg;
        this.width=this.image.getWidth();
        this.height=this.image.getHeight();
        this.speed=7;
        this.damage=2;
    }

    /*敌方导弹反向移动*/
    @Override
    public void move() {
        this.x-=this.speed;
    }
}
