package game;

import java.awt.image.BufferedImage;
import java.util.Arrays;
import java.util.Timer;
import java.util.TimerTask;

public class Hero extends  MovableObject{
    private BufferedImage[] images=new BufferedImage[0];
    private int index;
    private int jumpHeight;
    public int missile;
    public int fireUpCount;
    public int shield;
    public int level;
    public int fireLevel;
    public int expRequire;
    public boolean isJumping;
    public boolean ableToFly;
    public boolean isFlying;

    /*构造方法*/
    public Hero(){
        this.images=new BufferedImage[]{
                Start.heroImg1,
                Start.heroImg2,
                Start.heroImg3,
                Start.heroImg4,
                Start.heroImg5,
        };
        this.index=0;
        this.image=this.images[0];
        this.width=this.image.getWidth();//86
        this.height=this.image.getHeight();//96
        this.x=50;
        this.y=400;
        this.life=3;
        this.level=1;
        this.expRequire=10;
        this.jumpHeight=150;
        this.fireUpCount=0;
        this.missile=0;
        this.shield=0;
        this.fireLevel=1;
        this.isJumping=false;
        this.ableToFly=false;
        this.isFlying=false;
    }

    /*行为：跳跃*/
    @Override
    public void move(){
        if (Start.speed!=0 && this.isJumping==false && this.isFlying==false){
            int num=this.index++/10 % this.images.length;
            this.image=this.images[num];
        }
    }

    /*跳跃*/
    public void jump(){
        this.isJumping=true;
        this.y-=this.jumpHeight;
        this.image=Start.heroFlyImg;
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                Hero.this.x+=Start.speed;//speed*1
                Hero.this.y=400;
                Hero.this.image=Hero.this.images[0];
                Hero.this.isJumping=false;
            }
        } , 1000);
    }

    /*射击*/
    public Bullet shoot(){
        int x=this.x+this.width;
        int y=this.y;
        return new Bullet(x , y);
    }

    /*连发*/
    public Bullet[] continuousShoot(){
        int xStep=60;
        this.fireUpCount-=this.fireLevel;
        Bullet[] bullets=new Bullet[0];
        for (int i=0 ; i<this.fireLevel ; i++){
            int x=this.x+this.width+xStep*i;
            Bullet bullet=new Bullet(x , this.y);
            bullets= Arrays.copyOf(bullets , bullets.length+1);
            bullets[bullets.length-1]=bullet;
        }
        return bullets;
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

    /*飞行提速*/
    public void increaseSpeedAndFly(){
        Start.speed=10;
        this.y=100;
        this.image=Start.heroFlyImg;
        this.isFlying=true;

        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                Start.speed=5;
                Hero.this.y=400;
                Hero.this.image=Hero.this.images[0];
                Hero.this.ableToFly=false;
                Hero.this.isFlying=false;
            }
        } , 10000);
    }

    /*火力升级 : 子弹连发*/
    public void fireUpCount(){
        this.fireLevel++;
        this.fireUpCount+=20;
    }

    /*导弹装备 ：发射导弹，导弹可穿透攻击*/
    public void equipMissile(){
        this.missile+=5;
    }

    /*铜墙铁壁 ：获得护盾*/
    public void getShield(){
        this.shield=3;
    }

    /*获得经验值并升级*/
    public void getExp(int exp){
        this.exp+=exp;
        if (this.exp>=expRequire){
            this.expRequire+=10;
            this.level++;
        }
    }
}
