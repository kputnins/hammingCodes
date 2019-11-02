let sentBits = 0;
let flippedBits = 0;

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
    const hammingCode = byte.split('').map(item => parseInt(item, 10));

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
          // eslint-disable-next-line no-bitwise
        } else if (~~((index + 1) / i) % 2 === 1 && index !== i - 1) {
          parity += bit;
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
const flipBit = bit => (bit === 0 ? 1 : 0);

// Simulates sending a bit stream of data bit by bit,
// and indrotuces flipped bits based on specified errorRate
const sendTransmision = (dataArray, errorRate) => {
  const sentDataArray = [];

  // Rotates the to be sent data array by 90 degrees
  const rotatedDataArray = dataArray[0].map((col, i) => dataArray.map(row => row[i]));

  rotatedDataArray.forEach(byte => {
    const sentByte = [];
    byte.forEach(bit => {
      sentBits += 1;
      let sentBit = null;
      if (Math.random() < errorRate) {
        flippedBits += 1;
        sentBit = flipBit(bit);
      } else {
        sentBit = bit;
      }

      sentByte.push(sentBit);
    });
    sentDataArray.push(sentByte);
  });

  // Rotates the sent data array back by 90 degrees
  const rotatedSentDataArray = sentDataArray[0].map((col, i) => sentDataArray.map(row => row[i]));

  return rotatedSentDataArray;
};

// Corrects errors in recieved Hamming codes by
// checking the parity bits and determining the flipped bit
const correctHammingCodes = hammingCodes => {
  const correctedCodes = [...hammingCodes];

  hammingCodes.forEach((code, codeIndex) => {
    let parityBitCounter = 0;

    // Cyle that calculates parity for each check bit
    for (let i = 1; i <= code.length; i *= 2) {
      let parity = 0;

      // Goes through each of the hammingCode bits and summs the necessary bits for chcking parity
      code.forEach((bit, bitIndex) => {
        if (i === 1) {
          if ((bitIndex + 1) % 2 === 1 && bitIndex !== 0) {
            parity += bit;
          }
          // eslint-disable-next-line no-bitwise
        } else if (~~((bitIndex + 1) / i) % 2 === 1 && bitIndex !== i - 1) {
          parity += bit;
        }
      });

      // Checks if the parity should be 0 or 1 based on if the checked bits have added up odd or even
      parity = parity % 2 === 0 ? 0 : 1;

      if (code[i - 1] !== parity) {
        parityBitCounter += i;
      }
    }

    if (parityBitCounter) {
      correctedCodes[codeIndex][parityBitCounter - 1] = flipBit(hammingCodes[codeIndex][parityBitCounter - 1]);
    }
  });

  return correctedCodes;
};

// Generates an array af ASCII bytes from an array of Hamming codes
const convertFromHammingCodes = arrayOfHammingCodes => {
  const arrayOfBytes = [];

  arrayOfHammingCodes.forEach(code => {
    const byte = [...code];
    const parityBitPositions = [];

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

const stringsToSend = [
  'Andrew S. Tanenbaum',
  'Hamming codes can only',
  'correct single errors',
  'To correct burst errors,',
  'the data should be transmitted one column at a time',
];

stringsToSend.forEach(string => {
  console.log('Sent:      ', string);
  const arrayOfBytes = convertStringToBytes(string);
  const arrayOfHammingCodes = convertToHammingCodes(arrayOfBytes);
  const recievedArrayOfHammingCodes = sendTransmision(arrayOfHammingCodes, 0.01);
  let recievedArrayOfBytes = convertFromHammingCodes(recievedArrayOfHammingCodes);
  let recievedString = covertBytesToString(recievedArrayOfBytes);
  console.log('Recieved:  ', recievedString);

  const correctedArrayOfHammingCodes = correctHammingCodes(recievedArrayOfHammingCodes);
  recievedArrayOfBytes = convertFromHammingCodes(correctedArrayOfHammingCodes);
  recievedString = covertBytesToString(recievedArrayOfBytes);
  console.log('Corrected: ', recievedString);
  console.log('Restored:  ', string === recievedString);
  console.log();
});

console.log('Bits sent:    ', sentBits);
console.log('Bits flipped: ', flippedBits);
