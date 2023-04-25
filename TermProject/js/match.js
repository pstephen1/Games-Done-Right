// Shuffles the array of cards using the Fisher-Yates method.

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Controls the classes of cards as they are flipped.

function flipCard(card) {
    if ($(card).hasClass("flipped")) {
        $(card).css("background-image", `url(media/${$(card).attr("data-src")})`);
    } else {
        $(card).css("background-image", "url(media/cardback.jpg)");
    }
}

// Waits for the page to load before starting the game.

$(document).ready(function() {

// Stores the deck of cards as well as their filenames into an array of objects.

    var cards = [
        {id: "card1", src: "ape.jpg"},
        {id: "card2", src: "bear.jpg"},
        {id: "card3", src: "cat.jpg"},
        {id: "card4", src: "dog.jpg"},
        {id: "card5", src: "fish.jpg"},
        {id: "card6", src: "bird.jpg"},
        {id: "card7", src: "elephant.jpg"},
        {id: "card8", src: "lion.jpg"},
        {id: "card9", src: "panda.jpg"},
        {id: "card10", src: "tiger.jpg"},
        {id: "card11", src: "ape.jpg"},
        {id: "card12", src: "bear.jpg"},
        {id: "card13", src: "cat.jpg"},
        {id: "card14", src: "dog.jpg"},
        {id: "card15", src: "fish.jpg"},
        {id: "card16", src: "bird.jpg"},
        {id: "card17", src: "elephant.jpg"},
        {id: "card18", src: "lion.jpg"},
        {id: "card19", src: "panda.jpg"},
        {id: "card20", src: "tiger.jpg"}
    ];

    // Initializes variables for the game.

    var score = 0;
    var miss = 0;
    var cardCount = 0;
    var checkingMatch = false;
    var selectedCards = [];

    // Calls the shuffle function at the top of the file.

    shuffleArray(cards);
    console.log(cards);

    // Loops through each card class in the HTML file. 
    // For every card class in the HTML file, it assigns it a pair of tags - ID and an image path from the cards array.
    // It then adds the "back" class to the card, which has its own image. This ensures that cards all have the same back.

    $(".card").each(function(index) {
        $(this).attr("data-id", cards[index].id);
        $(this).attr("data-src", cards[index].src);
        $(this).addClass("back");
        console.log($(this).attr("data-id"), $(this).attr("data-src")); // Because debugging this game was really, really hard.
    });

    // The main game loop. This function is called whenever a card is clicked.

    $(".card").click(function() {
        if ($(this).hasClass("flipped")) { // If the card has already been flipped, tell the user and skip the rest of the function.
            $(".msg").text("You have already flipped this card");
            return;
        } else if (checkingMatch) { // If the card flip timer is still running, prevents the user from flipping another card.
            console.log("Checking match");
            $(".msg").text("You're clicking too fast!");
            return;
            } else {
            $(this).removeClass("back"); // Flips the cards by removing the "back" class and adding the "flipped" class.
            $(this).addClass("flipped");
            flipCard(this); // Handles changing the CSS of the card to show its front image.
            selectedCards.push($(this)); // Adds the clicked card to the array of selected cards.
            cardCount++; // Keeps track of how many cards are currently flipped.
            console.log(selectedCards);
            console.log("Card has been flipped");
            if (cardCount === 2) { // If there are two cards face up toggles the checkingMatch variable, preventing the user from flipping more cards until it is done checking.
                checkingMatch = true;
                if (selectedCards[0].attr("data-src") === selectedCards[1].attr("data-src")) { // If the image names match, executes this block.
                    score++;
                    $(".msg").text("A match!");
                    selectedCards = [];
                    cardCount = 0;
                    checkingMatch = false; // Resets the match check, allowing the user to select another card.
                    console.log("Cards matched");
                } else { // If they don't match, user gains a miss point.
                    $(".msg").text("Ouch, cards didn't match...");
                    miss++;
                    setTimeout(function() { // Resets the classes of the flipped cards after two seconds, giving the user a chance to see them before they're placed back down.
                        selectedCards[0].removeClass("flipped");
                        selectedCards[0].addClass("back");
                        selectedCards[1].removeClass("flipped");
                        selectedCards[1].addClass("back");
                        flipCard(selectedCards[0]); // Resets the images on the cards.
                        flipCard(selectedCards[1]);
                        selectedCards = [];
                        cardCount = 0;
                        checkingMatch = false;
                    }, 2000);
                }
                $("#score").text(score); // Updates the score and misses.
                $("#miss").text(miss);
            }
        }
    });
});