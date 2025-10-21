package com.memberbenefits.graphql.dto;
import lombok.Data;

@Data
public class PaginationInput {
    private Integer first;
    private String after;
    private Integer last;
    private String before;
}
