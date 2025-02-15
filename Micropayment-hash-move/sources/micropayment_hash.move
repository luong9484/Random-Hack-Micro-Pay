module self::micropayment_hash{
    use aptos_framework::randomness;
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::coin;
    use std::string::String;
    use aptos_std::table::{Self, Table};
    use aptos_framework::aptos_coin::AptosCoin;
    use std::vector;
    use std::hash;
    // use aptos_std::aptos_hash::keccak256;
    // use std::option::{Self, Option};

    const MODULE_OWNER:address = @self;

    const ENO_SAME_SENDER_RECEIVER:u64 = 0;
    const ENO_NOT_MODULE_OWNER:u64 = 1;
    const E_CHANNEL_ALREADY_REDEEMED:u64 = 2;
    const E_NOT_RECEIVER: u64 = 3;
    const E_INVALID_TOKEN: u64 = 4;

    struct Channel has store, drop, key{
        channel_id: u64,
        sender_address: address,
        receiver_address: address,
        initial_amount: u64,
        total_tokens: u64,
        redeemed: bool,
        key: u256,
    }

    struct UserKey has key{
        address_to_key: Table<address,u256>, 
    }

    struct SignerCapabilityStore has key{
        signer_cap: account::SignerCapability
    }
    struct GlobalTable has key {
        channel_table: Table<u64, Channel>,
        channel_counter:u64,
    }

    public entry fun init_deploy(deployer: &signer) {
        // let signer_address = signer::address_of(account);  
        // assert!(signer_address == @self, "only owner can initialize contract")      
        assert!(signer::address_of(deployer) == MODULE_OWNER, ENO_NOT_MODULE_OWNER);

        // Initialize a resource account that maintains the list of channels
        let (_resource, signer_cap) = account::create_resource_account(deployer, vector::empty());

        let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap);

        coin::register<AptosCoin>(&rsrc_acc_signer);

        // Initialize the global table
        move_to(deployer, GlobalTable {
            // store details of channels into a table
            channel_table: table::new(),
            channel_counter: 0,
        });

    
        move_to(deployer, SignerCapabilityStore{
            signer_cap
        });
    }

    public entry fun create_channel (sender: &signer, receiver_address: address, initial_amount: u64,total_tokens:u64) acquires GlobalTable, SignerCapabilityStore {
        let sender_address = signer::address_of(sender);
        let global_table_resource = borrow_global_mut<GlobalTable>(MODULE_OWNER);
        let counter = global_table_resource.channel_counter + 1;
        assert!(sender_address != receiver_address, ENO_SAME_SENDER_RECEIVER);

        // MOST IMPORTANT - take payment from sender and transfer to contract

        let signer_cap_resource = borrow_global_mut<SignerCapabilityStore>(MODULE_OWNER);
        let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap_resource.signer_cap);
        let rsrc_acc_address = signer::address_of(&rsrc_acc_signer);
        coin::transfer<AptosCoin>(sender, rsrc_acc_address, initial_amount);

        // assert!(self::channel_exists(sender_address, receiver_address) == false, "channel already exists");
        let key_value = randomness::u256_integer();

        let new_channel = Channel {
            channel_id: counter,
            sender_address: sender_address,
            receiver_address: receiver_address,
            initial_amount: initial_amount,
            total_tokens: total_tokens,
            key: key_value,
            redeemed: false,
        };

        let addr_to_key = table::new();
        table::upsert(&mut addr_to_key,sender_address,key_value);

        move_to(sender, UserKey {
            address_to_key: addr_to_key,
        });

        // self::set_channel(sender_address, receiver_address, channel);
        table::upsert(&mut global_table_resource.channel_table, counter, new_channel);
        global_table_resource.channel_counter = counter;
    }

    public entry fun redeem_channel (receiver: &signer,no_of_tokens: u64, channel_id: u64,key_pair: u256) acquires GlobalTable, SignerCapabilityStore {

        
        let global_table_resource = borrow_global_mut<GlobalTable>(MODULE_OWNER);
        let channel = table::borrow_mut(&mut global_table_resource.channel_table, channel_id);

        assert!(channel.redeemed == false, E_CHANNEL_ALREADY_REDEEMED);

        let receiver_address = signer::address_of(receiver);
        assert!(channel.receiver_address == receiver_address, E_NOT_RECEIVER);
        let total_tokens = channel.total_tokens;
        let initial_amount = channel.initial_amount;
        let key_value = channel.key;

        let signer_cap_resource = borrow_global_mut<SignerCapabilityStore>(MODULE_OWNER);
        let (rsrc_acc_signer,  _rsrc_acc_address) = get_rsrc_acc(signer_cap_resource);
 
        // let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap_resource.signer_cap);
        // let rsrc_acc_address = signer::address_of(&rsrc_acc_signer);


        // let hash = calculate_hash(final_token, channel.trust_anchor, no_of_tokens, channel_id);
        if(key_pair == key_value){
            let receiver_amount = (no_of_tokens * initial_amount)/total_tokens; 
            let sender_amount = initial_amount - receiver_amount;
            // Get resource account - get_rsrc_account(): (signer, address)
            coin::transfer<AptosCoin>(&rsrc_acc_signer, channel.receiver_address, receiver_amount);
            coin::transfer<AptosCoin>(&rsrc_acc_signer, channel.sender_address, sender_amount);

            channel.redeemed = true;
        }
        else{
            assert!(false, E_INVALID_TOKEN);
            channel.redeemed = false;
        }
    }

     fun get_rsrc_acc(signer_cap_resource: &SignerCapabilityStore): (signer, address) {
        let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap_resource.signer_cap);
        let rsrc_acc_addr = signer::address_of(&rsrc_acc_signer);

        (rsrc_acc_signer, rsrc_acc_addr)
    }

    #[view]
    public fun get_my_key(receiver: &signer, sender: address): u256 acquires UserKey{
       let receiver_address = signer::address_of(receiver);
        assert!(exists<UserKey>(sender), E_INVALID_TOKEN);
        let key_resource = borrow_global<UserKey>(sender);
        assert!(table::contains(&key_resource.address_to_key, receiver_address), ENO_SAME_SENDER_RECEIVER);
        *table::borrow(&key_resource.address_to_key, receiver_address)
    }

}