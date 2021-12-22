// contracts/StripesNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Library.sol";
import "./BytesLib.sol";

contract StripesNFT is ERC721Enumerable, Ownable {
    using Library for uint8;
    using BytesLib for bytes;
    using BytesLib for bytes1;
    using SafeMath for uint256;

    // addresses
    address _owner;

    // integers
    uint256 SEED_NONCE = 0;

    //Mappings
    mapping(uint256 => bytes) internal tokenIdToConfig;

    constructor() ERC721("Stripes", "STRIPES") {
        _owner = msg.sender;
    }

    /*
  __  __ _     _   _             ___             _   _             
 |  \/  (_)_ _| |_(_)_ _  __ _  | __|  _ _ _  __| |_(_)___ _ _  ___
 | |\/| | | ' \  _| | ' \/ _` | | _| || | ' \/ _|  _| / _ \ ' \(_-<
 |_|  |_|_|_||_\__|_|_||_\__, | |_| \_,_|_||_\__|\__|_\___/_||_/__/
                         |___/                                     
   */

    /**
     * @dev Generate a pseudorandom byte
     * @param _t The token id to be used for randomness
     * @param _a The address to be used for randomness
     * @param _c The custom nonce to be used within the hash.
     * @param _range The range of the number to generate
     */
    function randomGen(
        uint256 _t,
        address _a,
        uint256 _c,
        uint8 _range
    ) internal view returns (uint8)
    {
        uint8 _randomVal = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        _t,
                        _a,
                        _c
                    )
                )
            ) % _range
        );
        return _randomVal;
    }

    /**
     * @dev Generates a random config for this image
     * @param _t The token id to be used within the hash.
     * @param _a The address to be used within the hash.
     */
    function config(
        uint256 _t,
        address _a
    ) internal returns (bytes memory) {
        bytes memory completeConfig;
        uint256 _c = SEED_NONCE;
        for(uint256 i = 0; i < 10; i++) {
            // get the width
            uint8 _width = randomGen(_t, _a, _c+i, 32);

            // get the height
            uint8 _height = randomGen(_t, _a, _c+i*2, 32);

            // get the colors
            uint8 _colorR = randomGen(_t, _a, _c+i*3, 255);
            uint8 _colorG = randomGen(_t, _a, _c+i*4, 255);
            uint8 _colorB = randomGen(_t, _a, _c+i*5, 255);

            // get the speed
            uint8 _speed = randomGen(_t, _a, _c+i*6, 10);

            completeConfig = abi.encodePacked(
                completeConfig,
                _width,
                _height,
                _colorR,
                _colorG,
                _colorB,
                _speed
            );
        }
        SEED_NONCE += 6*6;
        return completeConfig;
    }

    /**
     * @dev Mint internal, this is to avoid code duplication.
     */
    function mintInternal() internal {
        uint256 thisTokenId = totalSupply();

        tokenIdToConfig[thisTokenId] = config(thisTokenId, msg.sender);
        _safeMint(msg.sender, thisTokenId);
    }

    /**
     * @dev Mint internal, this is to avoid code duplication.
     */
    function mint() public {
        mintInternal();
    }

    function toByte(uint8 _num) public pure returns (bytes1 _ret) {
        assembly {
            mstore8(0x20, _num)
            _ret := mload(0x20)
        }
    }

//     /*
//  ____     ___   ____  ___        _____  __ __  ____     __ ______  ____  ___   ____   _____
// |    \   /  _] /    ||   \      |     ||  |  ||    \   /  ]      ||    |/   \ |    \ / ___/
// |  D  ) /  [_ |  o  ||    \     |   __||  |  ||  _  | /  /|      | |  ||     ||  _  (   \_ 
// |    / |    _]|     ||  D  |    |  |_  |  |  ||  |  |/  / |_|  |_| |  ||  O  ||  |  |\__  |
// |    \ |   [_ |  _  ||     |    |   _] |  :  ||  |  /   \_  |  |   |  ||     ||  |  |/  \ |
// |  .  \|     ||  |  ||     |    |  |   |     ||  |  \     | |  |   |  ||     ||  |  |\    |
// |__|\_||_____||__|__||_____|    |__|    \__,_||__|__|\____| |__|  |____|\___/ |__|__| \___|
                                                                                           
// */

    /**
     * @dev Config to SVG function
     */
    function configToSVG(bytes memory _config)
        public
        pure
        returns (string memory)
    {
        string memory svgString;

        for (uint8 i = 0; i < 10; i++) {
            bytes memory stripeConfig = _config.slice(i*6, 6);

            string memory width = stripeConfig.slice(0, 1).toUint8(0).toString();
            string memory y = stripeConfig.slice(1, 1).toUint8(0).toString();
            string memory colorR = stripeConfig.slice(2, 1).toUint8(0).toString();
            string memory colorG = stripeConfig.slice(3, 1).toUint8(0).toString();
            string memory colorB = stripeConfig.slice(4, 1).toUint8(0).toString();
            string memory speed = stripeConfig.slice(5, 1).toUint8(0).toString();

            svgString = string(
                abi.encodePacked(
                    svgString,
                    "<rect class='stripe_",
                    i.toString(),
                    "' x='",
                    "1",
                    "' y='",
                    y,
                    "' width='",
                    width,
                    "px' height='1px'",
                    " style='fill: rgb(",
                    colorR,",",colorG,",",colorB,
                    ")'>"
                )
            );
            svgString = string(
                abi.encodePacked(
                    svgString,
                    "<animate attributeName='x' from='-32' to='32' dur='",
                    speed,
                    "s' repeatCount='indefinite' />"
                    "</rect>"
                )
            );
        }

        svgString = string(
            abi.encodePacked(
                '<svg id="svg-frame" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 32 32">',
                svgString,
                "<style>#svg-frame{shape-rendering: crispedges;}",
                "</style></svg>"
            )
        );

        return svgString;
    }

    /**
     * @dev Returns the SVG and metadata for a token Id
     * @param _tokenId The tokenId to return the SVG and metadata for.
     */
    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(_tokenId));

        bytes memory tokenConfig = _tokenIdToConfig(_tokenId);

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Library.encode(
                        bytes(
                            string(
                                abi.encodePacked(
                                    '{"name": "STRIPES Token #',
                                    Library.toString(_tokenId),
                                    '", "description": "STRIPES is a generative on-chain art project. Each image contains 10 randomly generated animated stripes. The SVG is created by a contract function, with all storage on the blockchain. No IPFS, no API.", "image": "data:image/svg+xml;base64,',
                                    Library.encode(
                                        bytes(configToSVG(tokenConfig))
                                    ),
                                    '","attributes":',
                                    '""',
                                    "}"
                                )
                            )
                        )
                    )
                )
            );
    }

    /**
     * @dev Returns a config for a given tokenId
     * @param _tokenId The tokenId to return the config for.
     */
    function _tokenIdToConfig(uint256 _tokenId)
        public
        view
        returns (bytes memory)
    {
        bytes memory tokenConfig = tokenIdToConfig[_tokenId];
        return tokenConfig;
    }

    /**
     * @dev Returns the wallet of a given wallet. Mainly for ease for frontend devs.
     * @param _wallet The wallet to get the tokens of.
     */
    function walletOfOwner(address _wallet)
        public
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_wallet);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_wallet, i);
        }
        return tokensId;
    }
}