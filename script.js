let visitorData = [];
let selectedIndex = -1;

// ✅ Load JSON Data
async function loadJSON() {
    try {
        const response = await fetch("visitors.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        visitorData = await response.json();

        // ✅ Sort Data by In Time (Descending)
        visitorData.sort((a, b) => new Date(b["In Time"]) - new Date(a["In Time"]));

        populateTable(visitorData);
        updateDateRange();
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

// ✅ Update "From Date - To Date"
function updateDateRange() {
    let validDates = visitorData.map(row => new Date(row["In Time"])).filter(date => !isNaN(date));

    if (validDates.length === 0) {
        document.getElementById("dateRange").innerText = "From: N/A - To: N/A";
        return;
    }

    let firstDate = formatDate(validDates[validDates.length - 1]);
    let lastDate = formatDate(validDates[0]);

    document.getElementById("dateRange").innerText = `From: ${firstDate} - To: ${lastDate}`;
}

// ✅ Format Date (MM/DD/YYYY HH:MM:SS)
function formatDate(date) {
    if (!date || isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-US", { hour12: false });
}

// ✅ Populate Table
function populateTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = data.length === 0 
        ? "<tr><td colspan='6' style='text-align:center; color:red;'>No records found</td></tr>"
        : data.map(row => {
            let missing = row["Out Time"] === "N/A" || new Date(row["Out Time"]).getFullYear() < 2024 ? row["Pass No"] : "";
            return `
                <tr>
                    <td style="text-align: right;">${row.Name || "N/A"}</td>
                    <td>${row["Mobile No"] || "N/A"}</td>
                    <td>${row.Designation || "N/A"}</td>
                    <td>${formatDate(new Date(row["In Time"]))}</td>
                    <td>${formatDate(new Date(row["Out Time"]))}</td>
                    <td>${missing}</td>
                </tr>
            `;
        }).join('');
}

// ✅ Show Auto-Suggestions
function showSuggestions() {
    let searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
    let suggestionsList = document.getElementById("suggestionsList");
    suggestionsList.innerHTML = "";
    selectedIndex = -1;

    if (searchInput.length < 2) {
        suggestionsList.style.display = "none";
        return;
    }

    let suggestions = visitorData.filter(row => 
        row["Mobile No"]?.includes(searchInput) ||
        row.Name?.toLowerCase().includes(searchInput) ||
        row.Company?.toLowerCase().includes(searchInput)
    ).map(row => row["Mobile No"] || row.Name || row.Company);

    suggestions = [...new Set(suggestions)].slice(0, 5);
    if (suggestions.length === 0) {
        suggestionsList.style.display = "none";
        return;
    }

    suggestionsList.innerHTML = suggestions.map((s, index) => 
        `<li data-index="${index}" onclick="selectSuggestion('${s}')">${s}</li>`
    ).join('');
    suggestionsList.style.display = "block";
}

// ✅ Handle Search Selection
function selectSuggestion(value) {
    document.getElementById("searchInput").value = value;
    document.getElementById("suggestionsList").style.display = "none";
    searchData();
}

// ✅ Perform Search
function searchData() {
    let searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
    if (searchInput === "") {
        populateTable(visitorData);
        return;
    }

    let filteredData = visitorData.filter(user => 
        user["Mobile No"]?.includes(searchInput) || 
        user.Name?.toLowerCase().includes(searchInput) ||
        user.Company?.toLowerCase().includes(searchInput)
    );

    filteredData.sort((a, b) => new Date(b["In Time"]) - new Date(a["In Time"]));
    populateTable(filteredData);
}

// ✅ Load JSON on Page Load
window.onload = loadJSON;
