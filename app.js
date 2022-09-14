const search = document.querySelector("#search")
const countryList = document.querySelector(".countryList")
const countryInfos = document.querySelector("#countryInfos")


let countryListElements;

const countries = [];

async function getCountries()
{
    const response = await fetch("https://restcountries.com/v3.1/all");
    let data = await response.json();
    return data
}

getCountries().then(data=>
    {
       countries.push(...data)
    })



function displayCountryList()
{
    countryList.classList.add("list-active")
    const searching = setInterval(()=>
    {
        if(search.value == "") 
        {
            countryList.innerHTML = "" ;
            return;
        }
        let userSearch = search.value;
        let countryFinded = find(userSearch, countries) 
        
        let result = countryFinded.map(country=>
            {
                return `<li class = "countryListEl"><div class = "nameOfCountry">${country.name.common}</div>
                <span>${country.capital}</span></li>`
            })
    
        countryList.innerHTML = result.join("");
        if(countryFinded.length !==0) clearInterval(searching)

        countryListElements = document.querySelectorAll(".countryListEl")
        countryListElements.forEach(el=>el.addEventListener('click', showCountryInfo))
    },500)    

}


function find(word, countries)
{
    return countries.filter(country =>
        {
            const regex = new RegExp(word, 'gi')
            return country.name.common.match(regex) || country.region.match(regex)
        })
}

function showCountryInfo()
{
    //ul cover links and all infos with z-index = 100
    countryList.classList.remove("list-active")
    search.value ="";
    countryList.innerHTML = "";
    let chosenCountryName = this.childNodes[0].textContent;
    let chosenCountryData = find(chosenCountryName, countries)

    let chosenCountryDataAcc =  chosenCountryData.filter(el=>el.name.common == chosenCountryName)


    let currenty = chosenCountryDataAcc[0].currencies

    let currentyVal = currenty[Object.keys(currenty)[0]].name

    let languages = chosenCountryDataAcc[0].languages

    
    let divContent = ` 
    <div class = "leftSide">
        <div class="flagContainer">
            <img src="${chosenCountryDataAcc[0].flags.png}">
        </div>

        <div class = "leftInfo">
            <p>Common name: ${chosenCountryDataAcc[0].name.common}</p>
            <p>Official name: ${chosenCountryDataAcc[0].name.official}</p>
            <p>Capital: ${chosenCountryDataAcc[0].capital}</p>
            <p>Currency: ${currentyVal}</p>
        </div>

        
    </div> 
    
    <div class = "rightSide">
        <p>Region: ${chosenCountryDataAcc[0].subregion}</p>
        <p>Area: ${chosenCountryDataAcc[0].area} m2</p>
        <p>Population: ${chosenCountryDataAcc[0].population}</p>
        <p>Time zone: ${chosenCountryDataAcc[0].timezones}</p>
        <p>Languages : ${Object.values(languages)}</p>
        <p>Dependency: ${chosenCountryDataAcc[0].independent?"Independent":"Dependent"}</p>
        <p><a href ="${chosenCountryDataAcc[0].maps.googleMaps}" target="_blank">${chosenCountryDataAcc[0].name.common} Map</a></p>

    </div>`

    countryInfos.innerHTML = divContent
    
}

search.addEventListener("keyup", displayCountryList)
