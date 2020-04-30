package game;

public class Enemy extends MovableObject implements NPC{

    /*构造方法*/
    public Enemy(int x){
        this.image=Start.enemyImg;
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
        this.x-=Start.speed;
    }

    /*获取经验值*/
    public int getExp(){
        return this.exp;
    }
}
