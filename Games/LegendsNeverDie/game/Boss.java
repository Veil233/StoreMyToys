package game;

public class Boss extends MovableObject implements NPC{
    public int life;

    public Boss(int x){
        this.x=x;
        this.y=400;
        this.image=Start.bossImg;
        this.width=this.image.getWidth();
        this.height=this.image.getHeight();
        this.life=3;
        this.speed=Start.speed;
        this.exp=10;
    }

    /*生成物随地图移动（相对静止）*/
    @Override
    public void move(){
        this.x-=this.speed;
    }

    /*发射导弹*/
    public Missile fireMissile(){
        int x=this.x;
        int y=400;
        return new Missile(x , y);
    }

    /*获取经验值*/
    public int getExp(){
        return this.exp;
    }


}
