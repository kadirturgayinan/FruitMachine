// Slot machine symbols and properties
var symbols = ['🍒', '🍋', '🍇', '🍊', '🍉', '🍎', '💰']; // 💰 = Wild symbol
var scatterSymbol = '🌟'; // Scatter symbol
var megawaysEnabled = true; // Indicates whether Megaways feature is enabled
var freeSpinEnabled = true; // Indicates whether Free Spin feature is enabled
var spinGameEnabled = true; // Indicates whether Spin Game feature is enabled
var jackpotEnabled = true; // Indicates whether Jackpot feature is enabled
var gambleEnabled = true; // Indicates whether Gamble feature is enabled
var paylines = [ // Define paylines
    [[0, 0], [0, 1], [0, 2]], // Top row
    [[1, 0], [1, 1], [1, 2]], // Middle row
    [[2, 0], [2, 1], [2, 2]], // Bottom row
    [[0, 0], [1, 1], [2, 2]], // Diagonal from top left to bottom right
    [[0, 2], [1, 1], [2, 0]], // Diagonal from top right to bottom left
];

// Additional paylines
var additionalPaylines = [
    // Additional paylines
    [[0, 0], [1, 1], [0, 2]], // Diagonal from top left to bottom right
    [[2, 0], [1, 1], [2, 2]], // Diagonal from top right to bottom left
    [[0, 0], [0, 1], [1, 1]], // Diagonal from top left to bottom right
    [[0, 1], [1, 0], [1, 1]], // Diagonal from top left to bottom right
];

// Additional symbols
var additionalSymbols = ['🍒', '🍊', '🍇', '🍉']; 

// Concatenate additional paylines and symbols
paylines = paylines.concat(additionalPaylines);
symbols = symbols.concat(additionalSymbols);

// Paytable with additional combinations
var paytable = {
    '🍒🍒🍒': 100,
    '🍋🍋🍋': 200,
    '🍇🍇🍇': 300,
    '🍊🍊🍊': 400,
    '🍉🍉🍉': 500,
    '🍎🍎🍎': 600,
    '💰💰💰': 1000,
    '🍒🍒💰': 800,
    '🍊🍊💰': 700,
    '🍇🍇💰': 600,
    '🍉🍉💰': 500,
    '🍋🍋💰': 400,
    '🍎🍎💰': 300,
    '💰💰🍒': 200,
    '💰💰🍊': 150,
    '💰💰🍇': 100,
    '💰💰🍉': 80,
    '💰💰🍋': 60,
    '💰💰🍎': 40,
    '💰💰💰': 1000
};

// Player's balance, bet level, coin value, previous spin result, and bonus round count
var balance = 1000; // Total amount of coins player has
var betLevel = 1; // Bet level chosen by player
var coinValue = 1; // Value of each coin
var maxBetLevel = 5; // Maximum bet level
var previousSpinResult = []; // Result of previous spin
var bonusRoundCount = 0; // Number of triggered bonus rounds
var bonusRoundResults = []; // Array to store bonus round results
var jackpotAmount = 10000; // Jackpot amount

// Game loop
while (true) {
    // Display game information to the player
    console.log("Balance: " + balance + " coins");
    console.log("Bet Level: " + betLevel);
    console.log("Coin Value: " + coinValue + " coins per bet");
    if (previousSpinResult.length > 0) {
        console.log("Previous Spin Result: " + previousSpinResult.join(' | '));
    }
    console.log("Place your bet (or type 'quit' to exit):");

    // Get bet amount from the player
    var betInput = prompt("Bet amount:");
    if (betInput.toLowerCase() === 'quit') {
        console.log("Exiting the game. Goodbye!");
        break;
    }
    var bet = parseInt(betInput) * betLevel * coinValue;
    if (isNaN(bet) || bet <= 0 || bet > balance) {
        console.log("Invalid bet amount. Please enter a valid bet.");
        continue;
    }

    // Spin the slot machine
    var spinResult = [];
    if (megawaysEnabled) {
        var randomSymbolCount = Math.floor(Math.random() * symbols.length) + 1;
        for (var i = 0; i < randomSymbolCount; i++) {
            var randomIndex = Math.floor(Math.random() * symbols.length);
            spinResult.push(symbols[randomIndex]);
        }
    } else {
        for (var i = 0; i < 3; i++) {
            var randomIndex = Math.floor(Math.random() * symbols.length);
            spinResult.push(symbols[randomIndex]);
        }
    }

    // Display spin result
    console.log("Spinning the wheels...");
    console.log("Result: " + spinResult.join(' | '));

    // Update previous spin result
    previousSpinResult = spinResult.slice();

    // Calculate winnings
    var winnings = calculateWinnings(spinResult, bet);

    // Update balance
    balance += winnings;
    console.log("You won " + winnings + " coins!");

    // Check bonus round conditions
    if (spinResult.includes(scatterSymbol) && freeSpinEnabled) {
        bonusRoundCount++;
        var bonusResult = playBonusRound();
        bonusRoundResults.push(bonusResult);
        console.log("Congratulations! You triggered a bonus round. Total bonus rounds: " + bonusRoundCount);
        console.log("Bonus Round Result: " + bonusResult.join(' | '));
        balance += 100; // Win extra 100 coins in the bonus round
    }

    // Check jackpot condition
    if (jackpotEnabled && spinResult.includes('💰💰💰')) {
        console.log("Congratulations! You won the jackpot!");
        balance += jackpotAmount;
        jackpotAmount = 10000;
    }

    // Check player's balance
    if (balance <= 0) {
        console.log("You ran out of coins. Game over!");
        break;
    }
}

// Function to play bonus round
function playBonusRound() {
    var bonusResult = [];
    for (var i = 0; i < 3; i++) {
        var randomIndex = Math.floor(Math.random() * symbols.length);
        bonusResult.push(symbols[randomIndex]);
    }
    return bonusResult;
}

// Function to calculate winnings
function calculateWinnings(spinResult, bet) {
    var totalWinnings = 0;
    for (var i = 0; i < paylines.length; i++) {
        var payline = paylines[i];
        var symbolsOnPayline = [];
        for (var j = 0; j < payline.length; j++) {
            var coordinates = payline[j];
            var symbol = spinResult[coordinates[0]];
            symbolsOnPayline.push(symbol);
        }
        var paylineCombination = symbolsOnPayline.join('');
        if (paytable.hasOwnProperty(paylineCombination)) {
            totalWinnings += paytable[paylineCombination] * betLevel;
        }
    }
    return totalWinnings;