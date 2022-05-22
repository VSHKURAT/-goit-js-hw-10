import template from '../src/card.hbs'
import './css/styles.css';
import { fetchCountries } from './fetch-countries'
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
const DEBOUNCE_DELAY = 300;


const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
}

refs.input.addEventListener('keydown', action => {

if(action.key === 'Backspace'){
clearList()
clearCountryInfo()
}
})

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY))

function onInput(event){

const userInput = event.target.value.trim()
if(userInput === ""){
    return Notify.failure('Please start enter your country')
}

fetchCountries(userInput)
.then(responce => responce.json())
.then(data =>  {
    
    if(data.message === 'Not Found'){
        return Notify.failure(`Oops, there is no country with that name`)
        }
if(data.length > 10){
    
    Notify.info('Too many matches found. Please enter a more specific name.')
} else 
if(data.length < 10 && data.length >= 2){
    makeListMarkup(data)

}else{
    makeCountryInfo(data)
}
})
.catch(error => Notify.failure(`Oops smth wrong`))
  

}

function makeListMarkup(data){
    const markup = data.reduce((acc, country) => {
     return   acc += `<li><img src =${country.flags.png} width = 70px></img>${country.name.official}</li>`
    },'')
    refs.countryList.innerHTML = markup
    }

function clearList(){
refs.countryList.innerHTML = ''
}


function clearCountryInfo(){
refs.countryInfo.innerHTML = ''
}

function makeCountryInfo(data){
clearList()
const info = data[0]

const markupCountry = template(info)
refs.countryInfo.innerHTML = markupCountry
}
