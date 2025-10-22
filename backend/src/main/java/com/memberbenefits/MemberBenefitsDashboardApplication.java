package com.memberbenefits;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.memberbenefits"})
public class MemberBenefitsDashboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(MemberBenefitsDashboardApplication.class, args);
	}

}
