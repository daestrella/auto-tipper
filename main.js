import { Fuzzy, Rule } from './modules/fuzzy.js';
import { trapmf, trimf, zbimf, sbimf } from './modules/mf.js';
import { prepareSurvey, generateRules } from './modules/questions.js';

async function initialize() {
    return await prepareSurvey();
}

document.getElementById("price").addEventListener("submit", function(event) {
    event.preventDefault();
});

(async () => {
    const data = await initialize();

    document.getElementById("submit").onclick = async() => {
	let values = data.categories.map(category =>
	    category.subcategories.reduce((acc, subcat) => acc + parseInt(document.getElementById(subcat.name).value), 0)
	    / category.subcategories.length
	);
	console.log(values);
	let price = parseFloat(document.getElementById("price").value);
	console.log(price);

	document.querySelector('#output').innerHTML = `
	    <p>&#8369;&nbsp;${Fuzzy.sugeno(generateRules(data.ratings, price, values)).toFixed(2)}</p>
	`;
    };
})();
