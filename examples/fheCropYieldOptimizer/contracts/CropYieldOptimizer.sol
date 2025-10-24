// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title CropYieldOptimizer v2.0
 * @notice Migrated to support new Gateway contract specifications
 * @dev Changes:
 * - Added NUM_PAUSERS and PAUSER_ADDRESS_[0-N] support
 * - Renamed kmsManagement to kmsGeneration
 * - Replaced check...() functions with is...() boolean returns
 * - Added new Decryption events with individual KMS responses
 * - Implemented transaction input re-randomization support
 */
contract CropYieldOptimizer is SepoliaConfig {

    address public owner;
    uint256 public totalFarms;
    uint256 public currentAnalysisId;

    // Gateway and KMS Configuration (NEW)
    uint256 public kmsGeneration; // Renamed from kmsManagement
    address[] public pauserAddresses;
    bool public isPaused;
    mapping(address => bool) public isPauserAddress;
    uint256 public decryptionRequestCounter;

    struct FarmData {
        address farmAddress;
        euint32 encryptedSoilQuality;      // 加密的土壤质量数据
        euint32 encryptedWaterUsage;       // 加密的用水量数据
        euint32 encryptedFertilizerUsage;  // 加密的化肥使用量
        euint32 encryptedYieldAmount;      // 加密的实际产量
        euint8 encryptedCropType;          // 加密的作物类型
        bool dataSubmitted;
        uint256 timestamp;
    }

    struct OptimizationResult {
        uint256 analysisId;
        euint32 recommendedSoilTreatment;
        euint32 recommendedWaterAmount;
        euint32 recommendedFertilizerAmount;
        euint32 predictedYieldIncrease;
        bool isActive;
        uint256 participatingFarms;
        uint256 createdAt;
    }

    // Decryption Request Struct (NEW)
    struct DecryptionRequest {
        uint256 requestId;
        address requester;
        bytes32 encryptedValue;
        uint256 timestamp;
        bool fulfilled;
        uint256 kmsGeneration;
    }

    mapping(address => FarmData) public farmDataRegistry;
    mapping(uint256 => OptimizationResult) public analysisResults;
    mapping(address => bool) public registeredFarms;
    mapping(address => uint256[]) public farmAnalysisHistory;
    mapping(uint256 => DecryptionRequest) public decryptionRequests; // NEW

    address[] public activeFarms;

    // Original Events
    event FarmRegistered(address indexed farm, uint256 timestamp);
    event DataSubmitted(address indexed farm, uint256 timestamp);
    event AnalysisStarted(uint256 indexed analysisId, uint256 participatingFarms);
    event OptimizationComplete(uint256 indexed analysisId, address indexed farm);
    event RecommendationGenerated(uint256 indexed analysisId);

    // NEW Gateway Events - Individual KMS responses instead of aggregated
    event DecryptionRequested(
        uint256 indexed requestId,
        address indexed requester,
        uint256 kmsGeneration,
        bytes32 encryptedValue,
        uint256 timestamp
    );

    event DecryptionResponse(
        uint256 indexed requestId,
        address indexed kmsNode,
        bytes encryptedShare,
        bytes signature,
        uint256 timestamp
    );

    event PauserAdded(address indexed pauser, uint256 timestamp);
    event PauserRemoved(address indexed pauser, uint256 timestamp);
    event ContractPaused(address indexed by, uint256 timestamp);
    event ContractUnpaused(address indexed by, uint256 timestamp);
    event KmsGenerationUpdated(uint256 oldGeneration, uint256 newGeneration);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyRegisteredFarm() {
        require(registeredFarms[msg.sender], "Farm not registered");
        _;
    }

    modifier onlyPauser() {
        require(isPauserAddress[msg.sender], "Not a pauser");
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    constructor(address[] memory _pauserAddresses, uint256 _kmsGeneration) {
        owner = msg.sender;
        currentAnalysisId = 1;
        totalFarms = 0;
        kmsGeneration = _kmsGeneration;
        isPaused = false;
        decryptionRequestCounter = 0;

        // Initialize pauser addresses
        for (uint256 i = 0; i < _pauserAddresses.length; i++) {
            pauserAddresses.push(_pauserAddresses[i]);
            isPauserAddress[_pauserAddresses[i]] = true;
            emit PauserAdded(_pauserAddresses[i], block.timestamp);
        }
    }

    // ==================== NEW GATEWAY FUNCTIONS ====================

    /**
     * @notice Add a new pauser address (only owner)
     * @param _pauser The address to add as pauser
     */
    function addPauser(address _pauser) external onlyOwner {
        require(_pauser != address(0), "Invalid pauser address");
        require(!isPauserAddress[_pauser], "Already a pauser");

        pauserAddresses.push(_pauser);
        isPauserAddress[_pauser] = true;
        emit PauserAdded(_pauser, block.timestamp);
    }

    /**
     * @notice Remove a pauser address (only owner)
     * @param _pauser The address to remove
     */
    function removePauser(address _pauser) external onlyOwner {
        require(isPauserAddress[_pauser], "Not a pauser");

        isPauserAddress[_pauser] = false;

        // Remove from array
        for (uint256 i = 0; i < pauserAddresses.length; i++) {
            if (pauserAddresses[i] == _pauser) {
                pauserAddresses[i] = pauserAddresses[pauserAddresses.length - 1];
                pauserAddresses.pop();
                break;
            }
        }

        emit PauserRemoved(_pauser, block.timestamp);
    }

    /**
     * @notice Pause the contract (only pausers)
     */
    function pause() external onlyPauser {
        require(!isPaused, "Already paused");
        isPaused = true;
        emit ContractPaused(msg.sender, block.timestamp);
    }

    /**
     * @notice Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        require(isPaused, "Not paused");
        isPaused = false;
        emit ContractUnpaused(msg.sender, block.timestamp);
    }

    /**
     * @notice Update KMS generation number
     * @param _newGeneration New KMS generation
     */
    function updateKmsGeneration(uint256 _newGeneration) external onlyOwner {
        uint256 oldGeneration = kmsGeneration;
        kmsGeneration = _newGeneration;
        emit KmsGenerationUpdated(oldGeneration, _newGeneration);
    }

    /**
     * @notice Request decryption from KMS
     * @param _encryptedValue The encrypted value to decrypt
     * @return requestId The ID of the decryption request
     */
    function requestDecryption(bytes32 _encryptedValue) external onlyRegisteredFarm returns (uint256) {
        uint256 requestId = ++decryptionRequestCounter;

        decryptionRequests[requestId] = DecryptionRequest({
            requestId: requestId,
            requester: msg.sender,
            encryptedValue: _encryptedValue,
            timestamp: block.timestamp,
            fulfilled: false,
            kmsGeneration: kmsGeneration
        });

        emit DecryptionRequested(
            requestId,
            msg.sender,
            kmsGeneration,
            _encryptedValue,
            block.timestamp
        );

        return requestId;
    }

    /**
     * @notice Submit decryption response from KMS node
     * @dev Each KMS node submits its own response separately (not aggregated on-chain)
     */
    function submitDecryptionResponse(
        uint256 _requestId,
        bytes calldata _encryptedShare,
        bytes calldata _signature
    ) external {
        require(decryptionRequests[_requestId].requestId == _requestId, "Invalid request");

        emit DecryptionResponse(
            _requestId,
            msg.sender,
            _encryptedShare,
            _signature,
            block.timestamp
        );
    }

    // ==================== REPLACED check...() WITH is...() ====================

    /**
     * @notice Check if public decryption is allowed (REPLACED checkPublicDecryptAllowed)
     * @return bool True if allowed, false otherwise (no revert)
     */
    function isPublicDecryptAllowed() external view returns (bool) {
        return !isPaused;
    }

    /**
     * @notice Check if address is a valid pauser (NEW)
     * @return bool True if address is pauser
     */
    function isPauser(address _address) external view returns (bool) {
        return isPauserAddress[_address];
    }

    /**
     * @notice Check if contract is currently paused (NEW)
     * @return bool True if paused
     */
    function isContractPaused() external view returns (bool) {
        return isPaused;
    }

    /**
     * @notice Check if analysis is valid (REPLACED checkAnalysisValid)
     * @return bool True if valid
     */
    function isAnalysisValid(uint256 _analysisId) external view returns (bool) {
        return analysisResults[_analysisId].isActive;
    }

    // ==================== ORIGINAL FUNCTIONS (with whenNotPaused) ====================

    /**
     * @notice Register a new farm
     */
    function registerFarm() external whenNotPaused {
        require(!registeredFarms[msg.sender], "Farm already registered");

        registeredFarms[msg.sender] = true;
        activeFarms.push(msg.sender);
        totalFarms++;

        emit FarmRegistered(msg.sender, block.timestamp);
    }

    /**
     * @notice Submit encrypted farm data
     * @dev All transaction inputs are re-randomized before FHE evaluation (automatic)
     */
    function submitFarmData(
        uint32 _soilQuality,
        uint32 _waterUsage,
        uint32 _fertilizerUsage,
        uint32 _yieldAmount,
        uint8 _cropType
    ) external onlyRegisteredFarm whenNotPaused {
        require(_cropType > 0 && _cropType <= 10, "Invalid crop type");
        require(_soilQuality > 0 && _waterUsage > 0, "Invalid input data");

        // 加密所有农业数据 (inputs are re-randomized automatically for sIND-CPAD security)
        euint32 encSoilQuality = FHE.asEuint32(_soilQuality);
        euint32 encWaterUsage = FHE.asEuint32(_waterUsage);
        euint32 encFertilizerUsage = FHE.asEuint32(_fertilizerUsage);
        euint32 encYieldAmount = FHE.asEuint32(_yieldAmount);
        euint8 encCropType = FHE.asEuint8(_cropType);

        farmDataRegistry[msg.sender] = FarmData({
            farmAddress: msg.sender,
            encryptedSoilQuality: encSoilQuality,
            encryptedWaterUsage: encWaterUsage,
            encryptedFertilizerUsage: encFertilizerUsage,
            encryptedYieldAmount: encYieldAmount,
            encryptedCropType: encCropType,
            dataSubmitted: true,
            timestamp: block.timestamp
        });

        // 设置FHE访问权限
        FHE.allowThis(encSoilQuality);
        FHE.allowThis(encWaterUsage);
        FHE.allowThis(encFertilizerUsage);
        FHE.allowThis(encYieldAmount);
        FHE.allowThis(encCropType);

        // 只允许农场主访问自己的数据
        FHE.allow(encSoilQuality, msg.sender);
        FHE.allow(encWaterUsage, msg.sender);
        FHE.allow(encFertilizerUsage, msg.sender);
        FHE.allow(encYieldAmount, msg.sender);
        FHE.allow(encCropType, msg.sender);

        emit DataSubmitted(msg.sender, block.timestamp);
    }

    /**
     * @notice Start collaborative analysis across multiple farms
     */
    function startCollaborativeAnalysis() external whenNotPaused returns (uint256) {
        require(getParticipatingFarmsCount() >= 3, "Need at least 3 farms for analysis");

        uint256 analysisId = currentAnalysisId;
        uint256 participatingFarms = getParticipatingFarmsCount();

        analysisResults[analysisId] = OptimizationResult({
            analysisId: analysisId,
            recommendedSoilTreatment: FHE.asEuint32(0),
            recommendedWaterAmount: FHE.asEuint32(0),
            recommendedFertilizerAmount: FHE.asEuint32(0),
            predictedYieldIncrease: FHE.asEuint32(0),
            isActive: true,
            participatingFarms: participatingFarms,
            createdAt: block.timestamp
        });

        currentAnalysisId++;

        emit AnalysisStarted(analysisId, participatingFarms);

        _performEncryptedAnalysis(analysisId);

        return analysisId;
    }

    /**
     * @notice Perform encrypted agricultural data analysis
     * @dev Uses FHE operations for privacy-preserving computation
     */
    function _performEncryptedAnalysis(uint256 _analysisId) private {
        euint32 totalSoilQuality = FHE.asEuint32(0);
        euint32 totalWaterUsage = FHE.asEuint32(0);
        euint32 totalFertilizerUsage = FHE.asEuint32(0);
        euint32 totalYield = FHE.asEuint32(0);
        uint256 validFarms = 0;

        for (uint i = 0; i < activeFarms.length; i++) {
            address farm = activeFarms[i];
            FarmData storage data = farmDataRegistry[farm];

            if (data.dataSubmitted) {
                totalSoilQuality = FHE.add(totalSoilQuality, data.encryptedSoilQuality);
                totalWaterUsage = FHE.add(totalWaterUsage, data.encryptedWaterUsage);
                totalFertilizerUsage = FHE.add(totalFertilizerUsage, data.encryptedFertilizerUsage);
                totalYield = FHE.add(totalYield, data.encryptedYieldAmount);
                validFarms++;
            }
        }

        if (validFarms > 0) {
            euint32 weightedSoil = FHE.mul(totalSoilQuality, FHE.asEuint32(110));
            euint32 weightedWater = FHE.mul(totalWaterUsage, FHE.asEuint32(95));
            euint32 weightedFertilizer = FHE.mul(totalFertilizerUsage, FHE.asEuint32(105));
            euint32 predictedIncrease = FHE.mul(totalYield, FHE.asEuint32(115));

            OptimizationResult storage result = analysisResults[_analysisId];
            result.recommendedSoilTreatment = FHE.mul(weightedSoil, FHE.asEuint32(1));
            result.recommendedWaterAmount = FHE.mul(weightedWater, FHE.asEuint32(1));
            result.recommendedFertilizerAmount = FHE.mul(weightedFertilizer, FHE.asEuint32(1));
            result.predictedYieldIncrease = FHE.mul(predictedIncrease, FHE.asEuint32(1));

            FHE.allowThis(result.recommendedSoilTreatment);
            FHE.allowThis(result.recommendedWaterAmount);
            FHE.allowThis(result.recommendedFertilizerAmount);
            FHE.allowThis(result.predictedYieldIncrease);

            emit RecommendationGenerated(_analysisId);
        }
    }

    /**
     * @notice Get personalized recommendations for a farm
     */
    function getPersonalizedRecommendations(uint256 _analysisId) external view onlyRegisteredFarm returns (
        bytes32 soilTreatment,
        bytes32 waterAmount,
        bytes32 fertilizerAmount,
        bytes32 yieldIncrease
    ) {
        OptimizationResult storage result = analysisResults[_analysisId];
        require(result.isActive, "Analysis not found or inactive");
        require(farmDataRegistry[msg.sender].dataSubmitted, "Must have submitted data");

        return (
            FHE.toBytes32(result.recommendedSoilTreatment),
            FHE.toBytes32(result.recommendedWaterAmount),
            FHE.toBytes32(result.recommendedFertilizerAmount),
            FHE.toBytes32(result.predictedYieldIncrease)
        );
    }

    // ==================== VIEW FUNCTIONS ====================

    function getParticipatingFarmsCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint i = 0; i < activeFarms.length; i++) {
            if (farmDataRegistry[activeFarms[i]].dataSubmitted) {
                count++;
            }
        }
        return count;
    }

    function getAnalysisInfo(uint256 _analysisId) external view returns (
        bool isActive,
        uint256 participatingFarms,
        uint256 createdAt
    ) {
        OptimizationResult storage result = analysisResults[_analysisId];
        return (
            result.isActive,
            result.participatingFarms,
            result.createdAt
        );
    }

    function isFarmRegistered(address _farm) external view returns (bool) {
        return registeredFarms[_farm];
    }

    function getFarmDataStatus(address _farm) external view returns (bool submitted, uint256 timestamp) {
        FarmData storage data = farmDataRegistry[_farm];
        return (data.dataSubmitted, data.timestamp);
    }

    function getPlatformStats() external view returns (
        uint256 totalRegisteredFarms,
        uint256 totalAnalyses,
        uint256 farmsWithData
    ) {
        return (
            totalFarms,
            currentAnalysisId - 1,
            getParticipatingFarmsCount()
        );
    }

    function getPauserCount() external view returns (uint256) {
        return pauserAddresses.length;
    }

    function getPauserAtIndex(uint256 _index) external view returns (address) {
        require(_index < pauserAddresses.length, "Index out of bounds");
        return pauserAddresses[_index];
    }

    // ==================== ADMIN FUNCTIONS ====================

    function resetAnalysis(uint256 _analysisId) external onlyOwner {
        analysisResults[_analysisId].isActive = false;
    }

    function emergencyPause() external onlyPauser {
        isPaused = true;
        for (uint256 i = 1; i < currentAnalysisId; i++) {
            analysisResults[i].isActive = false;
        }
        emit ContractPaused(msg.sender, block.timestamp);
    }
}
