const CONTRACTS = {

  base: {
    address: "0xYOUR_ROOM1_ADDRESS_HERE",
    abi: [
      "function cityName() view returns (string)",
      "function owner() view returns (address)",
      "function getCityName() view returns (string)",
      "function setCity(string memory _name) public",
      "function platformName() view returns (string)",
      "event ActionPerformed(string action, address by)"
    ]
  },

  token: {
    address: "0xYOUR_ROOM2_ADDRESS_HERE",
    abi: [
      "function mint(address to, uint256 amount) public",
      "function rewardUser(address user, uint256 amount) public",
      "function readableBalance(address account) view returns (uint256)",
      "function balanceOf(address account) view returns (uint256)",
      "function totalSupply() view returns (uint256)",
      "function transfer(address to, uint256 amount) public returns (bool)"
    ]
  },

  badge: {
    address: "0xYOUR_ROOM3_ADDRESS_HERE",
    abi: [
      "function mintBadge(address to, string memory uri) public returns (uint256)",
      "function tokenCounter() view returns (uint256)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "event BadgeMinted(address to, uint256 tokenId)"
    ]
  },

  voting: {
    address: "0xYOUR_ROOM4_ADDRESS_HERE",
    abi: [
      "function createProposal(string memory title, uint256 durationMinutes) public returns (uint256)",
      "function vote(uint256 id, bool support) public",
      "function getResults(uint256 id) view returns (uint256 yes, uint256 no, bool passed)",
      "function execute(uint256 id) public",
      "function proposalCount() view returns (uint256)",
      "function hasVoted(uint256 id, address voter) view returns (bool)",
      "event ProposalCreated(uint256 id, string title)",
      "event VoteCast(uint256 id, address voter, bool support)"
    ]
  }
};

export default CONTRACTS;