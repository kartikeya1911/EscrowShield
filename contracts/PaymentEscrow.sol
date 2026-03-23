// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PaymentEscrow is ReentrancyGuard {
    enum EscrowStatus {
        Locked,
        Released,
        Refunded
    }

    struct EscrowTransaction {
        uint256 id;
        address buyer;
        address seller;
        uint256 amount;
        string description;
        uint256 createdAt;
        uint256 releaseTime;
        EscrowStatus status;
    }

    uint256 public totalTransactions;
    mapping(uint256 => EscrowTransaction) private escrows;
    mapping(address => uint256[]) private userEscrowIds;

    event PaymentInitiated(
        uint256 indexed escrowId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        string description,
        uint256 releaseTime
    );
    event PaymentReleased(uint256 indexed escrowId, address indexed seller, uint256 amount, bool autoReleased);
    event RefundIssued(uint256 indexed escrowId, address indexed buyer, uint256 amount);

    modifier escrowExists(uint256 escrowId) {
        require(escrowId < totalTransactions, "Escrow does not exist");
        _;
    }

    modifier onlyBuyer(uint256 escrowId) {
        require(msg.sender == escrows[escrowId].buyer, "Only buyer allowed");
        _;
    }

    modifier onlyLocked(uint256 escrowId) {
        require(escrows[escrowId].status == EscrowStatus.Locked, "Escrow is not locked");
        _;
    }

    function createEscrow(
        address seller,
        string calldata description,
        uint256 timeoutDuration
    ) external payable nonReentrant returns (uint256 escrowId) {
        require(seller != address(0), "Invalid seller address");
        require(seller != msg.sender, "Buyer and seller must differ");
        require(msg.value > 0, "Amount must be greater than zero");
        require(timeoutDuration >= 1 minutes && timeoutDuration <= 30 days, "Invalid timeout window");

        escrowId = totalTransactions;
        totalTransactions += 1;

        uint256 releaseTime = block.timestamp + timeoutDuration;

        escrows[escrowId] = EscrowTransaction({
            id: escrowId,
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            description: description,
            createdAt: block.timestamp,
            releaseTime: releaseTime,
            status: EscrowStatus.Locked
        });

        userEscrowIds[msg.sender].push(escrowId);
        userEscrowIds[seller].push(escrowId);

        emit PaymentInitiated(escrowId, msg.sender, seller, msg.value, description, releaseTime);
    }

    function confirmDelivery(uint256 escrowId)
        external
        escrowExists(escrowId)
        onlyBuyer(escrowId)
        onlyLocked(escrowId)
        nonReentrant
    {
        EscrowTransaction storage escrow = escrows[escrowId];
        escrow.status = EscrowStatus.Released;

        (bool sent, ) = payable(escrow.seller).call{value: escrow.amount}("");
        require(sent, "Transfer to seller failed");

        emit PaymentReleased(escrowId, escrow.seller, escrow.amount, false);
    }

    function autoRelease(uint256 escrowId) external escrowExists(escrowId) onlyLocked(escrowId) nonReentrant {
        EscrowTransaction storage escrow = escrows[escrowId];
        require(block.timestamp >= escrow.releaseTime, "Escrow still in lock period");

        escrow.status = EscrowStatus.Released;

        (bool sent, ) = payable(escrow.seller).call{value: escrow.amount}("");
        require(sent, "Transfer to seller failed");

        emit PaymentReleased(escrowId, escrow.seller, escrow.amount, true);
    }

    function requestRefund(uint256 escrowId)
        external
        escrowExists(escrowId)
        onlyBuyer(escrowId)
        onlyLocked(escrowId)
        nonReentrant
    {
        EscrowTransaction storage escrow = escrows[escrowId];
        require(block.timestamp < escrow.releaseTime, "Use auto release after timeout");

        escrow.status = EscrowStatus.Refunded;

        (bool sent, ) = payable(escrow.buyer).call{value: escrow.amount}("");
        require(sent, "Refund transfer failed");

        emit RefundIssued(escrowId, escrow.buyer, escrow.amount);
    }

    function getEscrow(uint256 escrowId)
        external
        view
        escrowExists(escrowId)
        returns (EscrowTransaction memory)
    {
        return escrows[escrowId];
    }

    function getUserEscrowIds(address user) external view returns (uint256[] memory) {
        return userEscrowIds[user];
    }
}
