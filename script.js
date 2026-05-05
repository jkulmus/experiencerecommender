/**
 * Experience Recommendation Tool
 * By: Jacquelyn Kulmus
 * * This script manages a recommendation engine using a weighted scoring algorithm,
 * recursive searching, and external library integration using Lodash.
 */

// Bonus Activity Array for Lodash randomization
const bonusActivities = [
    "Live performance show",
    "Guided tour",
    "Exclusive dining experience",
    "Evening entertainment event", 
    "VIP Backstand pass",
    "Local artisan workshop"
];

// Event listener for button
document.getElementById("recommendBtn").addEventListener("click", generateRecommendation);

// Main Function
// Demonstrates: Exception handling, array methods, and usage of a library
function generateRecommendation() {
    const resultDiv = document.getElementById("result");
    const nameValue = document.getElementById("name").value.trim();
    const moodValue = document.getElementById("mood").value;
    const activityValue = document.getElementById("activity").value;

    try {
        // -- STRETCH CHALLENGE: Exception Handling --
        // Throw errors if the user hasn't provided the necessary input
        if (!moodValue || ! activityValue) {
            throw new Error("Missing Preferences: Please select both a Mood and an Activity Level");
        }

        if (nameValue.length > 20) {
            throw new Error("Invalid Name: Please keep the name under 20 characters");
        }

        //Main Data Array
        const experiences = [
            { mood: "relaxing", activity: "low", result: "Peaceful garden retreat with spa access" },
            { mood: "relaxing", activity: "medium", result: "Scenic nature walk with picnic experience" },
            { mood: "relaxing", activity: "high", result: "Yoga retreat with mountain hiking" },
            { mood: "relaxing", activity: "low", result: "Library lounge with your favorite beverage" },
            { mood: "adventure", activity: "low", result: "Hot air balloon ride at sunrise" },
            { mood: "adventure", activity: "medium", result: "Off-road Jeep tour through canyon lands" },
            { mood: "adventure", activity: "high", result: "Action-packed outdoor adventure experience" },
            { mood: "adventure", activity: "medium", result: "Guided exploration and outdoor excursions" },
            { mood: "luxury", activity: "medium", result: "Premium stay with curated activities" },
            { mood: "luxury", activity: "low", result: "Private suite with relaxation services" },
            { mood: "luxury", activity: "high", result: "Helicopter tour with private glacier landing" },
            { mood: "luxury", activity: "high", result: "Private yatch charter with deep sea diving" }
        ];

        // 1. Recursion - Find an exact match
        const recursiveMatch = findMatchRecursive(experiences, moodValue, activityValue, 0);

        // 2. System Scoring -> use .map to create a new array with calculated scores
        const scored = experiences.map(exp => {
            let score = 0;
            if (exp.mood === moodValue) score += 2;
            if (exp.activity === activityValue) score += 1;
            return { ...exp, score };
        });

        // Use .sort to rank activity by highest score and .slice to get top 2
        const sorted = scored.sort((a, b) => b.score - a.score);
        const topResults = sorted.slice(0, 2);

        // 3. External Library - Lodash to sample random bonus activities
        const randomBonus = _.sample(bonusActivities);

        // 4. Display 
        displayResults(nameValue, topResults, randomBonus, recursiveMatch);
    } catch (err) {
        // catch the error throw above
        resultDiv.style.display = "inline-block";
        resultDiv.innerHTML = `<p style='color: #d9534f; font-weight: bold;'>⚠️ Error: ${err.message}</p>`;
        console.error("Validation Error:", err.message);
    } finally {
        // runs regardless of success or failure
        console.log("Recommendation attempt completed at: " + new Date().toLocaleDateString());
    }
}

/**
 * Recursion Logic:
 * Searches for an exact match by iterating through the array recursively
 */

function findMatchRecursive(experiences, mood, activity, index) {
    // Base Case: Array exhausted
    if (index >= experiences.length) {
        return "No exact match found";
    }

    const current = experiences[index];

    // Base Case: Check for exact match
    if (current.mood === mood && current.activity === activity) {
        return current.result;
    }

    // Recursive call: move to the next item in ghe array
    return findMatchRecursive(experiences, mood, activity, index + 1);
}

/**
 * Display Function - Updates the DOM with results
 */
function displayResults(userName, results, bonus, recursiveResult) {
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "inline-block";

    let headerText = userName? `Recommendations for ${userName}:` : `Your Recommendations:`;
    let output = `<h3>${headerText}</h3>`;

    // .forEach to build top matches list
    results.forEach((res) => {
        output += `
            <p>
                ⭐ ${res.result}
                <span class="score-text">Match Score: ${res.score}</span>
            </p>`;
        });

    output += `<hr>`;

    // Recursion display
    if (recursiveResult !== "No exact match found") {
        output += `<p><strong>Exact Match Found via Recursion:</strong><br>${recursiveResult}</p>`;
    } else {
        output += `<p><em>Note: No exact match found for this combo. Showing best alternatives</em></p>`;
    }

    // Display Lodash bonus
    output += `<p><strong>Bonus Activity:</strong> ${bonus}</p>`;
    

    resultDiv.innerHTML = output;
}