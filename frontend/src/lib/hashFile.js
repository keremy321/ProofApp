function bufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    
    return `0x${hex}`;
}

export async function hashFile(file) {
    if(!file) {
        throw new Error("No file selected.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

    return bufferToHex(hashBuffer);
}