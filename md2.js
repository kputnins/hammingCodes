const exampleOne = 'Andrew S. Tanenbaum';
console.log('First string for transmision: ', exampleOne);

// Converts a string to an array af ASII bytes
// Splits a word in to charecters and for each charecter
// converts it to the ASCI number, converts it to a string in the base of 2 (binary)
// and saves that and and the extra 0 as an entry in an array
const convertStringToBytes = exampleWord => {
  const arrayOfASCIBytes = [];

  exampleWord.split('').forEach(char => {
    const ASCICode = char.charCodeAt();
    if (ASCICode < 1) arrayOfASCIBytes.push(`0000000${ASCICode.toString(2)}`);
    else if (ASCICode < 3) arrayOfASCIBytes.push(`000000${ASCICode.toString(2)}`);
    else if (ASCICode < 7) arrayOfASCIBytes.push(`00000${ASCICode.toString(2)}`);
    else if (ASCICode < 15) arrayOfASCIBytes.push(`0000${ASCICode.toString(2)}`);
    else if (ASCICode < 31) arrayOfASCIBytes.push(`000${ASCICode.toString(2)}`);
    else if (ASCICode < 63) arrayOfASCIBytes.push(`00${ASCICode.toString(2)}`);
    else if (ASCICode < 127) arrayOfASCIBytes.push(`0${ASCICode.toString(2)}`);
    else arrayOfASCIBytes.push('00000000');
  });

  return arrayOfASCIBytes;
};

// Generates Hamming codes from an array af ASCII bytes
const generateHammingCodes = arrayOfBytes => {
  const arrayOfHammingCodes = [];

  arrayOfBytes.forEach(byte => {
    let hammingCode = byte.split('');

    // Adds check bit placeholders in byte to create a hamming code
    for (let i = 1; i <= byte.length; i *= 2) {
      hammingCode.splice(i - 1, 0, '?');
    }

    // Cyle that calculates parity for each check bit
    for (let i = 1; i <= byte.length; i *= 2) {
      let parity = 0;

      // Goes through each of the hammingCode byte to determine the parity of a check byte,
      // by summing the necessary bites and chcking parity lates
      hammingCode.forEach((bit, index) => {
        if (i === 1) {
          if ((index + 1) % 2 === 1 && index !== 0) {
            parity += parseInt(bit);
          }
        } else {
          if (~~((index + 1) / i) % 2 === 1 && index !== i - 1) {
            parity += parseInt(bit);
          }
        }
      });

      // Checks if the parity should be 0 or 1 based on if the checked bits have added up odd or even
      parity = parity % 2 === 0 ? 0 : 1;

      // Replaces check bit with calculated parity bit
      hammingCode[i - 1] = parity;
    }

    // Pushes the created Hamming code to an array
    arrayOfHammingCodes.push(hammingCode);
  });

  return arrayOfHammingCodes;
};

const arrayOfBytesOne = convertStringToBytes(exampleOne);
const arrayOfHammingCodesOne = generateHammingCodes(arrayOfBytesOne);

console.log('TCL: arrayOfBytesOne', arrayOfBytesOne);
console.log('TCL: arrayOfBytesOne', arrayOfHammingCodesOne);
