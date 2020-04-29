package game;

import java.awt.image.BufferedImage;
import java.util.Timer;
import java.util.TimerTask;

public class Enemy extends MovableObject implements NPC{
    public int life;

    /*构造方法*/
    public Enemy(int x){
        super();
        this.image=Start.enemyImg;
        this.width=this.image.getWidth();
        this.height=this.image.getHeight();
        this.x=x;
        this.y=400;
        this.life=1;
        this.exp=5;
        this.speed=Start.speed;
    }

    /*生成物随地图移动（相对静止）*/
    @Override
    public void move(){
        this.x-=this.speed;
    }

    /*获取经验值*/
    public int getExp(){
        return this.exp;
    }
}
