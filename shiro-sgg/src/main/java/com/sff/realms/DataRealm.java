package com.sff.realms;

import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by shifeifei on 2016/12/18.
 */
public class DataRealm extends AuthorizingRealm {

    /**
     * MD盐值加密
     *
     * @param args
     */
    public static void main(String[] args) {
        String hashAlgorithmName = "MD5";
        Object credentials = "123456";
        Object salt = ByteSource.Util.bytes("user");//盐
        int hashIterations = 1024;

        Object result = new SimpleHash(hashAlgorithmName, credentials, salt, hashIterations);
        System.out.println("------------------------" + result);

    }

    //做授权的方法
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token)
            throws AuthenticationException {
        System.out.println("-----------第一个,MD5 Realm验证-----------");

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
            credentials = "038bdaf98f2037b31f1e75b5b4c9b26e";
        } else if ("user".equals(username)) {
            credentials = "098d2c478e9c11555ce2823231e02ec1";
        }

        //3)realName:当前realm对象的name,调用父类的getName()方法即可
        String realmName = getName();

        //4)设置盐值
        ByteSource credentialsSalt = ByteSource.Util.bytes(username);

        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(principal, credentials, credentialsSalt, realmName);

        return info;
    }

    //授权Realm的实现:授权使用的方法,某个角色具有某种权限
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        System.out.println("-------------授权方法,doGetAuthorizationInfo-----------");
        //1.从 PrincipalCollection 中获取用户登录信息
        Object principal = principalCollection.getPrimaryPrincipal();

        //2.利用登录的用户获取当前用户的角色或者权限(可能要查询数据库)
        Set<String> roles = new HashSet<String>();
        roles.add("user");
        if ("admin".equals(principal)) {
            roles.add("admin");//user登录可以访问一个页面user.jsp,但是admin登录是可以访问user.jsp和admin.jsp
        }
        //3.返回 SimpleAuthenticationInfo 对象
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo(roles);

        return info;
    }

}
