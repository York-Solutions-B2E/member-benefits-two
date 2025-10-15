package com.memberbenefits;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Transactional
public abstract class IntegrationTestBase extends TestBase {
    
    @LocalServerPort
    protected int port;
    
    protected TestRestTemplate restTemplate = new TestRestTemplate();
    
    protected String getBaseUrl() {
        return "http://localhost:" + port;
    }
}