<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Slot Machine Game</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
</head>
<body>
    <div id="app">
        <game></game>
    </div>

    <script>
        Vue.component('game', {
            data() {
                return {
                    balance: 1000,
                    betLevel: 1,
                    coinValue: 1,
                    maxBetLevel: 5,
                    previousSpinResult: [],
                    bonusRoundCount: 0,
                    bonusRoundResults: [],
                    jackpotAmount: 10000,
                    symbols: ['🍒', '🍋', '🍇', '🍊', '🍉', '🍎', '💰'],
                    scatterSymbol: '🌟',
                    megawaysEnabled: true,
                    freeSpinEnabled: true,
                    spinGameEnabled: true,
                    jackpotEnabled: true,
                    gambleEnabled: true,
                    paylines: [
                        [[0, 0], [0, 1], [0, 2]], // Top row
                        [[1, 0], [1, 1], [1, 2]], // Middle row
                        [[2, 0], [2, 1], [2, 2]], // Bottom row
                        [[0, 0], [1, 1], [2, 2]], // Diagonal from top left to bottom right
                        [[0, 2], [1, 1], [2, 0]], // Diagonal from top right to bottom left
                    ],
                    additionalPaylines: [
                        // Additional paylines
                        [[0, 0], [1, 1], [0, 2]], // Diagonal from top left to bottom right
                        [[2, 0], [1, 1], [2, 2]], // Diagonal from top right to bottom left
                        [[0, 0], [0, 1], [1, 1]], // Diagonal from top left to bottom right
                        [[0, 1], [1, 0], [1, 1]], // Diagonal from top left to bottom right
                    ],
                    additionalSymbols: ['🍒', '🍊', '🍇', '🍉'],
                    paytable: {
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
                    }
                };
            },
            methods: {
                spin() {
                    // Simulate spinning the slot machine
                    let spinResult = this.spinMachine();
                    // Update game state
                    this.previousSpinResult = spinResult;
                    let bet = this.calculateBet();
                    let winnings = this.calculateWinnings(spinResult, bet);
                    this.balance += winnings;
                    // Check for bonus round
                    if (spinResult.includes(this.scatterSymbol) && this.freeSpinEnabled) {
                        this.triggerBonusRound();
                        this.balance += 100;
                    }
                    // Check for jackpot
                    if (this.jackpotEnabled && spinResult.includes('💰💰💰')) {
                        this.winJackpot();
                    }
                    // Check for game over
                    if (this.balance <= 0) {
                        this.gameOver();
                    }
                },
                spinMachine() {
                    let spinResult = [];
                    if (this.megawaysEnabled) {
                        let randomSymbolCount = Math.floor(Math.random() * this.symbols.length) + 1;
                        for (let i = 0; i < randomSymbolCount; i++) {
                            let randomIndex = Math.floor(Math.random() * this.symbols.length);
                            spinResult.push(this.symbols[randomIndex]);
                        }
                    } else {
                        for (let i = 0; i < 3; i++) {
                            let randomIndex = Math.floor(Math.random() * this.symbols.length);
                            spinResult.push(this.symbols[randomIndex]);
                        }
                    }
                    return spinResult;
                },
                calculateBet() {
                    let bet = parseInt(prompt("Bet amount:")) * this.betLevel * this.coinValue;
                    while (isNaN(bet) || bet <= 0 || bet > this.balance) {
                        bet = parseInt(prompt("Invalid bet amount. Please enter a valid bet:")) * this.betLevel * this.coinValue;
                    }
                    return bet;
                },
                calculateWinnings(spinResult, bet) {
                    let totalWinnings = 0;
                    for (let i = 0; i < this.paylines.length; i++) {
                        let payline = this.paylines[i];
                        let symbolsOnPayline = [];
                        for (let j = 0; j < payline.length; j++) {
                            let coordinates = payline[j];
                            let symbol = spinResult[coordinates[0]];
                            symbolsOnPayline.push(symbol);
                        }
                        let paylineCombination = symbolsOnPayline.join('');
                        if (this.paytable.hasOwnProperty(paylineCombination)) {
                            totalWinnings += this.paytable[paylineCombination] * this.betLevel;
                        }
                    }
                    return totalWinnings;
                },
                triggerBonusRound() {
                    this.bonusRoundCount++;
                    let bonusResult = this.playBonusRound();
                    this.bonusRoundResults.push(bonusResult);
                    console.log("Congratulations! You triggered a bonus round. Total bonus rounds: " + this.bonusRoundCount);
                    console.log("Bonus Round Result: " + bonusResult.join(' | '));
                },
                playBonusRound() {
                    let bonusResult = [];
                    for (let i = 0; i < 3; i++) {
                        let randomIndex = Math.floor(Math.random() * this.symbols.length);
                        bonusResult.push(this.symbols[randomIndex]);
                    }
                    return bonusResult;
                },
                winJackpot() {
                    console.log("Congratulations! You won the jackpot!");
                    this.balance += this.jackpotAmount;
                    this.jackpotAmount = 10000;
                },
                gameOver() {
                    console.log("You ran out of coins. Game over!");
                    // Handle game over logic here
                }
            },
            template: `
                <div>
                    <p>Balance: {{ balance }} coins</p>
                    <p>Bet Level: {{ betLevel }}</p>
                    <p>Coin Value: {{ coinValue }} coins per bet</p>
                    <p v-if="previousSpinResult.length > 0">Previous Spin Result: {{ previousSpinResult.join(' | ') }}</p>
                    <button @click="spin">Spin</button>
                </div>
            `
        });

        new Vue({
            el: '#app'
        });
    </script>
</body>
</html>