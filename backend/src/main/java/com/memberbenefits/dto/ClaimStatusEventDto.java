package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimStatusEventDto {
    private String id;
    private String status;
    private OffsetDateTime occurredAt;
    private String note;
}

