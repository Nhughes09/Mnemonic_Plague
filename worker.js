var fs = require("fs")
const { ethers } = require("ethers")
var tries = 0, hits = 0
const delay = time => new Promise(res => setTimeout(res, time));
var words = fs.readFileSync("bip39.txt", { encoding: 'utf8', flag: 'r' }).replace(/(\r)/gm, "").toLowerCase().split("\n")

function gen12(words) {
  var n = 12
  var shuffled = words.sort(function () { return.5 - Math.random() })
  var phrase = shuffled.slice(0, n).join(" ")
  var phraseBytes = Buffer.from(phrase, 'utf8')
  var phraseByteLength = phraseBytes.length

  // Apply permutations based on byte length
  if (phraseByteLength > 128) {
    // Take first 128 bytes
    phraseBytes = phraseBytes.slice(0, 128)
  } else if (phraseByteLength < 128) {
    // Pad with zeros to reach 128 bytes
    phraseBytes = Buffer.concat([Buffer.alloc(128 - phraseByteLength), phraseBytes])
  }

  return phraseBytes.toString('hex')
}
console.log("starting....")

async function doCheck() {
  tries++;
  var phrases = fs.readFileSync('phrases.txt', 'utf8').split('\n');
  var phrase = phrases[Math.floor(Math.random() * phrases.length)]; // select a random phrase from the saved phrases
  try {
    var wall = ethers.Wallet.fromMnemonic(phrase);
    fs.appendFileSync('hits.txt', wall.address + "," + wall.privateKey + "\n");
    hits++;
    process.stdout.write("+");
  } catch (e) { }
  await delay(0); // Prevent Call Stack Overflow
  doCheck();
}
doCheck();