const button = document.getElementById('send-button');
// const input = document.getElementById('num-input');

// button.addEventListener("click", () => {
//     console.log('ppoop');
// })

button.addEventListener('click', async () => {
    const input = document.getElementById('num-input');
    const number = input.value;
    console.log(number);
  
    const response = await fetch('/multiply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ number })
    });
  
    const data = await response.json();
    const result = data.result;
    console.log(result);
  
    // Display the result to the user
    // const resultElement = document.getElementById('result');
    // resultElement.textContent = `Result: ${result}`;
  });