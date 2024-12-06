# Q4_sol_viktr


# **EscrowX - Escrow as a Service Protocol**

**EscrowX** is a simple escrow-as-a-service protocol designed for integration with peer-to-peer platforms. It ensures secure transactions by holding funds in escrow until conditions are met, ensuring trust and safety between parties.

## **Table of Contents**
1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Program Details](#program-details)
4. [Usage](#usage)

---

## **Installation**

Follow these steps to install and run EscrowX on your local machine:

1. Clone the repository:
    ```bash
    git clone <repo-url>
    ```
2. Navigate into the `escrowx` directory:
    ```bash
    cd escrowx
    ```
3. Install dependencies:
    ```bash
    npm run install
    ```
4. Run the development server:
    ```bash
    npm run dev
    ```

---

## **Getting Started**

### **Prerequisites**

Before setting up EscrowX, make sure you have the following installed:

1. **Rust** - The programming language used to write smart contracts.
2. **Anchor Framework** - A framework for Solana that simplifies smart contract development.
3. **Solana CLI** - Command-line tools for interacting with Solana blockchain.
4. **Next.js** - React-based framework for building frontend applications.
5. **npm** - JavaScript package manager to install dependencies.

### **Setup Instructions**

1. **Clone the Repository**: Clone this repository to your local machine using:
    ```bash
    git clone <repo-url>
    ```
2. **Install Dependencies**: Navigate to the `escrowx` directory and install all dependencies by running:
    ```bash
    npm run install
    ```
3. **Run the Application**: Start the development server using:
    ```bash
    npm run dev
    ```

---

## **Program Details**

- **Program ID**: [EscrowX Program on Solana](https://solscan.io/account/5f5eRadbvBQFUDhxgM4XJz2dDqF78a4fU63Nwky3E1VN?cluster=devnet)
- **Cluster**: Devnet (default) for testing and development purposes.

---

## **Usage**

Once you have the program running, you can start integrating EscrowX into your peer-to-peer platform. Below is an outline of the program's functionality and how to use it:

- **Initialize Escrow**: Create an escrow account and specify the buyer, seller, and amount.
- **Complete Escrow**: Finalize the transaction once both parties meet the conditions.
- **Dispute Escrow**: In case of a disagreement, the escrow can be disputed and reviewed.

The full usage and API documentation will be included in the following sections, once the integration steps are outlined.

---
