function check_if_sorted(...values) {
    if (!values.every((value, index) => index === 0 || value >= values[index - 1])) {
        throw new Error(`Inputs must be sorted in ascending order to create a membership function. Inputs given: ${values}`);
    }
}

function trapmf(a, b, c, d) {
    check_if_sorted(a, b, c, d);
    return function(x) {
        return Math.max(0, Math.min((x - a) / (b - a), 1, (d - x) / (d - c)));
    };
}

function trimf(a, b, c) {
    check_if_sorted(a, b, c);
    return function(x) {
        return Math.max(0, Math.min((x - a) / (b - a), (c - x) / (c - b)));
    };
}

function zbimf(a, b) {
    check_if_sorted(a, b);
    return function(x) {
        return Math.max(0, Math.min(1, (b - x) / (b - a)));
    };
}

function sbimf(a, b) {
    check_if_sorted(a, b);
    return function(x) {
        return Math.max(0, Math.min(1, (x - a) / (b - a)));
    };
}

function gaussmf(c, sigma) {
    return function(x) {
        return Math.exp(-Math.pow(x - c, 2) / (2 * Math.pow(sigma, 2)));
    };
}

function constmf(constant) {
    return function(x) {
        return constant;
    };
}

export { trapmf, trimf, zbimf, sbimf, gaussmf, constmf }
