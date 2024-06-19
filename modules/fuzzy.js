import { constmf } from './mf.js';
class Fuzzy {
    static complement(mf) {
	return x => 1 - mf(x);
    }

    static intersection(...mfs) {
	return x => Math.min(...mfs.map(mf => mf(x)));
    }

    static union(...mfs) {
	console.log("Checking mfs: ", mfs);
	return x => Math.max(...mfs.map(mf => mf(x)));
    }

    static mamdani(rules, startpos, endpos) {
	const rule_mfs = rules.map(rule => x => Fuzzy.intersection(constmf(rule.antecedent), rule.consequent)(x));

	const xvals = [];
	for (let x = startpos; x <= endpos; x += 0.01) {
	    xvals.push(x);
	}

	const yvals = xvals.map(x => rule_mfs.reduce((acc, mf) => Fuzzy.union(acc, mf)(x), constmf(0)));

	const num = xvals.reduce((acc, x, idx) => acc + x * yvals[idx], 0);
	const den = yvals.reduce((acc, val) => acc + val, 0);

	return den === 0 ? 0 : numerator /denominator;
    }

    static sugeno(rules) {
	console.log(rules);

	const num = rules.reduce((acc, rule) => acc + rule.antecedent * rule.consequent, 0);
	const den = rules.reduce((acc, rule) => acc + rule.antecedent, 0);
	
	return den === 0 ? 0 : num/den;
    }
}

class Rule {
    constructor(antecedent, consequent) {
	this.antecedent = this.generateAntecedent(antecedent);
	this.consequent = consequent;
    }

    generateAntecedent(antecedent) {
	if (!Array.isArray(antecedent)) {
	    return antecedent;
	} else if (antecedent.length % 2 === 0) {
	    throw new Error("Invalid antecedent!");
	}

	let constValue = antecedent[0];
	for (let i = 1; i < antecedent.length; i += 2) {
	    const func = antecedent[i];
	    const value = antecedent[i+1];
	    if (func === "and") {
		constValue = Math.min(constValue, value);
	    } else if (func === "or") {
		constValue = Math.max(constValue, value);
	    }
	}

	return constValue;
    }
}

export { Fuzzy, Rule }
