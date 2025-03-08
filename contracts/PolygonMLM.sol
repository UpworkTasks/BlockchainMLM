// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title PolygonMLM
 * @dev MLM system on Polygon blockchain with 8 levels
 */
contract PolygonMLM {
    // Constants
    uint256 private constant LEVEL1_PRICE = 200 ether;  // 200 POL (using ether as denomination unit)
    uint256 private constant LEVEL2_PRICE = 600 ether;  // 600 POL
    uint256 private constant LEVEL3_PRICE = 1800 ether;  // 1800 POL
    uint256 private constant LEVEL4_PRICE = 5400 ether; // 5400 POL
    uint256 private constant LEVEL5_PRICE = 16200 ether; // 16200 POL
    uint256 private constant LEVEL6_PRICE = 48600 ether; // 48600 POL
    uint256 private constant LEVEL7_PRICE = 145800 ether; // 145800 POL
    uint256 private constant LEVEL8_PRICE = 437400 ether; // 437400 POL
    
    uint256 private constant MAX_DIRECT_REFERRALS = 3;
    uint256 private constant MAX_LEVELS = 8;
    
    // Owner address
    address public owner;
    
    // Track earnings by level
    struct LevelEarnings {
        uint256 totalEarned;
        uint256 referralCount;
    }
    
    // User structure to store user data
    struct User {
        bool registered;
        address upline;
        uint8 currentLevel;
        address[] directReferrals;
        mapping(uint8 => bool) activeLevel;
        mapping(uint8 => LevelEarnings) levelEarnings;
        uint256 totalEarnings;
        uint256 timestamp;
    }
    
    // Mapping from user address to User struct
    mapping(address => User) public users;
    
    // Array of all registered users
    address[] public allUsers;
    
    // Events
    event Registration(address indexed user, address indexed referrer, uint256 timestamp);
    event LevelPurchased(address indexed user, uint8 level, uint256 price, uint256 timestamp);
    event ReferralAdded(address indexed referrer, address indexed referral, uint256 timestamp);
    event PaymentReceived(address indexed receiver, address indexed payer, uint8 level, uint256 amount, uint256 timestamp);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyRegistered() {
        require(users[msg.sender].registered, "User not registered");
        _;
    }
    
    // Constructor
    /**
     * @dev Contract constructor - sets the deployer as the owner and first participant
     * Note: The owner does not need to pay any fee to participate in the system
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Register a new user with a referrer (upline)
     * @param _upline The address of the referrer
     * If _upline is address(0) or not registered, the system will assign one
     * The first participants will be placed under the owner if no valid upline is provided
     */
    function register(address _upline) external payable {
        require(!users[msg.sender].registered, "User already registered");
        require(msg.value == LEVEL1_PRICE, "Registration requires exactly 200 POL");
        
        // If upline is not provided or not registered, assign to owner
        if(_upline == address(0) || !users[_upline].registered) {
            _upline = findSystemUpline();
        }
        
        // Initialize user
        User storage user = users[msg.sender];
        user.registered = true;
        user.upline = _upline;
        user.currentLevel = 1;
        user.activeLevel[1] = true;
        user.timestamp = block.timestamp;
        
        // Add to all users array
        allUsers.push(msg.sender);
        
        // Transfer registration fee to upline
        payable(_upline).transfer(LEVEL1_PRICE);
        
        // Add referral to upline's direct referrals
        if (users[_upline].directReferrals.length < MAX_DIRECT_REFERRALS) {
            users[_upline].directReferrals.push(msg.sender);
        } else {
            // Overflow logic - find the next available place in the structure
            address currentUpline = _upline;
            bool placed = false;
            
            while (!placed) {
                for (uint i = 0; i < users[currentUpline].directReferrals.length; i++) {
                    address downline = users[currentUpline].directReferrals[i];
                    if (users[downline].directReferrals.length < MAX_DIRECT_REFERRALS) {
                        users[downline].directReferrals.push(msg.sender);
                        emit ReferralAdded(downline, msg.sender, block.timestamp);
                        placed = true;
                        break;
                    }
                }
                
                // If not placed yet, move to the next level
                if (!placed) {
                    // Reset to owner if no placement found
                    if (users[currentUpline].directReferrals.length == 0) {
                        users[owner].directReferrals.push(msg.sender);
                        emit ReferralAdded(owner, msg.sender, block.timestamp);
                        placed = true;
                    } else {
                        currentUpline = users[currentUpline].directReferrals[0];
                    }
                }
            }
        }
        
        // Update upline's earnings for level 1
        User storage uplineUser = users[_upline];
        uplineUser.totalEarnings += LEVEL1_PRICE;
        uplineUser.levelEarnings[1].totalEarned += LEVEL1_PRICE;
        uplineUser.levelEarnings[1].referralCount++;
        
        emit Registration(msg.sender, _upline, block.timestamp);
        emit PaymentReceived(_upline, msg.sender, 1, LEVEL1_PRICE, block.timestamp);
    }
    
    // Buy the next level
    function buyLevel(uint8 _level) external payable onlyRegistered {
        require(_level > 1 && _level <= MAX_LEVELS, "Invalid level");
        require(_level == users[msg.sender].currentLevel + 1, "Can only buy next level");
        require(!users[msg.sender].activeLevel[_level], "Level already purchased");
        
        uint256 levelPrice = getLevelPrice(_level);
        require(msg.value == levelPrice, "Incorrect payment amount");
        
        // Find the appropriate upline for this level
        address uplineForLevel = findUplineForLevel(msg.sender, _level);
        
        // Make payment to upline
        payable(uplineForLevel).transfer(levelPrice);
        
        // Update user data
        User storage user = users[msg.sender];
        user.currentLevel = _level;
        user.activeLevel[_level] = true;
        
        // Update upline's earnings for this level
        User storage uplineUser = users[uplineForLevel];
        uplineUser.totalEarnings += levelPrice;
        uplineUser.levelEarnings[_level].totalEarned += levelPrice;
        uplineUser.levelEarnings[_level].referralCount++;
        
        emit LevelPurchased(msg.sender, _level, levelPrice, block.timestamp);
        emit PaymentReceived(uplineForLevel, msg.sender, _level, levelPrice, block.timestamp);
    }
    
    // Find system-assigned upline for new registrations
    function findSystemUpline() internal view returns (address) {
        // If no users registered, return owner
        if (allUsers.length == 0) return owner;
        
        // Find user with fewest referrals
        address selectedUpline = owner;
        uint256 fewestReferrals = type(uint256).max;
        
        for (uint i = 0; i < allUsers.length; i++) {
            address userAddress = allUsers[i];
            uint256 referralCount = users[userAddress].directReferrals.length;
            
            if (referralCount < fewestReferrals && referralCount < MAX_DIRECT_REFERRALS) {
                fewestReferrals = referralCount;
                selectedUpline = userAddress;
            }
        }
        
        return selectedUpline;
    }
    
    // Find the appropriate upline for a specific level
    function findUplineForLevel(address _user, uint8 _level) internal view returns (address) {
        address current = users[_user].upline;
        uint8 targetLevel = _level;
        
        // Go up the levels until we find an upline with the required level
        for (uint8 i = 1; i < targetLevel; i++) {
            if (current == address(0)) {
                return owner; // If no suitable upline found, pay to owner
            }
            current = users[current].upline;
        }
        
        // If upline doesn't have the required level, find next eligible upline
        if (!users[current].activeLevel[targetLevel]) {
            return findUplineForLevel(current, targetLevel);
        }
        
        return current;
    }
    
    // Get the price for a specific level
    function getLevelPrice(uint8 _level) public pure returns (uint256) {
        if (_level == 1) return LEVEL1_PRICE;
        if (_level == 2) return LEVEL2_PRICE;
        if (_level == 3) return LEVEL3_PRICE;
        if (_level == 4) return LEVEL4_PRICE;
        if (_level == 5) return LEVEL5_PRICE;
        if (_level == 6) return LEVEL6_PRICE;
        if (_level == 7) return LEVEL7_PRICE;
        if (_level == 8) return LEVEL8_PRICE;
        return 0;
    }
    
    // Get user level earnings
    function getUserLevelEarnings(address _user, uint8 _level) external view returns (
        uint256 earningsForLevel,
        uint256 referralCountForLevel
    ) {
        require(_level > 0 && _level <= MAX_LEVELS, "Invalid level");
        return (
            users[_user].levelEarnings[_level].totalEarned,
            users[_user].levelEarnings[_level].referralCount
        );
    }
    
    // Get user details
    function getUserDetails(address _user) external view returns (
        bool registered,
        address upline,
        uint8 currentLevel,
        uint256 directReferralsCount,
        uint256 totalEarnings,
        uint256 registrationTime
    ) {
        User storage user = users[_user];
        return (
            user.registered,
            user.upline,
            user.currentLevel,
            user.directReferrals.length,
            user.totalEarnings,
            user.timestamp
        );
    }
    
    // Get direct referrals of a user
    function getDirectReferrals(address _user) external view returns (address[] memory) {
        return users[_user].directReferrals;
    }
    
    // Check if a specific level is active for a user
    function isLevelActive(address _user, uint8 _level) external view returns (bool) {
        return users[_user].activeLevel[_level];
    }
    
    // Count total registered users
    function getTotalUsers() external view returns (uint256) {
        return allUsers.length;
    }
    
    // Emergency functions
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    // Update owner
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
    
    /**
     * @dev Returns the address of the contract owner
     * @return The owner's address
     * The owner is the first participant in the pyramid and receives referrals
     * when no valid upline is available
     */
    function getOwner() external view returns (address) {
        return owner;
    }
    
    // Receive function to accept payments
    receive() external payable {
        // Simply accept the payment, it will be handled by other functions
    }
}
