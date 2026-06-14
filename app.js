fetch("/api/products")
.then(res => res.json())
.then(data => {
  const div = document.getElementById("products");

  data.forEach(p => {
    div.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button>Add to Cart</button>
      </div>
    `;
  });
});