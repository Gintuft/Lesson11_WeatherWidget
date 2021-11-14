


function fetchData(method, url, callback) {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.responseType = 'json'
    xhr.onload = function () {
        if (xhr.status == 200) {
            callback(xhr.response)
        } else {
            console.error(xhr.status + ':' + xhr.statusText)

        }
    }
    xhr.onerror = function () {
        alert(`Ошибка ${xhr.status} + ':' + ${xhr.statusText}`)
    }

    xhr.send()
}


const key = '5575b0e31c3b1b31eae69519360ad915'
const urlWetherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`
const urlWetherByDays = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`


function createWindName(degree) {
    let resultWindDeg = ''

    if (degree == 0) {
        resultWindDeg = 'Северный'
    } else if (degree < 90) {
        resultWindDeg = 'Северо-восточный'
    } else if (degree == 90) {
        resultWindDeg = 'Восточный'
    } else if (degree < 180) {
        resultWindDeg = 'Юго-восточный'
    } else if (degree == 180) {
        resultWindDeg = 'Южный'
    } else if (degree < 270) {
        resultWindDeg = 'Юго-западный'
    } else if (degree == 270) {
        resultWindDeg = 'Западный'
    } else {
        resultWindDeg = 'Северо-западный'
    }

    return resultWindDeg
}


function createWidgetTemplate({ city, countryCode, date, temp, windDeg, windSpeed, description, iconSrc }) {

    const resultTemp = Math.round(temp) > 0 ? '+' + Math.round(temp) : Math.round(temp)
    const resultWindDeg = createWindName(windDeg)


    return `
        <div class="widget">
            <div class="header-widget">
                <div class="first-part-header-widget">${city},${countryCode} <br> ${date.getHours()}:${(date.getMinutes()<10?'0':'') + (date.getMinutes())}</div>
                <div class="second-part-header-widget">
                    <img src="${iconSrc}" alt="icon">
                    <h5 class="description">${description}</h5>
                    <h2>${resultTemp}&degC</h2>
                </div>
                <div class="third-part-header-widget">
                    <div>${resultWindDeg}</div>
                    <div>${windSpeed} м/с</div>
                </div>
            </div>
            
        </div>
    `
}

function renderHeader(data) {
    document.body.innerHTML = createWidgetTemplate(data)   
}



function createItemWidgetTemplate({date,temp, iconSrc}){
    const resultTemp = Math.round(temp) > 0 ? '+' + Math.round(temp) : Math.round(temp)
    return `
    <div class="item-widget">
        <div class="item-date"><h5>${date.getFullYear()}-${date.getMonth()}-${date.getDate()} <br> ${date.getHours()}:${(date.getMinutes()<10?'0':'') + (date.getMinutes())} </div>
        <div class="item-icon">
            <img src="${iconSrc}" alt="icon">            
        </div>
        <div class="item-temp"><h5>${resultTemp}&degC</h5></div>
    </div>
    `
}

function renderItem(data) {
    document.body.innerHTML +=  createItemWidgetTemplate(data)   
}



fetchData('GET', urlWetherCurrent, (response) => {
    const data = response
    console.log(data)
    
    const headerDataWidget = {
        city: data.name,
        windDeg: data.wind.deg,
        windSpeed: data.wind.speed,
        date: new Date(data.dt * 1000),
        temp: data.main.temp - 273.15,
        countryCode: data.sys.country,
        description: data.weather[0].description,
        iconSrc: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

    }
    console.log(headerDataWidget)
    renderHeader(headerDataWidget)
    
})

fetchData('GET', urlWetherByDays, (response) => {
    const data = response.list
    const newData = data.filter(function(value, index) {
        return index % 8 == 0;
    })
    console.log(newData)
    
    for (item of newData){
        const itemDataWidget = {
            date: new Date(item.dt * 1000),
            temp: item.main.temp - 273.15,
            iconSrc: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
        }
    renderItem(itemDataWidget)
    console.log(itemDataWidget)    
    }
    
})
