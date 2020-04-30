package game;

import sun.plugin.javascript.navig.Array;

import java.awt.*;
import java.awt.event.*;
import java.awt.image.*;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.Timer;
import java.util.TimerTask;
import javax.imageio.ImageIO;
import javax.swing.*;

public class Start extends JPanel {
    /*宽、高*/
    public static final  int WIDTH=1024;
    public static final  int HEIGHT=560;
    /*背景*/
    public static BufferedImage background;
    public int bgXPosition=0;//x坐标
    public static int bgWidth=1536;//背景宽度
    public static int speed=5;//初始速度
    /*GUI*/
    public static BufferedImage milepostImg;
    public static BufferedImage lifeImg;
    public static BufferedImage missileCountImg;
    public static BufferedImage expImg;
    public static BufferedImage shieldCountImg;
    public static BufferedImage fireUpCountImg;
    /*角色*/
    //主角
    public static BufferedImage heroImg;
    public static BufferedImage heroFlyImg;
    public Hero hero=new Hero();
    //敌人
    public static BufferedImage enemyImg;
    //boss
    public static BufferedImage bossImg;
    /*道具*/
    //陷阱
    public static BufferedImage obstacleImg;
    //子弹
    public static BufferedImage bulletImg;
    public Bullet[] bullets=new Bullet[0];//存放子弹和导弹
    public static long lastTime=0;//上次发射子弹的时间
    //导弹
    public static BufferedImage missileOfHeroImg;
    public static BufferedImage missileOfBossImg;
    public BossMissile[] missilesOfBoss=new BossMissile[0];//存放敌方导弹
    //护盾
    public static BufferedImage shieldImg;
    //爆炸
    public static BufferedImage bangImg;
    //计分
    public double startTime=new Date().getTime();
    private int meters=0;
    /*计时器*/
    private Timer timer;
    private int interval=10;
    /*计数*/
    private int generatorIndex=0;//控制生成物生成频率
    /*生成物数组*/
    public MovableObject[] generators=new MovableObject[0];
    /*记录随机生成的位置*/
    private static int[] positions=new int[0];

    /*构造方法*/
    public Start(){
    }

    /*读取文件*/
    public static File getFile(String filename, String type){
        String path="src/"+filename+"."+type;
        return new File(path);
    }

    /*读取图片资源*/
    static {
        try {
            //背景
            background=ImageIO.read(getFile("background" , "png"));
            //英雄
            heroImg=ImageIO.read(getFile("hero" , "gif"));
            heroFlyImg=ImageIO.read(getFile("hero-fly" , "gif"));
            //GUI
            milepostImg=ImageIO.read(getFile("milepost" , "png"));
            lifeImg=ImageIO.read(getFile("life" , "png"));
            missileCountImg=ImageIO.read(getFile("missile-count" , "png"));
            expImg=ImageIO.read(getFile("exp" , "png"));
            shieldCountImg=ImageIO.read(getFile("shield-count" , "png"));
            fireUpCountImg=ImageIO.read(getFile("fire-up" , "png"));
            //生成物
            obstacleImg=ImageIO.read(getFile("obstacle" , "png"));
            enemyImg=ImageIO.read(getFile("enemy" , "gif"));
            bossImg=ImageIO.read(getFile("boss" , "gif"));
            //道具
            bulletImg=ImageIO.read(getFile("bullet" , "png"));
            missileOfBossImg=ImageIO.read(getFile("missile-of-boss" , "png"));
            missileOfHeroImg=ImageIO.read(getFile("missile-of-hero" , "png"));
            shieldImg=ImageIO.read(getFile("shield" , "png"));
            //爆炸
            bangImg=ImageIO.read(getFile("bang" , "png"));
        }catch (IOException exp){
            exp.printStackTrace();
        }
    }


    /*地图滚动*/
    public void bgScroll(){
        this.bgXPosition-= speed;
        if (this.bgXPosition<-512){
            this.bgXPosition=0;
        }
    }

    /*计算里程*/
    public void getMeters(){
        double time=new Date().getTime();
        Start.this.meters=(int)( (time-Start.this.startTime)/1000* speed);
    }

