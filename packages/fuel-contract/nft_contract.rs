// NFT contract on Sway

// Define the NFT struct
struct NFT {
    owner: address,
    metadata: string
}

// Define the NFT contract
contract NFTContract {
    nfts: map<u64, NFT>

    // Mint a new NFT and assign it to the specified owner
    pub fn mint(owner: address, metadata: string) -> u64 {
        let new_id = self.nfts.len() as u64;
        let nft = NFT{owner, metadata};
        self.nfts[new_id] = nft;
        new_id
    }

    // Get the NFT with the specified ID
    pub fn get_nft(id: u64) -> NFT {
        assert(id < self.nfts.len(), "Invalid NFT ID");
        self.nfts[id]
    }

    // Transfer ownership of the specified NFT to a new owner
    pub fn transfer_nft(id: u64, new_owner: address) {
        assert(id < self.nfts.len(), "Invalid NFT ID");
        let nft = self.nfts[id];
        assert(nft.owner == caller(), "Only the current owner can transfer an NFT");
        nft.owner = new_owner;
        self.nfts[id] = nft;
    }
}