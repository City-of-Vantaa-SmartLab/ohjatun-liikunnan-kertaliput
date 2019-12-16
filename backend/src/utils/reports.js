module.exports = {
    validateYear: (year) => {
        if (typeof year !== 'number' || isNaN(year)
            || year > new Date().getFullYear() || year < 2017) {
            return 'Year is invalid';
        }
    },
};
