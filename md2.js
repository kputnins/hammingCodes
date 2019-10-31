// Converts a string to an array af ASII bytes
const convertStringToBytes = exampleWord => {
  const arrayOfASCIBytes = [];

  // Splits a word in to charecters and for each charecter converts it to the ASCI code
  // then converts it to a string in the base of 2 (binary)
  // and saves it with the extra 0 as an entry in an array
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
const convertToHammingCodes = arrayOfBytes => {
  const arrayOfHammingCodes = [];

  arrayOfBytes.forEach(byte => {
    // Splits each string of bits in to an array of numbers
    let hammingCode = byte.split('').map(item => parseInt(item, 10));

    // Adds check bit placeholders in the byte string to create a hamming code
    for (let i = 1; i <= byte.length; i *= 2) {
      hammingCode.splice(i - 1, 0, '?');
    }

    // Cyle that calculates parity for each check bit
    for (let i = 1; i <= byte.length; i *= 2) {
      let parity = 0;

      // Goes through each of the hammingCode bits and summs the necessary bits for chcking parity
      hammingCode.forEach((bit, index) => {
        if (i === 1) {
          if ((index + 1) % 2 === 1 && index !== 0) {
            parity += bit;
          }
        } else {
          if (~~((index + 1) / i) % 2 === 1 && index !== i - 1) {
            parity += bit;
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

// Flips a bit
const flipBit = bit => {
  return bit === 0 ? 1 : 0;
};

// Simulates sending a bit stream of data bit by bit,
// and indrotuces flipped bits based on specified errorRate
const sendTransmision = (dataArray, errorRate) => {
  const sentDataArray = [];

  dataArray.forEach(byte => {
    const sentByte = [];
    byte.forEach(bit => {
      let sentBit = null;
      if (Math.random() < errorRate) {
        sentBit = flipBit(bit);
      } else {
        sentBit = bit;
      }

      sentByte.push(sentBit);
    });
    sentDataArray.push(sentByte);
  });

  return sentDataArray;
};

// Generates an array af ASCII bytes from an array of Hamming codes
const convertFromHammingCodes = arrayOfHammingCodes => {
  const arrayOfBytes = [];

  arrayOfHammingCodes.forEach(code => {
    const byte = [...code];
    parityBitPositions = [];

    // Finds the positions of parity bits in Hamming code
    for (let i = 1; i <= code.length; i *= 2) {
      parityBitPositions.push(i);
    }

    // Removes the extra parity bits
    parityBitPositions.reverse().forEach(bit => {
      byte.splice(bit - 1, 1);
    });

    arrayOfBytes.push(byte);
  });

  return arrayOfBytes;
};

// Converts an array of array of bits in to a string
const covertBytesToString = arrayOfBytes => {
  let string = '';

  // Joins array of bits in to a single string
  // Converts it to a number parsing it as a number in base 2
  // Converts it to the coresponding ASCII code charecter
  // Apends all charecters to a string
  arrayOfBytes.forEach(byte => {
    string += String.fromCharCode(parseInt(byte.join(''), 2));
  });

  return string;
};

const sentString = 'Andrew S. Tanenbaum';
const arrayOfBytes = convertStringToBytes(sentString);
const arrayOfHammingCodes = convertToHammingCodes(arrayOfBytes);

const recievedArrayOfHammingCodes = sendTransmision(arrayOfHammingCodes, 0.01);
const recievedArrayOfBytes = convertFromHammingCodes(recievedArrayOfHammingCodes);
const recievedString = covertBytesToString(recievedArrayOfBytes);

console.log('\nSentString\n', sentString);
console.log('\nRecievedString\n', recievedString);