    /*绘制游戏信息*/
    public void paintGUI(Graphics graphics){
        graphics.setFont(new Font("楷体" , Font.BOLD ,20) );
        //里程
        graphics.drawImage(milepostImg , 20 , 20 , (ImageObserver)null);
        graphics.drawString(String.valueOf(Start.this.meters) , 60 , 50);
        //生命值
        int startX=850;
        for (int i=0; i<this.hero.life ; i++){
            graphics.drawImage(lifeImg , startX , 20 , (ImageObserver)null);
            startX+=40;
        }
        //等级（经验值）
        graphics.drawImage(expImg , 20 , 60 ,null);
        graphics.drawString(String.valueOf(this.hero.level) , 60 , 80);
        //弹药数量
        graphics.drawImage(missileCountImg , 850 , 60 , null);
        graphics.drawString(String.valueOf(this.hero.missile) , 880 , 80);
        //火力增强数量
        graphics.drawImage(fireUpCountImg , 850 , 90 , null);
        graphics.drawString(String.valueOf(this.hero.fireUpCount) , 880 , 110);
        //护盾值
        int startX2=850;
        for (int j=0 ; j<this.hero.shield ; j++){
            graphics.drawImage(shieldCountImg , startX2 , 20 , (ImageObserver)null);
            startX2+=40;
        }
    }


    /*随机生成x坐标*/
    public int generateXPosition(){
        Random random=new Random();
        int xPosition=(random.nextInt(2500)+1024);//在画外出现
        for (int i=0 ; i<positions.length ; i++){
            int space=Math.abs(positions[i]-xPosition);
            if ( space<=500) {//如果两个生成物距离在一定范围内，则该坐标作废
                return 0;
            }
        }
        positions=Arrays.copyOf(positions , positions.length+1);
        positions[positions.length-1]=xPosition;
        return xPosition;
    }
    /*坐标随地图移动*/
    public void moveXWithMap(){
        for (int i=0 ; i<positions.length ; i++){
            positions[i]-=speed;
        }
    }
    /*生成生成物（陷阱，敌人，boss）*/
    public void generator(){
        ++this.generatorIndex;
        int probability=10;//其倒数为产生boss的概率，产生陷阱和敌人的概率约等于50%
        int type=new Random().nextInt(probability+1);
        if (this.generatorIndex % 10 == 0) {
            int x = this.generateXPosition();
            //生成boss
            if (type==probability){
                if (x != 0){
                    Boss boss = new Boss(x);
                    this.generators=Arrays.copyOf(this.generators, this.generators.length + 1);
                    this.generators[this.generators.length - 1] = boss;
                    //boss出现会发射导弹
                    BossMissile missile=boss.fireMissile();
                    this.missilesOfBoss=Arrays.copyOf(this.missilesOfBoss , this.missilesOfBoss.length+1);
                    this.missilesOfBoss[this.missilesOfBoss.length-1]=missile;
                    System.out.println(this.missilesOfBoss.length);
                }
            }
            //生成陷阱
            else if (type%2==0){
                if (x != 0) {
                    Obstacle obstacle = new Obstacle(x);
                    this.generators=Arrays.copyOf(this.generators, this.generators.length + 1);
                    this.generators[this.generators.length - 1] = obstacle;
                }
            }
            //生成普通敌人
            else  {
                if (x != 0) {
                    Enemy enemy = new Enemy(x);
                    this.generators = Arrays.copyOf(this.generators, this.generators.length + 1);
                    this.generators[this.generators.length - 1] = enemy;
                }
            }
        }
    }
    /*绘制生成物*/
    public void paintGenerators(Graphics graphics){
        for (int i=0 ; i<this.generators.length ; i++) {
            graphics.drawImage(this.generators[i].image, this.generators[i].x, this.generators[i].y, null);
        }
    }
    /*生成物随地图移动*/
    public void moveWithMap(){
        for (int i=0 ; i<generators.length ; i++){
            generators[i].move();
            //生成物出画移除
            if (this.generators[i].x<-200) {
                this.generators[i] = this.generators[this.generators.length - 1];
                this.generators = Arrays.copyOf(this.generators, this.generators.length - 1);//缩容，最后的值替代当前值
                removeX(i);
            }
        }
    }
    /*移除坐标数组中失效坐标*/
    public void removeX(int i){
        positions[i]=positions[positions.length-1];
        positions=Arrays.copyOf(positions , positions.length-1);
    }

    /*移动子弹/导弹*/
    public void moveBullets(){
        //子弹
        for (int i=0 ; i<this.bullets.length ; i++){
            this.bullets[i].move();
            //出画判定
            if (this.bullets[i].x>1024){
                this.bullets[i]=this.bullets[this.bullets.length-1];
                this.bullets=Arrays.copyOf(this.bullets , this.bullets.length-1);
            }
        }
    }

    /*移动地方导弹*/
    public void moveMissile(){
        for (int i=0 ; i<this.missilesOfBoss.length ; i++){
            this.missilesOfBoss[i].move();
            //出画判定
            if (this.missilesOfBoss[i].x<-200){
                this.missilesOfBoss[i]=this.missilesOfBoss[this.missilesOfBoss.length-1];
                this.missilesOfBoss=Arrays.copyOf(this.missilesOfBoss , this.missilesOfBoss.length-1);
            }
        }
    }


