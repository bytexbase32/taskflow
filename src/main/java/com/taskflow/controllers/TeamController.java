
package com.taskflow.controllers;

import com.taskflow.dto.CreateTeamRequest;
import com.taskflow.dto.TeamResponse;
import com.taskflow.services.TeamService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.taskflow.dto.AddTeamMemberRequest;
import com.taskflow.dto.TeamMemberResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public TeamResponse createTeam(
            @Valid @RequestBody CreateTeamRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return teamService.createTeam(request, currentUserId(jwt));
    }

    @GetMapping
    public List<TeamResponse> getMyTeams(
            @AuthenticationPrincipal Jwt jwt) {
        return teamService.getMyTeams(currentUserId(jwt));
    }

    @GetMapping("/{id}")
    public TeamResponse getTeamById(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        return teamService.getTeamById(id, currentUserId(jwt));
    }

    @PostMapping("/{team_id}/addMember")
    public void addMember(
            @PathVariable("team_id") Long teamId,
            @RequestParam("user_id") Long userId,
            @AuthenticationPrincipal Jwt jwt) {
        teamService.addMember(teamId, userId, currentUserId(jwt));
    }

    @PostMapping("/{team_id}/removeMember")
    public void removeMember(
            @PathVariable("team_id") Long teamId,
            @RequestParam("user_id") Long userId,
            @AuthenticationPrincipal Jwt jwt) {
        teamService.removeMember(teamId, userId, currentUserId(jwt));
    }

    private Long currentUserId(Jwt jwt) {
        return Long.parseLong(jwt.getSubject());
    }

    @GetMapping("/{id}/members")
    public List<TeamMemberResponse> getTeamMembers(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        return teamService.getTeamMembers(id, currentUserId(jwt));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<Void> addMemberByEmail(
            @PathVariable Long id,
            @Valid @RequestBody AddTeamMemberRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        teamService.addMemberByEmail(
                id, request, currentUserId(jwt));

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
