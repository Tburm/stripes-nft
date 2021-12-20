// contracts/CustoMoose.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleNFT is ERC721 {
    uint256 totalSupply;

    constructor() ERC721("Simple", "SIMPLE") {
        totalSupply = 0;

        // test mint
        mintInternal();
    }

    /**
     * @dev Mint internal, this is to avoid code duplication.
     */
    function mintInternal() internal {
        // uint256 _totalSupply = totalSupply();
        uint256 thisTokenId = totalSupply;
        _mint(msg.sender, thisTokenId);

        totalSupply += 1;
    }

    /**
     * @dev Mint internal, this is to avoid code duplication.
     */
    function mint() public {
        mintInternal();
    }
}