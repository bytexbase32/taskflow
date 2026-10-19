package com.taskflow.services;

import com.taskflow.dto.CreateTeamRequest;
import com.taskflow.dto.TeamResponse;
import com.taskflow.models.Team;
import com.taskflow.models.TeamMember;
import com.taskflow.models.TeamRole;
import com.taskflow.models.User;
import com.taskflow.repositories.TeamMemberRepository;
import com.taskflow.repositories.TeamRepository;
import com.taskflow.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, TeamMemberRepository teamMemberRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TeamResponse createTeam(CreateTeamRequest request, Long currentUserId) {

        User owner = userRepository.findById(currentUserId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Team team = new Team(request.getName(), request.getDescription());

        Team savedTeam = teamRepository.save(team);

        TeamMember membership = new TeamMember(
                savedTeam, owner, TeamRole.OWNER);

        teamMemberRepository.save(membership);

        return toResponse(savedTeam);
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> getMyTeams(Long currentUserId) {
        return teamMemberRepository.findByUser_Id(currentUserId)
                .stream()
                .map(TeamMember::getTeam)
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TeamResponse getTeamById(Long teamId, Long currentUserId) {

        requireMembership(teamId, currentUserId);

        Team team = findTeam(teamId);
        return toResponse(team);
    }

    @Transactional
    public void addMember(Long teamId, Long userId, Long currentUserId) {

        requireOwner(teamId, currentUserId);

        Team team = findTeam(teamId);
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (teamMemberRepository.existsByTeam_IdAndUser_Id(teamId, userId)) {
            throw new IllegalArgumentException("User is already a team member");
        }

        TeamMember membership = new TeamMember(team, user, TeamRole.MEMBER);
        teamMemberRepository.save(membership);
    }

    @Transactional
    public void removeMember(Long teamId, Long userId, Long currentUserId) {

        requireOwner(teamId, currentUserId);

        if (userId.equals(currentUserId)) {
            throw new IllegalArgumentException("The owner cannot remove themselves");
        }

        TeamMember membership = teamMemberRepository.findById(
                new com.taskflow.models.TeamMemberId(teamId, userId)).orElseThrow(() ->
                new IllegalArgumentException("Team membership not found"));

        teamMemberRepository.delete(membership);
    }

    private Team findTeam(Long teamId) {
        return teamRepository.findById(teamId).orElseThrow(() ->
                        new IllegalArgumentException("Team not found"));
    }

    private void requireMembership(Long teamId, Long userId) {
        if (!teamMemberRepository.existsByTeam_IdAndUser_Id(teamId, userId)) {
            throw new IllegalArgumentException("You are not a member of this team");
        }
    }

    private void requireOwner(Long teamId, Long userId) {
        TeamMember membership = teamMemberRepository
                .findById(new com.taskflow.models.TeamMemberId(teamId, userId))
                .orElseThrow(() -> new IllegalArgumentException("Team membership not found"));

        if (membership.getRole() != TeamRole.OWNER) {
            throw new IllegalArgumentException("Only the team owner can manage members");
        }
    }

    private TeamResponse toResponse(Team team) {
        TeamResponse response = new TeamResponse();
        response.setId(team.getId());
        response.setName(team.getName());
        response.setDescription(team.getDescription());
        response.setCreatedAt(team.getCreatedAt());
        return response;
    }
}
