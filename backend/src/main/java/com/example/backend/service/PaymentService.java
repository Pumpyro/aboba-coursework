package com.example.backend.service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.PaymentRequest;
import com.example.backend.entity.BankAccount;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderProduct;
import com.example.backend.entity.User;
import com.example.backend.repository.BankAccountRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.UserRepository;

@Service
public class PaymentService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public String processPayment(PaymentRequest paymentRequest) {
        Optional<BankAccount> accountOptional = bankAccountRepository.findByAccountNumber(paymentRequest.getAccountNumber());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (accountOptional.isEmpty()) {
            throw new IllegalArgumentException("Счет с таким номером не найден.");
        }

        BankAccount account = accountOptional.get();

        if (!account.getPinCode().equals(paymentRequest.getPinCode())) {
            throw new IllegalArgumentException("Неверный пин-код.");
        }

        BigDecimal orderAmount = paymentRequest.getOrderAmount();
        if (account.getBalance().compareTo(orderAmount) < 0) {
            throw new IllegalArgumentException("Недостаточно средств на счете.");
        }

        account.setBalance(account.getBalance().subtract(orderAmount));
        bankAccountRepository.save(account);

        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new IllegalArgumentException("Пользователь не найден");
        }

        // Создание заказа
        Order order = new Order();
        order.setUser(user);
        order.setTotalPrice(orderAmount);

        // Сохранение продуктов в заказе
        Set<OrderProduct> orderProducts = paymentRequest.getProducts().entrySet().stream()
                .map(entry -> {
                    OrderProduct orderProduct = new OrderProduct();
                    orderProduct.setOrder(order);
                    orderProduct.setProductId(entry.getKey());
                    orderProduct.setQuantity(entry.getValue());
                    return orderProduct;
                }).collect(Collectors.toSet());

        order.setProducts(orderProducts);

        orderRepository.save(order);

        return UUID.randomUUID().toString();
    }
}
