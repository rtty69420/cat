const ai = require("@ozrageharm/blackbox-ai");

const form = document.getElementsByName('formm');
const input = document.getElementsByName('ai');

form.addEventListener('submit', async event => {
    event.preventDefault();
    const output = ai.chat(input.value.trim());
    const result = document.querySelector(".output");

    result.text = input.value.trim();
});
