/**
 * Experience Recommendation Tool
 * By: Jacquelyn Kulmus
 * 
 * * This script manages a recommendation engine using:
 * - A weighted scoring algorithm
 * - Recursive searching
 * - External library integration (Lodash)
 */

// Bonus Activity Array for Lodash randomization
const bonusActivities = [
    "Live performance show",
    "Guided tour",
    "Exclusive dining experience",
    "Evening entertainment event", 
    "VIP Backstage pass",
    "Local artisan workshop",
    "Sunset photography session",
    "Cultural storytelling experience",
    "Hands-on cooking class with a local chef"
];

// Event listener for button click
document.getElementById("recommendBtn").addEventListener("click", generateRecommendation);

// Main Function
// Handles user input, validation, scoring, and output
function generateRecommendation() {
    const resultDiv = document.getElementById("result");
    const nameValue = document.getElementById("name").value.trim();
    const moodValue = document.getElementById("mood").value;
    const activityValue = document.getElementById("activity").value;

    try {
        // Validate required inputs
        if (!moodValue || ! activityValue) {
            throw new Error("Missing Preferences: Please select both a Mood and an Activity Level");
        }

        // Validate name length
        if (nameValue.length > 20) {
            throw new Error("Invalid Name: Please keep the name under 20 characters");
        }

        //Main Data Array (multiple possible matches per category)
        const experiences = [
            { mood: "relaxing", activity: "low", result: "Peaceful garden retreat with spa access" },
            { mood: "relaxing", activity: "low", result: "Cozy fireside lounge with apple cider" },
            { mood: "relaxing", activity: "low", result: "Library lounge with your favorite beverage" },
            { mood: "relaxing", activity: "medium", result: "Scenic nature walk with picnic experience" },
            { mood: "relaxing", activity: "medium", result: "Gentle bike ride through quiet countryside paths" },
            { mood: "relaxing", activity: "high", result: "Yoga retreat with mountain hiking" },
            { mood: "relaxing", activity: "high", result: "Sunrise beach yoga followed by paddleboarding" },
            { mood: "adventure", activity: "low", result: "Hot air balloon ride at sunrise" },
            { mood: "adventure", activity: "low", result: "Stargazing night tour with telescope viewing" },
            { mood: "adventure", activity: "medium", result: "Off-road Jeep tour through canyon lands" },
            { mood: "adventure", activity: "medium", result: "Zipline canopy with scenic overlooks" },
            { mood: "adventure", activity: "medium", result: "Guided exploration and outdoor excursions" },
            { mood: "adventure", activity: "high", result: "Action-packed outdoor adventure experience" },
            { mood: "adventure", activity: "high", result: "Rockclimbing expedition with guides" },
            { mood: "luxury", activity: "low", result: "Private suite with relaxation services" },
            { mood: "luxury", activity: "medium", result: "Premium stay with curated activities" },
            { mood: "luxury", activity: "medium", result: "Private art gallery viewing with expert host" },
            { mood: "luxury", activity: "high", result: "Helicopter tour with private glacier landing" },
            { mood: "luxury", activity: "high", result: "Private yacht charter with deep sea diving" }
        ];

        // 1. Recursion - Find an exact match - first match found
        const recursiveMatch = findMatchRecursive(experiences, moodValue, activityValue, 0);

        // 2. System Scoring
        // Mood is weighted higher than activity
        const scored = experiences.map(exp => {
            let score = 0;

            // Assign higher weight to mood match
            if (exp.mood === moodValue) score += 2;

            // Assign lower weight to activity match
            if (exp.activity === activityValue) score += 1;

            return { ...exp, score };
        });

        // Sort results by score (highest first)
        const sorted = scored.sort((a, b) => b.score - a.score);

        // Take top 2 recommendations
        const topResults = sorted.slice(0, 2);

        // 3. External Library (Lodash): random bonus suggestion
        const randomBonus = _.sample(bonusActivities);

        // 4. Display results to user
        displayResults(nameValue, topResults, randomBonus, recursiveMatch);

    } catch (err) {
        // show error message
        resultDiv.style.display = "inline-block";
        resultDiv.innerHTML = `<div class="error-message">⚠️ ${err.message}</div>`;
        console.error("Validation Error:", err.message);
    } finally {
        // Always runs - useful for debugging/logging
        console.log("Recommendation attempt completed at: " + new Date().toLocaleDateString());
    }
}

/**
 * Recursion Function
 * Searches for the first exact match in the array
 */

function findMatchRecursive(experiences, mood, activity, index) {
    // Base Case: reached end of array
    if (index >= experiences.length) {
        return "No exact match found";
    }

    const current = experiences[index];

    // Base Case: match found
    if (current.mood === mood && current.activity === activity) {
        return current.result;
    }

    // Recursive call: check next time
    return findMatchRecursive(experiences, mood, activity, index + 1);
}

/**
 * Display Function 
 * Updates the DOM with recommendations
 */
function displayResults(userName, results, bonus, recursiveResult) {
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "inline-block";

    let headerText = userName
        ? `Recommendations for ${userName}:` 
        : `Your Recommendations:`;

    let output = `<h3>${headerText}</h3>`;

    // Loop through top results
    results.forEach((res) => {
        output += `
            <p>
                ⭐ ${res.result}
                <span class="score-text">Match Score: ${res.score}</span>
            </p>`;
        });

    output += `<hr>`;

    // Show recursion result
    if (recursiveResult !== "No exact match found") {
        output += `<p><strong>Exact Match Found via Recursion:</strong><br>${recursiveResult}</p>`;
    } else {
        output += `<p><em>No exact match found. Showing best alternatives</em></p>`;
    }

    // Bonus activity
    output += `<p><strong>Bonus Activity:</strong> ${bonus}</p>`;
    
    resultDiv.innerHTML = output;
}