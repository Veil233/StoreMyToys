package game;

public class Boss extends Enemy implements NPC{

    public Boss(int x){
        super(x);
        this.image=Start.bossImg;
        this.width=this.image.getWidth();
        this.height=this.image.getHeight();
        this.x=x;
        this.y=400;
        this.life=2;
        this.exp=10;
    }

    /*生成物随地图移动（相对静止）*/
    @Override
    public void move(){
        this.x-=Start.speed;
    }

    /*发射导弹*/
    public BossMissile fireMissile(){
        int x=this.x;
        int y=this.y;
        return new BossMissile(x , y);
    }

    /*获取经验值*/
    public int getExp(){
        return this.exp;
    }


}