    /*子弹碰撞行为*/
    public void bulletHitAction(){
        int index=-1;
        //遍历子弹
        for (int i=0 ; i<this.bullets.length ; i++){
            int x1=this.bullets[i].x+this.bullets[i].width;
            //遍历生成物
            for (int j=0 ; j<this.generators.length ; j++){
                int x2=this.generators[j].x+this.generators[i].width/2;
                //碰撞
                if (x1>=x2){
                    // 判断非陷阱生成物
                    if ( !(this.generators[j] instanceof  Obstacle) ){
                        index=j;
                        break;
                    }
                }
            }
            if (index!=-1){
                decreaseLife( i , index );
                isEnemyAlive( index );
                removeBullet( i );
            }
        }
    }


    /*掉血*/
    public void decreaseLife(int i , int j){
        this.generators[j].life-=this.bullets[i].damage;
    }

    /*移除子弹*/
    public void removeBullet(int i){
        this.bullets[i]=this.bullets[this.bullets.length-1];
        this.bullets=Arrays.copyOf(this.bullets , this.bullets.length-1);
    }



    /*判断敌方是否死亡*/
    public void isEnemyAlive(int i){
        if (this.generators[i].life<=0) {
            enemyExplosion(i);//爆炸
            int lastLevel = this.hero.level;
            this.hero.getExp(this.generators[i].getExp());//获得经验
            if (this.hero.level>lastLevel) {
                String type=getRandomAward();
                System.out.println(type);
                switch (type){
                    case "fireUp" : this.hero.fireUpCount();break;
                    case "fly" : this.hero.ableToFly=true;break;
                    case "equipMissile" : this.hero.equipMissile();break;
                    case "equipShield" : this.hero.getShield();break;
                    case "addLife" : this.hero.addLife();break;
                }
            }
        }
    }

    /*升级随机奖励*/
    public String getRandomAward(){
        Random random=new Random();
        int type=random.nextInt(50);
        if (type<=10){
            return "fireUp";
        }
        else if (type>10 && type<=20){
            return "fly";
        }
        else if (type>20 && type<=30){
            return "equipMissile";
        }
        else if (type>30 && type<=40){
            return "equipShield";
        }
        else {
            return "addLife";
        }
    }


