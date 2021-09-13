// Takes a long hash string and truncates it.
function truncateHash(hash, length = 38) {
    return hash.replace(hash.substring(6, length), "...");
}

export default truncateHash;