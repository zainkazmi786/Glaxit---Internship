const form = document.getElementById('reverseForm');
const output = document.getElementById('output');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const inputValue = document.getElementById('statementInput').value.trim();

    if (inputValue === "") {
        output.textContent = "Please enter a statement.";
        return;
    }

    // Step 1: Show input immediately
    output.textContent = "Input Statement: " + inputValue + "\n"

    // Step 2: Wait a moment to simulate delay before reversing
    await delay(1000);

    output.textContent += "\nReversing...";

    try {
        // Step 3: Await the asynchronous reversing operation
        const reversed = await reverseTextAsync(inputValue);

        // Step 4: Show final reversed text
        output.textContent += "\nReversed Statement: " + reversed;
    } catch (error) {
        output.textContent = "Error: " + error.message;
    }
});

function reverseTextAsync(text) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const reversed = text
                .split('')
                .map((_, i, arr) => arr[arr.length - 1 - i])
                .join('');
            resolve(reversed);
        }, 1000);
    });
}

// Utility delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}