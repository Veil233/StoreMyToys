package game;

import java.awt.image.BufferedImage;

public class Enemy extends MovableObject implements NPC{
    private BufferedImage[] images=new BufferedImage[0];
    private int index;

    /*构造方法*/
    public Enemy(int x){
        this.images=new BufferedImage[]{
                Start.enemyImg1,
                Start.enemyImg2,
                Start.enemyImg3,
                Start.enemyImg4,
                Start.enemyImg5,
        };
        this.index=0;
        this.image=this.images[0];
        this.width=this.image.getWidth();
        this.height=this.image.getHeight();
        this.x=x;
        this.y=400;
        this.life=1;
        this.exp=5;
    }

    /*生成物随地图移动（相对静止）*/
    @Override
    public void move(){
        int num=this.index++ / 10 % this.images.length;
        this.image=this.images[num];
        this.x-=Start.speed;
    }

    /*获取经验值*/
    public int getExp(){
        return this.exp;
    }
}
