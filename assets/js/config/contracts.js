// =====================================================
//  BLOCKCITY — FINAL CONTRACT CONFIGURATION
//  All deployed on Sepolia
// =====================================================

const CONTRACTS = {

  // =================================================
  // 🏛 ROOM 1 — CityLaw
  // 
  // =================================================
  base: {
    address: "0xe2aDB295f01bA8009bC47e7988F91D935ac7341b",
    abi: [
      "function cityName() view returns (string)",
      "function owner() view returns (address)",
      "function lawCount() view returns (uint256)",
      "function addLaw(string memory _law) public",
      "function setCityName(string memory _name) public",
      "function getLaw(uint256 index) view returns (string)",
      "event LawAdded(string lawText, address addedBy)"
    ]
  },

  // =================================================
  // 💰 ROOM 2 — RewardToken (ERC20)
  // 
  // =================================================
  token: {
    address: "0x754F8874a18Ae59204054a64c7b7f8F865025CfB",
    abi: [
      "function mint(address to, uint256 amount) public",
      "function balanceOf(address account) view returns (uint256)",
      "function totalSupply() view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function owner() view returns (address)",
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ]
  },

  // =================================================
  // 🎓 ROOM 3 — WorkshopCertificateNFT (ERC721)
  //
  // =================================================
  badge: {
    address: "0x25d2990DB95bf55842BDaeF518C22b93EfA0947A",
    abi: [
      "function mintCertificate(address recipient,string memory studentName,string memory courseName,string memory issueDate,string memory metadataURI) public returns (uint256)",
      "function totalCertificates() view returns (uint256)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function getCertificate(uint256 tokenId) view returns (string,string,string)",
      "event CertificateMinted(uint256 tokenId,address recipient,string studentName,string courseName)"
    ]
  },

  // =================================================
  // 🗳 ROOM 4 — BlockCityVoting
  // 
  // =================================================
  voting: {
    address: "0x8B490286f95ffFBED0Eb66a52b6dA508cECD07CC",
    abi: [
      "function createProposal(string memory _title, uint256 _mins) public returns (uint256)",
      "function vote(uint256 _id, bool _support) public",
      "function execute(uint256 _id) public",
      "function getResults(uint256 _id) view returns (uint256 yes, uint256 no, bool passed)",
      "function proposalCount() view returns (uint256)",
      "function hasVoted(uint256, address) view returns (bool)"
    ]
  }

};

export default CONTRACTS;