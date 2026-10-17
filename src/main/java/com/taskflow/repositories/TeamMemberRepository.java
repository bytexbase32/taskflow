
package com.taskflow.repositories;

import com.taskflow.models.TeamMember;
import com.taskflow.models.TeamMemberId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, TeamMemberId> {

    List<TeamMember> findByUser_Id(Long userId);

    List<TeamMember> findByTeam_Id(Long teamId);

    boolean existsByTeam_IdAndUser_Id(Long teamId, Long userId);
}
