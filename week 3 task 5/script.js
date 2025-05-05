const form = document.getElementById('reverseForm');
const output = document.getElementById('output');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const input = document.getElementById('statementInput').value.trim();
    const chars = input.split('');

    // Use map to reverse characters manually
    const reversed = chars.map((_, i, arr) => arr[arr.length - 1 - i]).join('');

    console.log("Reversed:", reversed);
    output.textContent = "Reversed Statement: " + reversed;
});
