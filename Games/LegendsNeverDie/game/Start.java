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
    public Bullet[] bullets=new Bullet[0];
    public static long lastTime=0;//上次发射子弹的时间
    //导弹
    public static BufferedImage missileOfHeroImg;
    public Missile[] missilesOfHero=new Missile[0];
    public static BufferedImage missileOfBossImg;
    public Missile[] missilesOfBoss=new Missile[0];
    //护盾
    public static BufferedImage shieldImg;
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
        if (this.hero.missile>0){
            graphics.drawImage(missileCountImg , 850 , 60 , null);
            graphics.drawString(String.valueOf(this.hero.missile) , 880 , 80);
        }
        //护盾值

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
            if (type==probability){//生成boss
                if (x != 0){
                    Boss boss = new Boss(x);
                    this.generators=Arrays.copyOf(this.generators, this.generators.length + 1);
                    this.generators[this.generators.length - 1] = boss;
                    //boss出现会发射导弹
                    Missile missile=boss.fireMissile();
                    this.missilesOfBoss=Arrays.copyOf(this.missilesOfBoss , this.missilesOfBoss.length+1);
                    this.missilesOfBoss[this.missilesOfBoss.length-1]=missile;
                }
            }
            else if (type%2==0){//生成陷阱
                if (x != 0) {
                    Obstacle obstacle = new Obstacle(x);
                    this.generators=Arrays.copyOf(this.generators, this.generators.length + 1);
                    this.generators[this.generators.length - 1] = obstacle;
                }
            }
            else  {//生成普通敌人
                if (x != 0) {
                    Enemy enemy = new Enemy(x);
                    this.generators = Arrays.copyOf(this.generators, this.generators.length + 1);
                    this.generators[this.generators.length - 1] = enemy;
                }
            }
        }
    }
    /*绘制生成物*/
    public void printGenerators(Graphics graphics){
        for (int i=0 ; i<this.generators.length ; i++) {
            graphics.drawImage(this.generators[i].image, this.generators[i].x, this.generators[i].y, null);
        }
    }
    /*生成物随地图移动*/
    public void moveWithMap(){
        for (int i=0 ; i<generators.length ; i++){
            generators[i].move();
        }
    }
    /*生成物出画移除*/
    public void removeIfOut(){
        for (int i=0 ; i<generators.length ; i++){
            if (this.generators[i].x<-300){//生成物出画移除
                this.generators[i]=this.generators[this.generators.length-1];
                this.generators=Arrays.copyOf(this.generators , this.generators.length-1);//缩容，最后的值替代当前值
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
        for (int i=0 ; i<this.bullets.length ; i++){
            this.bullets[i].move();
        }
        for (int j=0 ; j<this.missilesOfHero.length ; j++){
            this.missilesOfHero[j].move();
        }
        for (int k=0 ; k<this.missilesOfBoss.length ; k++){
            this.missilesOfBoss[k].moveReverse();
        }
        
    }
    /*绘制子弹/导弹*/
    public void paintBullets(Graphics graphics){
        for (int i=0 ; i<this.bullets.length ; i++){
            graphics.drawImage(this.bullets[i].image , this.bullets[i].x ,this.bullets[i].y , null);
        }
        for (int j=0 ; j<this.missilesOfHero.length ; j++){
            graphics.drawImage(this.missilesOfHero[j].image , this.missilesOfHero[j].x , this.missilesOfHero[j].y , null);
        }
        for (int k=0 ; k<this.missilesOfBoss.length ; k++){
                this.missilesOfBoss[k].image=missileOfBossImg;
                graphics.drawImage(this.missilesOfBoss[k].image , this.missilesOfBoss[k].x , this.missilesOfBoss[k].y , null);
        }
    }
    




    /*绘制主角*/
    public  void paintHero(Graphics graphics){
        graphics.drawImage(this.hero.image , this.hero.x , this.hero.y , null);
    }




    /*绘制*/
    public void paint(Graphics graphics){
        super.paint(graphics);//调用父类paint方法
        graphics.drawImage(background , this.bgXPosition , 0 , null);
        Start.this.paintGUI(graphics);
        Start.this.paintHero(graphics);
        Start.this.printGenerators(graphics);
        Start.this.paintBullets(graphics);
    }


    /*游戏开始*/
    public void action(){
        KeyAdapter keyAdapter=new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode()==32){//空格跳跃
                    if (!Start.this.hero.isJumping){
                        Start.this.hero.move();
                    }
                }
                if (e.getKeyCode()==10){//回车攻击
                    long thisTime=new Date().getTime();
                    if (thisTime- lastTime>500 || Start.this.hero.fireUpCount>0){//两次发射间隔500ms
                        lastTime =thisTime;
                        Bullet bullet=Start.this.hero.shoot();
                        Start.this.bullets=Arrays.copyOf(Start.this.bullets , Start.this.bullets.length+1);
                        Start.this.bullets[Start.this.bullets.length-1]=bullet;
                    }
                }
                if (e.getKeyCode()==107){//小键盘+发射导弹
                    if (Start.this.hero.missile>0){
                        long thisTime=new Date().getTime();
                        if (thisTime-lastTime>1500){
                            lastTime=thisTime;
                            Missile missile=Start.this.hero.fireMissile();
                            Start.this.missilesOfHero=Arrays.copyOf(Start.this.missilesOfHero , Start.this.missilesOfHero.length+1);
                            Start.this.missilesOfHero[Start.this.missilesOfHero.length-1]=missile;
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
                Start.this.removeIfOut();
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
