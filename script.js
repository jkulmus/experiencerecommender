/**
 * Experience Recommendation Tool
 * By: Jacquelyn Kulmus
 */

// Bonus Activity Array for Lodash randomization
const bonusActivities = [
    "Live performance show",
    "Guided tour",
    "Exclusive dining experience",
    "Evening entertainment event"
];

// Event listener for button
document.getElementById("recommendBtn")
    .addEventListener("click", generateRecommendation);

function generateRecommendation() {
    const nameValue = document.getElementById("name").value;
    const moodValue = document.getElementById("mood").value;
    const activityValue = document.getElementById("activity").value;

    // Basic input validation
    if (!moodValue || !activityValue) {
        const resultDiv = document.getElementById("result");
        resultDiv.style.display = "inline-block";
        resultDiv.innerHTML = "<p style='color:red;'>Please select both mood and activity level</p>";
        return;
    }

    //Main Data Array
    const experiences = [
        { mood: "relaxing", activity: "low", result: "Peaceful garden retreat with spa access" },
        { mood: "relaxing", activity: "medium", result: "Scenic nature walk with picnic experience" },
        { mood: "adventure", activity: "high", result: "Action-packed outdoor adventure experience" },
        { mood: "luxury", activity: "medium", result: "Premium stay with curated activities" },
        { mood: "adventure", activity: "medium", result: "Guided exploration and outdoor excursions" },
        { mood: "luxury", activity: "low", result: "Private suite with relaxation services" },
        { mood: "adventure", activity: "low", result: "Hot air balloon ride at sunrise" },
        { mood: "relaxing", activity: "high", result: "Yoga retreat with mountain hiking" },
        { mood: "luxury", activity: "high", result: "Helicopter tour with private glacier landing" },
        { mood: "adventure", activity: "medium", result: "Off-road Jeep tour through canyon lands" }
    ];

    // 1. Recursion - Find an exact match
    const recursiveMatch = findMatchRecursive(experiences, moodValue, activityValue, 0);

    // 2. System Scoring
    const scored = experiences.map(exp => {
        let score = 0;
        if (exp.mood === moodValue) score += 2;
        if (exp.activity === activityValue) score += 1;
        return { ...exp, score };
    });

    const sorted = scored.sort((a, b) => b.score - a.score);
    const topResults = sorted.slice(0, 2);

    // 3. External Library - Lodash to sample random bonus activities
    const randomBonus = _.sample(bonusActivities);

    // 4. Display 
    displayResults(nameValue, topResults, randomBonus, recursiveMatch);
}

/**
 * Recursion Logic:
 * This function searches for an exact match by iterating through the array recursively
 * Base Case: End of array reached (no match) or exact match found
 * Recursive Step: call self with index + 1
 */

function findMatchRecursive(experiences, mood, activity, index) {
    // Array exhausted
    if (index >= experiences.length) {
        return "No exact match found";
    }

    const current = experiences[index];

    // Check for exact match
    if (current.mood === mood && current.activity === activity) {
        return current.result;
    }

    // Recursive call: move to the next item
    return findMatchRecursive(experiences, mood, activity, index + 1);
}

/**
 * Display Function - Updates the DOM with results
 */
function displayResults(userName, results, bonus, recursiveResult) {
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "inline-block";

    let output = "";

    // Personalization
    if (userName) {
        output += `<h3>Recommendations for ${userName}:</h3>`;
    } else {
        output += `<h3>Your Recommendations:</h3>`;
    }

    // Map through the top scored results
    results.forEach((res, index) => {
        output += `
            <p>
                ⭐ ${res.result}
                <span class="score-text">Match Score: ${res.score}</span>
            </p>`;
    });

    output += `<hr>`;

    // Recursion display
    if (recursiveResult !== "No exact match found") {
        output += `<p><strong>Exact Match:</strong> ${recursiveResult}</p>`;
    } else {
        output += `<p><em>Note: No exact match found for this combo. Showing best alternatives</em></p>`;
    }

    // Display Lodash bonus
    output += `<p><strong>Bonus Activity:</strong> ${bonus}</p>`;
    

    resultDiv.innerHTML = output;
}