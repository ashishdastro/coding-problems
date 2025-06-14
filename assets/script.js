document.addEventListener("DOMContentLoaded", function () {
  const levelFilter = document.getElementById("levelFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const tagSearch = document.getElementById("searchTag");
  const rows = document.querySelectorAll(".problem-row");

  // Load dark mode from storage
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  // Load checkbox states
  const savedProgress = JSON.parse(localStorage.getItem("progress") || "{}");
  document.querySelectorAll(".progress-box").forEach(cb => {
    const key = cb.dataset.name;
    cb.checked = savedProgress[key] || false;
    cb.addEventListener("change", () => {
      savedProgress[key] = cb.checked;
      localStorage.setItem("progress", JSON.stringify(savedProgress));
    });
  });

  // Add star rating functionality
  function addStarRatingToRow(row) {
    const ratingCell = row.querySelector(".rating-cell");
    if (!ratingCell) return;

    const problemId = row.dataset.name;
    const savedRatings = JSON.parse(localStorage.getItem("ratings") || "{}");
    const currentRating = savedRatings[problemId] || 0;

    ratingCell.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.innerHTML = "&#9734;";
      star.classList.add("star");
      star.dataset.value = i;

      if (i <= currentRating) {
        star.classList.add("selected");
      }

      star.addEventListener("click", () => {
        savedRatings[problemId] = i;
        localStorage.setItem("ratings", JSON.stringify(savedRatings));
        addStarRatingToRow(row);
      });

      ratingCell.appendChild(star);
    }
  }

  rows.forEach(addStarRatingToRow);

  // Fill category filter dropdown
  const categories = [...new Set([...rows].map(row => row.querySelector(".category").textContent))];
  categories.sort().forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Filtering function
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

  // Toggle collapsible categories
  document.querySelectorAll(".collapsible-header").forEach(header => {
    header.addEventListener("click", () => {
      const section = header.closest(".category-section");
      section.classList.toggle("collapsed");
    });
  });
});

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

function resetProgress() {
  localStorage.removeItem("progress");
  localStorage.removeItem("ratings");
  localStorage.removeItem("darkMode");
  document.querySelectorAll(".progress-box").forEach(cb => cb.checked = false);
  document.querySelectorAll(".star").forEach(star => star.classList.remove("selected"));
  document.body.classList.remove("dark");
  document.getElementById("levelFilter").value = "";
  document.getElementById("categoryFilter").value = "";
  document.getElementById("searchTag").value = "";
  location.reload();
}
