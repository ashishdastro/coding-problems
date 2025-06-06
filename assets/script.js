document.addEventListener("DOMContentLoaded", function () {
  const levelFilter = document.getElementById("levelFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const tagSearch = document.getElementById("searchTag");
  const rows = document.querySelectorAll("#problemTable tbody tr");

  // Fill category filter dynamically
  const categories = [...new Set([...rows].map(row => row.querySelector(".category").textContent))];
  categories.sort().forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  function filterTable() {
    const levelVal = levelFilter.value;
    const catVal = categoryFilter.value;
    const tagVal = tagSearch.value.toLowerCase();

    rows.forEach(row => {
      const level = row.querySelector(".level").textContent;
      const category = row.querySelector(".category").textContent;
      const tags = [...row.querySelectorAll(".tag")].map(t => t.textContent.toLowerCase());

      const matchesLevel = !levelVal || level === levelVal;
      const matchesCategory = !catVal || category === catVal;
      const matchesTag = !tagVal || tags.some(tag => tag.includes(tagVal));

      row.style.display = (matchesLevel && matchesCategory && matchesTag) ? "" : "none";
    });
  }

  levelFilter.addEventListener("change", filterTable);
  categoryFilter.addEventListener("change", filterTable);
  tagSearch.addEventListener("input", filterTable);
});
