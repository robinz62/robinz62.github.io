// Fetches a random problem with the given settings. Results from the codeforces
// API are cached.
//
// The following data is cached in sessionStorage:
// problems: the list of problems.
//
// TODO(robinz62): consider filtering by already solved, given handle.
function getProblem() {
  if (typeof Storage === 'undefined' || !window.sessionStorage.getItem('problems')) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = 'json';
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState != 4 || xmlHttp.status != 200) {
        // Error
        return;
      }
      const problems = xmlHttp.response.result.problems;
      getProblemFromList(problems);
    }
    xmlHttp.open('GET', 'https://codeforces.com/api/problemset.problems?lang=en', /*async=*/true);
    xmlHttp.send(null);
  } else {
    getProblemFromList(JSON.parse(window.sessionStorage.getItem('problems')));
  }
}

// Given a list of candidate problems, selects a random one out of the list
// within the rating range specified on the page. Updates the DOM with results.
function getProblemFromList(problems) {
  // Filter by rating.
  let ratingLower = parseInt(document.getElementById('rating-lower').value, 10);
  let ratingUpper = parseInt(document.getElementById('rating-upper').value, 10) || 5000;
  if (isNaN(ratingLower)) ratingLower = 0;
  if (isNaN(ratingUpper)) ratingUpper = 5000;

  // Filter by tags (if present).
  let tags = document.getElementById('tags').value || '';
  tags = tags.split(',');
  const tagsSet = new Set();
  for (const tag of tags) if (tag) tagsSet.add(tag);
  const filtered = problems.filter(problem => {
    if (!problem.rating) return false;
    if (problem.rating < ratingLower || problem.rating > ratingUpper) return false;
    let found = tagsSet.size == 0;
    for (const tag of problem.tags) {
      if (found) break;
      if (tagsSet.has(tag)) found = true;
    }
    if (!found) return false;
    return true;
  });

  // Choose a result and update DOM.
  const N = filtered.length;
  const resultLinkDiv = document.getElementById('result-link-div');
  const noResultDiv = document.getElementById('result-nolink-div');
  if (N == 0) {
    resultLinkDiv.style.display = 'none';
    noResultDiv.style.display = 'inline';
  } else {
    const picked = filtered[Math.floor(Math.random() * N)];
    const resultLink = document.getElementById('result-link');
    resultLink.textContent = `${picked.contestId}${picked.index} - ${picked.name}`;
    resultLink.href = `https://codeforces.com/problemset/problem/${picked.contestId}/${picked.index}`;
    resultLinkDiv.style.display = 'inline';
    noResultDiv.style.display = 'none';
  }
}