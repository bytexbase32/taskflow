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
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.ForbiddenException;
import java.util.List;
import com.taskflow.dto.AddTeamMemberRequest;
import com.taskflow.dto.TeamMemberResponse;
import com.taskflow.exception.ConflictException;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, TeamMemberRepository teamMemberRepository,
            UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TeamResponse createTeam(CreateTeamRequest request, Long currentUserId) {

        User owner = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

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
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

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
                new com.taskflow.models.TeamMemberId(teamId, userId))
                .orElseThrow(() -> new ResourceNotFoundException("Team membership not found"));

        teamMemberRepository.delete(membership);
    }

    private Team findTeam(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));
    }

    private void requireMembership(Long teamId, Long userId) {
        if (!teamMemberRepository.existsByTeam_IdAndUser_Id(teamId, userId)) {
            throw new ForbiddenException("You are not a member of this team");
        }
    }

    private void requireOwner(Long teamId, Long userId) {
        TeamMember membership = teamMemberRepository
                .findById(new com.taskflow.models.TeamMemberId(teamId, userId))
                .orElseThrow(() -> new ForbiddenException(
                        "Only the team owner can manage members"));

        if (membership.getRole() != TeamRole.OWNER) {
            throw new ForbiddenException(
                    "Only the team owner can manage members");
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

    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers(
            Long teamId, Long currentUserId) {

        requireMembership(teamId, currentUserId);
        findTeam(teamId);

        return teamMemberRepository.findByTeam_Id(teamId)
                .stream()
                .map(member -> new TeamMemberResponse(
                        member.getUser().getId(),
                        member.getUser().getName(),
                        member.getUser().getEmail(),
                        member.getRole(),
                        member.getJoinedAt()))
                .toList();
    }

    @Transactional
    public void addMemberByEmail(
            Long teamId,
            AddTeamMemberRequest request,
            Long currentUserId) {

        requireOwner(teamId, currentUserId);

        Team team = findTeam(teamId);

        User user = userRepository.findByEmail(
                request.email().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (teamMemberRepository.existsByTeam_IdAndUser_Id(
                teamId, user.getId())) {
            throw new ConflictException(
                    "User is already a team member");
        }

        teamMemberRepository.save(
                new TeamMember(team, user, TeamRole.MEMBER));
    }

}
