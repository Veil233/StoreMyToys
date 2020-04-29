package game;

import java.awt.image.BufferedImage;

/*抽象类：可移动的对象*/
public abstract class MovableObject {
    protected int x;
    protected int y;
    protected int width;
    protected int height;
    protected  int speed;
    protected BufferedImage image;
    protected int exp;


    /*构造方法*/
    public MovableObject(){
    }

    /*抽象方法：移动*/
    public abstract void move();


}
