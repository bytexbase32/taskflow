
package com.taskflow.models;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class TeamMemberId implements Serializable {

    private Long teamId;
    private Long userId;

    public TeamMemberId() {
    }

    public TeamMemberId(Long teamId, Long userId) {
        this.teamId = teamId;
        this.userId = userId;
    }

    public Long getTeamId() {
        return teamId;
    }

    public Long getUserId() {
        return userId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }

        if (!(object instanceof TeamMemberId other)) {
            return false;
        }

        return Objects.equals(teamId, other.teamId)
                && Objects.equals(userId, other.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(teamId, userId);
    }
}
