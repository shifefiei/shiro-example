package com.sff.dao.mapper;

import com.sff.dao.BaseMapper;
import com.sff.domain.AppUserRole;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by shifeifei on 2017/3/4.
 */
public interface AppRoleUserMapper extends BaseMapper {

    List<AppUserRole> findByUserId(String user_id);

    List<String> findUriByIds(@Param("ids") List<Long> ids);

    List<Long> findResourceIds(@Param("roleIds") List<Long> roleIds);

}
