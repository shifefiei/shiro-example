package com.sff.service;

import com.sff.domain.AppAuthority;

import java.util.List;

/**
 * Created by shifeifei on 2017/3/4.
 * 权限管理业务
 */
public interface AuthorityService {

    int isExistById(Long id);

    /**
     * 查询全部权限
     *
     * @return
     */
    List<Object> findAll();

    /**
     * 查询权限bean
     *
     * @param id
     * @return
     */
    AppAuthority findById(Long id);

    /**
     * 删除权限
     *
     * @param id
     * @return
     */
    int deleteById(Long id);

    /**
     * 插入权限
     *
     * @param appAuthority
     */
    void insert(AppAuthority appAuthority);

    /**
     * 更新权限
     *
     * @param appAuthority
     * @return
     */
    int updateById(AppAuthority appAuthority);

    /**
     * 保存或更新权限
     *
     * @param appAuthority
     * @return
     */
    int addOrUpdate(AppAuthority appAuthority);
}
