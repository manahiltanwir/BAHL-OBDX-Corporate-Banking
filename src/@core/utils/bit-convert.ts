
// Define the conversion factors
const BIT_TO_KB = 0.0009765625;
const BIT_TO_MB = 0.0000009536743164;
const BIT_TO_GB = 0.0000000009313225746;

// Define a function to convert bit data to the appropriate unit
export function convertBitData(bitData: number) {
    let result;

    if (bitData < 1024) {
        result = bitData + ' bit';
    } else if (bitData < 1048576) {
        result = (bitData * BIT_TO_KB).toFixed(2) + ' KB';
    } else if (bitData < 1073741824) {
        result = (bitData * BIT_TO_MB).toFixed(2) + ' MB';
    } else {
        result = (bitData * BIT_TO_GB).toFixed(2) + ' GB';
    }

    return result;
}

// Example usage
// console.log(convertBitData(500)); // Output: 500 bit
// console.log(convertBitData(5000)); // Output: 4.88 KB
// console.log(convertBitData(5000000)); // Output: 4.77 MB
// console.log(convertBitData(5000000000)); // Output: 4.66 GB


// Define the conversion factors
const MB_TO_BIT = 8000000;

// Define a function to generate a random number of bits between 10 MB and 50 MB
export function generateRandomBitData() {
    const min = 10;
    const max = 50;

    // Generate a random number between min and max (inclusive) in megabytes
    const randomMB = Math.floor(Math.random() * (max - min + 1) + min);

    // Convert the random number to bits
    const randomBits = randomMB * MB_TO_BIT;

    return randomBits;
}

// Example usage
// console.log(generateRandomBitData()); // Output: a random number of bits between 10 MB and 50 MB
