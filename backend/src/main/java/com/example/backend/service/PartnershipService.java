package com.example.backend.service;

import com.example.backend.dto.PartnershipRequest;
import com.example.backend.entity.Partnership;
import com.example.backend.repository.PartnershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PartnershipService {

    @Autowired
    private PartnershipRepository partnershipRepository;

    public Partnership savePartnership(PartnershipRequest partnershipRequest) {
        Partnership partnership = new Partnership();
        partnership.setFirstName(partnershipRequest.getFirstName());
        partnership.setLastName(partnershipRequest.getLastName());
        partnership.setContent(partnershipRequest.getContent());
        partnership.setCustomerPhone(partnershipRequest.getCustomerPhone());
        return partnershipRepository.save(partnership);
    }

    public void deletePartnership(Long id){
        partnershipRepository.deleteById(id);
    }
}
