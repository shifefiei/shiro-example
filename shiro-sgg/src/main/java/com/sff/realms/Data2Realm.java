package com.sff.realms;

import org.apache.shiro.authc.*;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.realm.AuthenticatingRealm;
import org.apache.shiro.util.ByteSource;

/**
 * Created by shifeifei on 2016/12/25.
 */
public class Data2Realm extends AuthenticatingRealm {

    /**
     * SHA1加密
     *
     * @param args
     */
    public static void main(String[] args) {
        String hashAlgorithmName = "SHA1";
        Object credentials = "123456";
        Object salt = ByteSource.Util.bytes("user");
        int hashIterations = 1024;

        Object result = new SimpleHash(hashAlgorithmName, credentials, salt, hashIterations);
        System.out.println("------------------------" + result);

    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token)
            throws AuthenticationException {
        System.out.println("-----------第二个,SH1 Realm验证-----------");

        //1. 把 AuthenticationToken 转换为 UsernamePasswordToken
        UsernamePasswordToken usernamePasswordToken = (UsernamePasswordToken) token;

        //2. 从 UsernamePasswordToken 中来获取 username
        String username = usernamePasswordToken.getUsername();

        //3. 调用数据库的方法, 从数据库中查询 username 对应的用户记录
        System.out.println("------------------查询数据库获取username=" + username + "对应的信息!");

        //4. 若用户不存在, 则可以抛出 UnknownAccountException 异常
        if ("unknow".equals(username)) {
            throw new UnknownAccountException("用户不存在");
        }

        //5. 根据用户信息的情况, 决定是否需要抛出其他的 AuthenticationException 异常.
        if ("kate".equals(username)) {
            throw new LockedAccountException("用户被锁定");
        }

        //6. 根据用户的情况, 来构建 AuthenticationInfo 对象并返回;通常使用的实现类是:SimpleAuthenticationInfo

        //1)principal:认证实体信息,可以是username，也可以是数据表对应的用户实体对象
        Object principal = username;

        //2)credentials:密码
        //Object credentials = "123456";
        Object credentials = null;//"fc1709d0a95a6be30bc5926fdb7f22f4";
        if ("admin".equals(username)) {
            credentials = "ce2f6417c7e1d32c1d81a797ee0b499f87c5de06";
        } else if ("user".equals(username)) {
            credentials = "073d4c3ae812935f23cb3f2a71943f49e082a718";
        }

        //3)realName:当前realm对象的name,调用父类的getName()方法即可
        String realmName = getName();

        //4)设置盐值
        ByteSource credentialsSalt = ByteSource.Util.bytes(username);

        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(principal, credentials, credentialsSalt, realmName);

        return info;
    }

}