    /*敌机爆炸*/
    public void enemyExplosion(int i){
        //敌机爆炸
        this.generators[i].image=bangImg;
        //移除爆炸敌机
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                int length=Start.this.generators.length;
                Start.this.generators[i]=Start.this.generators[length-1];
                Start.this.generators=Arrays.copyOf(Start.this.generators , length-1);
            }
        } , 30);
    }


    /*绘制子弹/导弹*/
    public void paintBullets(Graphics graphics){
        for (int i=0 ; i<this.bullets.length ; i++){
            graphics.drawImage(this.bullets[i].image , this.bullets[i].x ,this.bullets[i].y , null);
        }
    }

    /*绘制敌方导弹*/
    public void paintMissiles(Graphics graphics){
        for (int i=0 ; i<this.missilesOfBoss.length ; i++){
            this.missilesOfBoss[i].image=missileOfBossImg;
            graphics.drawImage(this.missilesOfBoss[i].image , this.missilesOfBoss[i].x , this.missilesOfBoss[i].y , null);
        }
    }



    /*主角碰撞*/
    public void heroHitAction(){
        int x=this.hero.x+this.hero.width;
        int y=this.hero.y+this.hero.height;

        if (isHitByGenerators(x , y)) {
            if (this.hero.shield>0){
                this.hero.shield--;
            }
            else {
                this.hero.life--;
            }
        }

        if (isHitByMissile(x , y)){
            if (this.hero.shield>0){
                this.hero.shield--;
            }
            else {
                this.hero.life--;
            }
        }

    }

    /*判断是否碰撞生成物*/
    public boolean isHitByGenerators(int x , int y){
        for (int i=0 ; i<this.generators.length ; i++){
            //获取宽高
            int x1=this.generators[i].x;
            int x2=x1+this.generators[i].width;
            int y1=this.generators[i].y;
            //判断碰撞
            if (x>=x1 && x<=x2){
                if (y>=y1){
                    //暂停
                    Start.speed=0;
                    this.generators[i]=this.generators[this.generators.length-1];
                    this.generators=Arrays.copyOf(this.generators , this.generators.length-1);
                    //一秒后继续
                    new Timer().schedule(new TimerTask() {
                        @Override
                        public void run() {
                            Start.speed=5;
                        }
                    } , 1000);
                    return true;
                }
            }
        }
        return false;
    }

    /*判断是否碰撞敌方导弹*/
    public boolean isHitByMissile(int x , int y){
        for (int i=0 ; i<this.missilesOfBoss.length ; i++){
            int x1=this.missilesOfBoss[i].x;
            int y1=this.missilesOfBoss[i].y;
            if (x>=x1){
                if (y>=y1){
                    Start.speed=0;
                    this.missilesOfBoss[i]=this.missilesOfBoss[this.missilesOfBoss.length-1];
                    this.missilesOfBoss=Arrays.copyOf(this.missilesOfBoss , this.missilesOfBoss.length-1);
                    //一秒后继续
                    new Timer().schedule(new TimerTask() {
                        @Override
                        public void run() {
                            Start.speed=5;
                        }
                    } , 500);
                    return true;
                }
            }
        }
        return false;
    }

    /*绘制主角*/
    public  void paintHero(Graphics graphics){
        graphics.drawImage(this.hero.image , this.hero.x , this.hero.y , null);
        if (this.hero.shield>0){
            if (this.hero.isJumping || this.hero.isFlying){
                graphics.drawImage(shieldImg , this.hero.x+50 , this.hero.y-20 , null);
            }
            else {
                graphics.drawImage(shieldImg , this.hero.x-20 , this.hero.y-20 , null);
            }
        }
    }




    /*绘制*/
    public void paint(Graphics graphics){
        super.paint(graphics);//调用父类paint方法
        graphics.drawImage(background , this.bgXPosition , 0 , null);
        Start.this.paintGUI(graphics);
        Start.this.paintHero(graphics);
        Start.this.paintGenerators(graphics);
        Start.this.paintBullets(graphics);
        Start.this.paintMissiles(graphics);
    }

    /*判断游戏是否结束*/
    public void checkIsGameOver(){
        if (this.hero.life<0){
            this.speed=0;
        }
    }



    /*游戏开始*/
    public void action(){
        //监听键盘
        KeyAdapter keyAdapter=new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                //空格跳跃
                if (e.getKeyCode()==32){
                    //飞行
                    if (Start.this.hero.ableToFly){
                        Start.this.hero.increaseSpeedAndFly();
                     }
                    //跳跃(不允许二连跳)
                    else if (!Start.this.hero.isJumping){
                        Start.this.hero.move();
                    }
                }
                //回车攻击
                if (e.getKeyCode()==10){
                    long thisTime=new Date().getTime();
                    //两次发射间隔500ms
                    if (thisTime- lastTime>500){
                        lastTime =thisTime;
                        //火力升级
                        if (Start.this.hero.fireUpCount>0){
                            Bullet[] bullets1=Start.this.hero.continuousShoot();
                            Start.this.bullets=Arrays.copyOf(Start.this.bullets , Start.this.bullets.length+bullets1.length);
                            System.arraycopy(bullets1 , 0 , Start.this.bullets , Start.this.bullets.length-bullets1.length , bullets1.length  );
                        }
                        //普通火力
                        else {
                            Bullet bullet=Start.this.hero.shoot();
                            Start.this.bullets=Arrays.copyOf(Start.this.bullets , Start.this.bullets.length+1);
                            Start.this.bullets[Start.this.bullets.length-1]=bullet;
                        }
                    }
                }
                //小键盘+发射导弹
                if (e.getKeyCode()==107){
                    if (Start.this.hero.missile>0){
                        long thisTime=new Date().getTime();
                        if (thisTime-lastTime>1500){
                            lastTime=thisTime;
                            Missile missile=Start.this.hero.fireMissile();
                            Start.this.bullets=Arrays.copyOf(Start.this.bullets , Start.this.bullets.length+1);
                            Start.this.bullets[Start.this.bullets.length-1]=missile;
                        }
                    }
                }
            }
        };
        this.addKeyListener(keyAdapter);
        this.timer=new Timer();
        this.timer.schedule(new TimerTask() {
            public void run() {
                Start.this.bgScroll();//地图滚动
                Start.this.getMeters();//计算里程
                Start.this.generator();
                Start.this.moveWithMap();//随地图移动
                Start.this.moveXWithMap();
                Start.this.moveBullets();//子弹/导弹移动
                Start.this.moveMissile();
                Start.this.bulletHitAction();
                Start.this.heroHitAction();
                Start.this.repaint();
            }
        }, this.interval , this.interval);
        this.requestFocus();
    }


    /*main*/
    public static void  main(String[] args){
        JFrame frame=new JFrame("LegendsNeverDie");
        Start game=new Start();
        frame.add(game);
        frame.setSize(WIDTH , HEIGHT);
        frame.setLocationRelativeTo(null);
        frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        frame.setVisible(true);
        game.action();
    }


}
