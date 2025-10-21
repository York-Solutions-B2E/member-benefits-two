package com.memberbenefits.graphql.dto;
import lombok.Data;

@Data
public class PageInfo {
    private Boolean hasNextPage;
    private Boolean hasPreviousPage;
    private String startCursor;
    private String endCursor;
}
