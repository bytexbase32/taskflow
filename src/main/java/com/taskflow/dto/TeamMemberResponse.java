
package com.taskflow.dto;

import com.taskflow.models.TeamRole;
import java.time.LocalDateTime;

public record TeamMemberResponse(
        Long id,
        String name,
        String email,
        TeamRole role,
        LocalDateTime joinedAt) {
}
