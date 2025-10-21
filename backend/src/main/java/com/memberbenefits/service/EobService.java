package com.memberbenefits.service;

import com.memberbenefits.dto.ClaimDetailDto;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EobService {
    
    private final ClaimDetailService claimDetailService;
    
    public byte[] generateEobPdf(UUID memberId, UUID claimId) {
        // Get claim details
        ClaimDetailDto claimDetail = claimDetailService.getClaimDetailById(memberId, claimId);
        
        // Generate PDF using iText
        return generatePdfFromClaim(claimDetail);
    }
    
    private byte[] generatePdfFromClaim(ClaimDetailDto claim) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // Add EOB content
            addEobHeader(document, claim);
            addFinancialSummary(document, claim);
            addLineItems(document, claim);
            addFooter(document);
            
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generating EOB PDF", e);
            throw new RuntimeException("Failed to generate EOB PDF", e);
        }
    }
    
    private void addEobHeader(Document document, ClaimDetailDto claim) {
        document.add(new Paragraph("EXPLANATION OF BENEFITS")
            .setTextAlignment(TextAlignment.CENTER)
            .setFontSize(16)
            .setBold());
        
        document.add(new Paragraph("Claim Number: " + claim.getClaimNumber())
            .setFontSize(12));
        
        if (claim.getProvider() != null) {
            document.add(new Paragraph("Provider: " + claim.getProvider().getName())
                .setFontSize(12));
        }
        
        document.add(new Paragraph("Service Date: " + claim.getServiceStartDate())
            .setFontSize(12));
    }
    
    private void addFinancialSummary(Document document, ClaimDetailDto claim) {
        document.add(new Paragraph("FINANCIAL SUMMARY")
            .setFontSize(14)
            .setBold());
        
        Table table = new Table(2);
        table.addCell("Total Billed:");
        table.addCell("$" + claim.getTotalBilled());
        table.addCell("Allowed Amount:");
        table.addCell("$" + claim.getTotalAllowed());
        table.addCell("Plan Paid:");
        table.addCell("$" + claim.getTotalPlanPaid());
        table.addCell("Member Responsibility:");
        table.addCell("$" + claim.getTotalMemberResponsibility());
        
        document.add(table);
    }
    
    private void addLineItems(Document document, ClaimDetailDto claim) {
        document.add(new Paragraph("LINE ITEMS")
            .setFontSize(14)
            .setBold());
        
        if (claim.getLines() != null && !claim.getLines().isEmpty()) {
            Table table = new Table(8);
            table.addCell("CPT");
            table.addCell("Description");
            table.addCell("Billed");
            table.addCell("Allowed");
            table.addCell("Copay");
            table.addCell("Coinsurance");
            table.addCell("Plan Paid");
            table.addCell("You Pay");
            
            claim.getLines().forEach(line -> {
                table.addCell(line.getCptCode());
                table.addCell(line.getDescription());
                table.addCell("$" + line.getBilledAmount());
                table.addCell("$" + line.getAllowedAmount());
                table.addCell("$" + line.getCopayApplied());
                table.addCell("$" + line.getCoinsuranceApplied());
                table.addCell("$" + line.getPlanPaid());
                table.addCell("$" + line.getMemberResponsibility());
            });
            
            document.add(table);
        }
    }
    
    private void addFooter(Document document) {
        document.add(new Paragraph("\nThis is an Explanation of Benefits (EOB) document.")
            .setFontSize(10)
            .setTextAlignment(TextAlignment.CENTER));
    }
}