import { trimf, zbimf, sbimf, constmf } from './mf.js';
import { Rule, Fuzzy } from './fuzzy.js';

async function parseData() {
    try {
	const response = await fetch('data.json');
	
	if (!response.ok) throw new Error();

	const data = await response.json();
	return data;
    } catch (error) {
	console.error("Cannot load the JSON file: ", error);
	return null;
    }
}

function addStatementsToForm(categories) {
    const form = document.querySelector("#rating-form");
    const price = document.querySelector("#bill");

    categories.forEach(category => {
	category.subcategories.forEach(subcategory => {
	    const set = document.createElement("div");
	    set.className = 'my-4 px-4';

	    set.innerHTML = `
		<p class="text-center">${subcategory.statement}</p>
		<label for="${subcategory.name}" class="form-label">Disagree</label>
		<label for="${subcategory.name}" class="form-label float-end">Agree</label>
		<input type="range" min="1" max="5" value="3" class="form-range" id="${subcategory.name}" required>
		<hr>
	    `;
	    
	    form.insertBefore(set, price);
	});
    });
}

export async function prepareSurvey() {
    const data = await parseData();

    if (!data) {
	return [];
    }

    addStatementsToForm(data.categories);
    return data;
}

export function generateRules(ratings, price, values) {
    return ratings.map(rating =>
	new Rule(
	    values.reduce((acc, current, index, array) => {
		acc.push(trimf(...rating.range)(current));

		if (index !== array.length-1) acc.push('and');

		return acc;
	    }, []), Math.max(rating.mintip, rating.tip*price)
	)
    );
}
