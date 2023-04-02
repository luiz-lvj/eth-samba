contract;

abi Wallet {
    #[storage(read, write), payable]
    fn receive_funds();

    #[storage(read, write)]
    fn send_funds(amount_to_send: u64, recipient_address: Address);
}

use std::{
    auth::msg_sender,
    call_frames::msg_asset_id,
    constants::BASE_ASSET_ID,
    context::msg_amount,
    token::transfer_to_address,
};

const OWNER_ADDRESS = Address::from(0xc617d5dbf7859c0610c6f84559e0b9a4acc276355892c9f5fdc0fe1c9db57070);

storage {
    balance: u64 = 0,
}

impl Wallet for Contract {
    #[storage(read, write), payable]
    fn receive_funds() {
        if msg_asset_id() == BASE_ASSET_ID {
            // If we received `BASE_ASSET_ID` then keep track of the balance.
            // Otherwise, we're receiving other native assets and don't care
            // about our balance of tokens.
            storage.balance += msg_amount();
        }
    }

    #[storage(read, write)]
    fn send_funds(amount_to_send: u64, recipient_address: Address) {
        let sender = msg_sender().unwrap();
        match sender {
            Identity::Address(addr) => assert(addr == OWNER_ADDRESS),
            _ => revert(0),
        };

        let current_balance = storage.balance;
        assert(current_balance >= amount_to_send);

        storage.balance = current_balance - amount_to_send;

        // Note: `transfer_to_address()` is not a call and thus not an
        // interaction. Regardless, this code conforms to
        // checks-effects-interactions to avoid re-entrancy.
        transfer_to_address(amount_to_send, BASE_ASSET_ID, recipient_address);
    }
}