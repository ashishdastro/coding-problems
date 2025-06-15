document.addEventListener("DOMContentLoaded", function () {
  const levelFilter = document.getElementById("levelFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const tagSearch = document.getElementById("searchTag");
  const sortBy = document.getElementById("sortBy");
  const ratingFilter = document.getElementById("ratingFilter");
  const rows = document.querySelectorAll(".problem-row");

  // 🌙 Load dark mode
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  // ✅ Load progress
  const savedProgress = JSON.parse(localStorage.getItem("progress") || "{}");
  document.querySelectorAll(".progress-box").forEach(cb => {
    const key = cb.dataset.name;
    cb.checked = savedProgress[key] || false;
    cb.addEventListener("change", () => {
      savedProgress[key] = cb.checked;
      localStorage.setItem("progress", JSON.stringify(savedProgress));
      updateCategoryProgress();
    });
  });

  // ✅ Load ratings
  const savedRatings = JSON.parse(localStorage.getItem("ratings") || "{}");

  function addStarRatingToRow(row) {
    const ratingCell = row.querySelector(".rating-cell");
    if (!ratingCell) return;

    const problemId = row.dataset.name;
    const rating = savedRatings[problemId] || 0;

    ratingCell.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.innerHTML = i <= rating ? "★" : "☆";
      star.classList.add("star");
      if (i <= rating) star.classList.add("selected");

      // Hover effect
      star.addEventListener("mouseover", () => {
        ratingCell.querySelectorAll(".star").forEach((s, idx) => {
          s.innerHTML = idx < i ? "★" : "☆";
        });
      });

      star.addEventListener("mouseleave", () => {
        ratingCell.querySelectorAll(".star").forEach((s, idx) => {
          s.innerHTML = idx < rating ? "★" : "☆";
        });
      });

      // Click to save
      star.addEventListener("click", () => {
        savedRatings[problemId] = i;
        localStorage.setItem("ratings", JSON.stringify(savedRatings));
        addStarRatingToRow(row);
        updateCategoryProgress();
      });

      ratingCell.appendChild(star);
    }
  }

  rows.forEach(addStarRatingToRow);

  // ✅ Fill category filter
  const categories = [...new Set([...rows].map(row => row.querySelector(".category").textContent))];
  categories.sort().forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // ✅ Filtering
  function filterTable() {
    const levelVal = levelFilter.value;
    const catVal = categoryFilter.value;
    const tagVal = tagSearch.value.toLowerCase();
    const minRating = parseInt(ratingFilter.value || "0");

    rows.forEach(row => {
      const level = row.querySelector(".level").textContent;
      const category = row.querySelector(".category").textContent;
      const tags = [...row.querySelectorAll(".tag")].map(t => t.textContent.toLowerCase());
      const rating = savedRatings[row.dataset.name] || 0;

      const matchLevel = !levelVal || level === levelVal;
      const matchCategory = !catVal || category === catVal;
      const matchTags = !tagVal || tags.some(t => t.includes(tagVal));
      const matchRating = rating >= minRating;

      row.style.display = (matchLevel && matchCategory && matchTags && matchRating) ? "" : "none";
    });
  }

  levelFilter.addEventListener("change", filterTable);
  categoryFilter.addEventListener("change", filterTable);
  tagSearch.addEventListener("input", filterTable);
  ratingFilter.addEventListener("change", filterTable);

  // ✅ Collapse/Expand individual categories
  document.querySelectorAll(".collapsible-header").forEach(header => {
    header.addEventListener("click", () => {
      const section = header.closest(".category-section");
      section.classList.toggle("collapsed");
    });
  });

  // ✅ Per-category progress bar
  function updateCategoryProgress() {
    document.querySelectorAll(".category-section").forEach(section => {
      const checkboxes = section.querySelectorAll(".progress-box");
      const checked = [...checkboxes].filter(cb => cb.checked).length;
      const total = checkboxes.length;

      const progressText = section.querySelector(".cat-progress");
      const fill = section.querySelector(".cat-fill");

      if (progressText) progressText.textContent = `(${checked} / ${total})`;
      if (fill) fill.style.width = total > 0 ? `${(100 * checked / total).toFixed(0)}%` : "0%";
    });
  }

  // ✅ Sort problems by rating
  sortBy.addEventListener("change", () => {
    const sortByRating = sortBy.value === "rating";
    document.querySelectorAll(".category-section").forEach(section => {
      const list = section.querySelector(".problem-list");
      const problems = [...list.children];

      problems.sort((a, b) => {
        const ra = savedRatings[a.dataset.name] || 0;
        const rb = savedRatings[b.dataset.name] || 0;
        return sortByRating ? rb - ra : 0;
      });

      problems.forEach(p => list.appendChild(p));
    });
  });

  updateCategoryProgress();
  filterTable();
});

// ✅ Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// ✅ Reset everything except ratings
function resetProgress() {
  localStorage.removeItem("progress");
  localStorage.removeItem("darkMode");
  document.querySelectorAll(".progress-box").forEach(cb => cb.checked = false);
  document.body.classList.remove("dark");
  document.getElementById("levelFilter").value = "";
  document.getElementById("categoryFilter").value = "";
  document.getElementById("searchTag").value = "";
  document.getElementById("ratingFilter").value = "0";
  location.reload();
}

// ✅ Collapse/Expand All
function toggleAll() {
  document.querySelectorAll(".category-section").forEach(section => {
    section.classList.toggle("collapsed");
  });
}
