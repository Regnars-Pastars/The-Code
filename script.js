/* Visi mājaslapas futbola dati */
let awardsData;
window.addEventListener("load", () =>{
    fetch("awards.json")
        .then(response => response.json())
        .then(data => awardsData = data);
});

const input = document.getElementById('myInput');

input.addEventListener('change', function() {
    const val = Number(this.value);
    const allowedException = 1863;

    if (val !== allowedException && val < Number(this.min)) {
        this.value = this.min;
    }
});

function searchYear() {
    const year = document.getElementById("yearInput").value;
    const result = document.getElementById("result");

    if (year === "") {
        result.style.display = "block";
        result.innerHTML = `
            <h3>Ievadi gadu!</h3>
        `;
        return;
    }else if (year == 1863){
        result.style.display = "block";
        result.innerHTML = `
            <h3>1863</h3>
            <p>
                ${awardsData[year]["Vēsture"]}
            </p>
        `;
        return;
    }else if (year < 1930 || year > 2027) {
        result.style.display = "block";
        result.innerHTML = `
        <h3>Ievadi gadu no 1930 - 2027</h3>
        `
        return;
    }


    if (awardsData[year]) {
        result.style.display = "block";
        let html = `<h3>${year}</h3>`
        for (const awards in awardsData[year]){
            html += `
            <p>
                <b>${awards}</b>
                ${awardsData[year][awards]}
            </p>`;
        }
        result.innerHTML = html

    } else {
        result.style.display = "block";

        result.innerHTML = `
            <h3>${year}</h3>
            <p>
                Par šo gadu vēl nav pievienoti apbalvojumi. (tie tiks pievienoti, kad apbalvojumi tiks izsniegti un oficiāli publicēti)
            </p>
        `;
    }
}

document.getElementById("yearInput").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchYear();
    }
});


async function searchTeam() {
    const teamName = document.getElementById("teamInput").value.trim();
    const result = document.getElementById("teamResult");

    if (teamName === "") {
        result.style.display = "block";
        result.innerHTML = `
            <h3>Ievadi komandas nosaukumu!</h3>
        `;
        return;
    } else if (!/^[a-zA-Z\s]+$/.test(teamName)) {
        result.style.display = "block";
        result.innerHTML = `
            <h3>Ievadi derīgu komandas nosaukumu!</h3>
        `;
        return;
    } else if (teamName.length < 3) {
        result.style.display = "block";
        result.innerHTML = `
            <h3>Ievadi komandas nosaukumu ar vismaz 3 simboliem!</h3>
        `;
        return;
    }
    try {
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${teamName}`);
        const data = await response.json();
        const teams = data.teams;

        if (!teams) {
            result.style.display = "block";
            result.innerHTML = `
                <h3>Komanda nav atrasta!</h3>
            `;
            return;
        }


const team = teams[0];

result.style.display = "block";
result.innerHTML = `
    <h3>${team.strTeam}</h3>
    <p><b>Badge:</b> ${team.strBadge ? `<img src="${team.strBadge}" alt="Komandas badge" width="100">` : ""}</p>
    <p><b>Valsts:</b> ${team.strCountry || "Nav info"}</p>
    <p><b>Copetitions:</b> ${
        [
            team.strLeague,
            team.strLeague2,
            team.strLeague3,
            team.strLeague4,
            team.strLeague5,
            team.strLeague6,
            team.strLeague7
        ]
        .filter(league => league)
        .join(", ") || "Nav info"
    }</p><br>
    <p><b>Dibināšanas gads:</b> ${team.intFormedYear || "Nav info"}</p>
    <p><b>Apraksts:</b> ${team.strDescriptionEN || "Nav info"}</p>
    <p><b>Stadions:</b> ${team.strStadium || "Nav info"}</p>
    <p><b>Logo:</b> ${team.strLogo ? `<img src="${team.strLogo}" alt="Komandas logo" width="auto">` : ""}</p>
    <p><b>Mājaslapa:</b> ${team.strWebsite || "Nav info"}</p>
    `;
    } catch (error) {
        result.style.display = "block";
        result.innerHTML = `
            <h3>Kaut kas nogāja greizi. Mēģini vēlreiz!</h3>
            <p>${error.message}</p>
        `;
        return;
    }
}