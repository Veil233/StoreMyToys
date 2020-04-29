package game;

import java.util.Timer;
import java.util.TimerTask;

public class Hero extends  MovableObject{
    public int life;
    private int jumpHeight;
    public int missile;
    public int fireUpCount;
    public int shield;
    public int flyTime;
    public int level;
    public int expRequire;
    public boolean isJumping;
    public boolean isFlying;

    /*构造方法*/
    public Hero(){
        this.image=Start.heroImg;
        this.width=this.image.getWidth();//86
        this.height=this.image.getHeight();//96
        this.x=50;
        this.y=400;
        this.life=3;
        this.level=1;
        this.expRequire=10;
        this.jumpHeight=150;
        this.speed=Start.speed;
        this.fireUpCount=0;
        this.missile=10;
        this.shield=0;
        this.isJumping=false;
        this.isFlying=false;
    }

    /*行为：跳跃*/
    @Override
    public void move(){
        this.isJumping=true;
        this.y-=this.jumpHeight;
        this.image=Start.heroFlyImg;
        new Timer().schedule(new TimerTask() {
                @Override
                public void run() {
                    Hero.this.x+=Hero.this.speed;
                    Hero.this.y=400;
                    Hero.this.image=Start.heroImg;
                    Hero.this.isJumping=false;
                }
          } , 1000);
    }

    /*射击*/
    public Bullet shoot(){
        int x=this.x+this.width;
        int y=this.y;
        if (this.fireUpCount>0){
            --this.fireUpCount;
        }
        return new Bullet(x , y);
    }

    /*发射导弹*/
    public Missile fireMissile(){
        int x=this.x+this.width;
        int y=this.y;
        --this.missile;
        return new Missile(x, y);
    }

    /*增加生命*/
    public void addLife(){
        ++this.life;
    }

    /*提速*/
    public void increaseSpeed(int addition){
        this.speed+=addition;
    }

    /*火力升级 : 子弹发射没有时间间隔限制*/
    public void fireUpCount(){
        this.fireUpCount+=20;
    }

    /*导弹装备 ：发射导弹，导弹可穿透攻击*/
    public void equipMissile(){
        this.missile+=5;
    }

    /*铜墙铁壁 ：获得护盾*/
    public void getShield(){
        this.shield+=5;
    }

    /*获得经验值并升级*/
    public void getExp(int exp){
        if (exp>expRequire){
            this.expRequire+=10;
            this.level++;
        }
    }
}
